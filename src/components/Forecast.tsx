import React from 'react';
import type { WeatherData } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { Umbrella } from 'lucide-react';

interface ForecastProps {
  data: WeatherData;
  unit: 'celsius' | 'fahrenheit';
}

export const Forecast: React.FC<ForecastProps> = ({ data, unit }) => {
  const { daily } = data;

  const displayTemp = (temp: number) => {
    if (unit === 'fahrenheit') {
      return Math.round((temp * 9 / 5) + 32);
    }
    return Math.round(temp);
  };

  return (
    <div className="forecast-container">
      <h3 className="forecast-title">7-Tage Vorhersage</h3>
      <div className="forecast-list">
        {daily.time.slice(1).map((time, index) => {
          // Index + 1 weil wir heute überspringen
          const rainChance = daily.precipitationProbabilityMax ? daily.precipitationProbabilityMax[index + 1] : 0;

          return (
            <div key={time} className="forecast-item">
              <span className="day-name">
                {new Date(time).toLocaleDateString('de-DE', { weekday: 'short' })}
              </span>

              <div className="forecast-icon-wrapper">
                <WeatherIcon code={daily.weatherCode[index + 1]} size={24} color="#3b82f6" />
                <span className="forecast-desc">
                  {daily.weatherCode[index + 1] === 0 ? 'Sonnig' : 'Bewölkt'}
                </span>

                {/* Regenwahrscheinlichkeit Badge */}
                {rainChance > 0 && (
                  <div className="rain-chance">
                    <Umbrella size={12} strokeWidth={3} />
                    <span>{rainChance}%</span>
                  </div>
                )}
              </div>

              <div className="temp-range">
                <span className="temp-high">{displayTemp(daily.temperature2mMax[index + 1])}°</span>
                <span className="temp-low">{displayTemp(daily.temperature2mMin[index + 1])}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
