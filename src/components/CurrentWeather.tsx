import React from 'react';
import type { WeatherData } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { Droplets, Wind, Thermometer, Umbrella, Activity } from 'lucide-react';

interface CurrentWeatherProps {
  data: WeatherData;
}

// Helper Funktion für AQI Interpretation
const getAqiInfo = (aqi: number) => {
  if (aqi < 20) return { text: 'Sehr Gut', color: '#16a34a' }; // green-600
  if (aqi < 40) return { text: 'Gut', color: '#65a30d' };      // lime-600
  if (aqi < 60) return { text: 'Mäßig', color: '#ca8a04' };    // yellow-600
  if (aqi < 80) return { text: 'Schlecht', color: '#ea580c' }; // orange-600
  return { text: 'Sehr Schlecht', color: '#dc2626' };          // red-600
};

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data }) => {
  const { current, daily, location } = data;

  const todayRainChance = daily.precipitationProbabilityMax ? daily.precipitationProbabilityMax[0] : 0;
  
  // AQI Info abrufen (Default fallback falls undefined)
  const aqiInfo = current.europeanAqi !== undefined ? getAqiInfo(current.europeanAqi) : null;

  return (
    <div className="weather-card">
      <div className="weather-header">
        <div>
          <h2 className="location-title">{location.name}</h2>
          <p className="date-text">
            {new Date(current.time).toLocaleDateString('de-DE', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long' 
            })}
          </p>
        </div>
        <WeatherIcon code={current.weatherCode} size={64} color="#3b82f6" />
      </div>

      <div className="main-temp-container">
        <div className="temp-display">
          <span className="temp-value">
            {Math.round(current.temperature2m)}°
          </span>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="feels-like">
              <Thermometer size={16} />
              Gefühlt {Math.round(current.apparentTemperature)}°
            </span>
          </div>
        </div>

        {/* 4 Spalten Grid für alle Stats */}
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))' }}>
          <div className="stat-box humidity">
            <Droplets className="text-blue" size={20} />
            <div>
              <p className="stat-label text-blue">Feuchtigkeit</p>
              <p className="stat-value" style={{ color: '#1e3a8a' }}>{current.relativeHumidity2m}%</p>
            </div>
          </div>
          
          <div className="stat-box wind">
            <Wind className="text-gray" size={20} />
            <div>
              <p className="stat-label text-gray">Wind</p>
              <p className="stat-value" style={{ color: '#111827' }}>{Math.round(current.windSpeed10m)} km/h</p>
            </div>
          </div>

          <div className="stat-box rain">
            <Umbrella className="text-blue" size={20} color="#059669" />
            <div>
              <p className="stat-label" style={{ color: '#059669' }}>Regen</p>
              <p className="stat-value" style={{ color: '#064e3b' }}>{todayRainChance}%</p>
            </div>
          </div>

          {aqiInfo && (
            <div className="stat-box aqi">
              <Activity size={20} color={aqiInfo.color} />
              <div>
                <p className="stat-label" style={{ color: aqiInfo.color }}>Luftqualität</p>
                <p className="stat-value" style={{ color: aqiInfo.color, fontSize: '1rem' }}>{aqiInfo.text}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};