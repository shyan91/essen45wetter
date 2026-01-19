import { useState, useEffect } from 'react';
import type { WeatherData } from '../types/weather';
import { fetchWeather } from '../services/weatherService';

export function useWeather(lat: number = 51.4556, lon: number = 7.0116, name: string = 'Essen') {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
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
    updateWeather(lat, lon, name);
  }, []);

  return { weather, loading, error, updateWeather };
}
