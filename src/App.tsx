import { useWeather } from './hooks/useWeather';
import { SearchBar } from './components/SearchBar';
import { CurrentWeather } from './components/CurrentWeather';
import { Forecast } from './components/Forecast';
import { OutfitCard } from './components/OutfitCard';
import { calculateOutfit } from './services/outfitService';
import { CloudLightning } from 'lucide-react';
import { useMemo } from 'react';

function App() {
  const { weather, loading, error, updateWeather } = useWeather();

  const handleSelectCity = (lat: number, lon: number, name: string) => {
    updateWeather(lat, lon, name);
  };

  // Berechne Outfit nur neu, wenn sich das Wetter ändert
  const outfitSuggestion = useMemo(() => {
    if (!weather) return null;
    return calculateOutfit(weather);
  }, [weather]);

  return (
    <div className="app-container">
      {/* Header Area */}
      <header className="main-header">
        <div className="header-content">
          <CloudLightning size={32} strokeWidth={2.5} />
          <h1 className="header-title">Essen45 Wetter</h1>
        </div>
      </header>

      <main className="main-content">
        <SearchBar onSelectCity={handleSelectCity} />

        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5rem 0' }}>
            <div className="loading-spinner"></div>
            <p style={{ color: '#64748b', fontWeight: 500 }}>Lade Wetterdaten...</p>
          </div>
        )}

        {error && (
          <div className="error-box">
            <p style={{ fontWeight: 'bold' }}>Hoppla!</p>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && weather && outfitSuggestion && (
          <>
            <CurrentWeather data={weather} />
            <OutfitCard suggestion={outfitSuggestion} />
            <Forecast data={weather} />
          </>
        )}
      </main>

      <footer>
        <p>© {new Date().getFullYear()} Essen45 Wetter • Daten von Open-Meteo</p>
      </footer>
    </div>
  );
}

export default App;