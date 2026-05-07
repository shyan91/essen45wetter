import React from 'react';
import type { WeatherData } from '../types/weather';
import type { OutfitSuggestion } from '../types/outfit';
import { WeatherIcon } from './WeatherIcon';
import { Shirt } from 'lucide-react';
import { translations } from '../services/outfitService';

interface WeatherSummaryProps {
    data: WeatherData;
    outfit: OutfitSuggestion;
    onClick: () => void;
    unit: 'celsius' | 'fahrenheit';
}

export const WeatherSummary: React.FC<WeatherSummaryProps> = ({ data, outfit, onClick, unit }) => {
    const { current, location } = data;

    // Kurze Zusammenfassung des Outfits (nur Outer Layer oder Top Layer)
    const mainLayerKey = outfit.layers.outer?.key || outfit.layers.mid?.key || outfit.layers.base.key;
    const outfitText = translations[mainLayerKey] || 'Outfit Vorschlag';

    const displayTemp = (temp: number) => {
        if (unit === 'fahrenheit') {
            return Math.round((temp * 9 / 5) + 32);
        }
        return Math.round(temp);
    };

    return (
        <div className="weather-summary-card" onClick={onClick}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{location.name}</h2>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <WeatherIcon code={current.weatherCode} size={48} color="#3b82f6" />
                <span style={{ fontSize: '3rem', fontWeight: 'bold' }}>{displayTemp(current.temperature2m)}°</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#4b5563' }}>
                <Shirt size={20} />
                <span style={{ fontWeight: 500 }}>{outfitText}</span>
            </div>

            <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#94a3b8' }}>
                Tippe für Details & Vorhersage
            </p>
        </div>
    );
};
