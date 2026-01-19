import React, { useEffect, useState } from 'react';
import { fetchWeather } from '../services/weatherService';
import type { WeatherData } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { X } from 'lucide-react';

interface PinnedWeatherCardProps {
    name: string;
    lat: number;
    lon: number;
    onClick: () => void;
    onRemove: (e: React.MouseEvent) => void;
    unit: 'celsius' | 'fahrenheit';
}

export const PinnedWeatherCard: React.FC<PinnedWeatherCardProps> = ({ name, lat, lon, onClick, onRemove, unit }) => {
    const [data, setData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            try {
                const res = await fetchWeather(lat, lon, name);
                if (mounted) {
                    setData(res);
                    setLoading(false);
                }
            } catch (e) {
                console.error('Failed to load pinned weather', e);
                if (mounted) setLoading(false);
            }
        };

        load();

        return () => { mounted = false; };
    }, [lat, lon, name]);

    if (loading) {
        return (
            <div className="weather-summary-card" style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="loading-spinner" style={{ width: '2rem', height: '2rem' }}></div>
            </div>
        );
    }

    if (!data) return null; // Error state silent for now

    const displayTemp = (temp: number) => {
        if (unit === 'fahrenheit') {
            return Math.round((temp * 9 / 5) + 32);
        }
        return Math.round(temp);
    };

    return (
        <div className="weather-summary-card" onClick={onClick} style={{ position: 'relative' }}>
            <button
                onClick={onRemove}
                style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'rgba(0,0,0,0.05)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#ef4444'
                }}
            >
                <X size={16} />
            </button>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>{name}</h3>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <WeatherIcon code={data.current.weatherCode} size={32} color="#3b82f6" />
                <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>{displayTemp(data.current.temperature2m)}°</span>
            </div>
        </div>
    );
};
