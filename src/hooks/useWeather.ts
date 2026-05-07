import { useState, useEffect } from 'react';
import type { WeatherData } from '../types/weather';
import { fetchWeather } from '../services/weatherService';
import { fetchUserLocation } from '../services/locationService';

export function useWeather(initLat?: number, initLon?: number, initName?: string, skipInit: boolean = false) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(!skipInit);
  const [error, setError] = useState<string | null>(null);

  const updateWeather = async (newLat: number, newLon: number, newName: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeather(newLat, newLon, newName);
      setWeather(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (skipInit) return;

    const initializeWeather = async () => {
      if (initLat !== undefined && initLon !== undefined && initName !== undefined) {
        await updateWeather(initLat, initLon, initName);
      } else {
        setLoading(true);
        const loc = await fetchUserLocation();
        await updateWeather(loc.latitude, loc.longitude, loc.city);
      }
    };

    initializeWeather();
  }, [initLat, initLon, initName, skipInit]);

  return { weather, loading, error, updateWeather };
}
