import { useWeather } from './hooks/useWeather';
import { usePinnedLocations } from './hooks/usePinnedLocations';
import { SearchBar } from './components/SearchBar';
import { CurrentWeather } from './components/CurrentWeather';
import { Forecast } from './components/Forecast';
import { OutfitCard } from './components/OutfitCard';
import { WeatherSummary } from './components/WeatherSummary';
import { PinnedWeatherCard } from './components/PinnedWeatherCard';
import { calculateOutfit } from './services/outfitService';
import { CloudLightning, Pin, PinOff } from 'lucide-react';
import React, { useMemo } from 'react';

function App() {
  const { weather, loading, error, updateWeather } = useWeather();
  const { pinnedLocations, addPin, removePin, isPinned } = usePinnedLocations();
  const [showDetails, setShowDetails] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'current' | 'forecast'>('current');

  const handleSelectCity = (lat: number, lon: number, name: string) => {
    updateWeather(lat, lon, name);
    setShowDetails(false);
  };

  const handlePinToggle = () => {
    if (!weather) return;
    const { name, latitude, longitude } = weather.location;

    if (isPinned(name)) {
      removePin(name);
    } else {
      addPin({ name, lat: latitude, lon: longitude });
    }
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
            {!showDetails ? (
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Main Search Result */}
                <div>
                  <h3 style={{ marginLeft: '0.5rem', marginBottom: '0.5rem', color: '#64748b', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Aktueller Ort</h3>
                  <WeatherSummary
                    data={weather}
                    outfit={outfitSuggestion}
                    onClick={() => setShowDetails(true)}
                  />
                </div>

                {/* Pinned Locations Grid */}
                {pinnedLocations.length > 0 && (
                  <div>
                    <h3 style={{ marginLeft: '0.5rem', marginBottom: '0.5rem', color: '#64748b', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gepinnte Orte</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                      {pinnedLocations.map(pin => (
                        <PinnedWeatherCard
                          key={pin.name}
                          name={pin.name}
                          lat={pin.lat}
                          lon={pin.lon}
                          onClick={() => handleSelectCity(pin.lat, pin.lon, pin.name)}
                          onRemove={(e) => {
                            e.stopPropagation();
                            removePin(pin.name);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="details-container slide-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <button
                    className="back-button"
                    style={{ margin: 0 }}
                    onClick={() => setShowDetails(false)}
                  >
                    ← Zurück zur Übersicht
                  </button>

                  <button
                    onClick={handlePinToggle}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: isPinned(weather.location.name) ? '#eff6ff' : 'transparent',
                      color: isPinned(weather.location.name) ? '#2563eb' : '#64748b',
                      border: isPinned(weather.location.name) ? '1px solid #bfdbfe' : '1px solid transparent',
                      padding: '0.5rem 1rem',
                      borderRadius: '999px',
                      cursor: 'pointer',
                      fontWeight: 500,
                      transition: 'all 0.2s'
                    }}
                  >
                    {isPinned(weather.location.name) ? (
                      <>
                        <PinOff size={16} />
                        Lösen
                      </>
                    ) : (
                      <>
                        <Pin size={16} />
                        Anpinnen
                      </>
                    )}
                  </button>
                </div>

                <div className="tabs">
                  <button
                    className={`tab-button ${activeTab === 'current' ? 'active' : ''}`}
                    onClick={() => setActiveTab('current')}
                  >
                    Aktuell & Outfit
                  </button>
                  <button
                    className={`tab-button ${activeTab === 'forecast' ? 'active' : ''}`}
                    onClick={() => setActiveTab('forecast')}
                  >
                    Vorhersage
                  </button>
                </div>

                <div className="tab-content">
                  {activeTab === 'current' && (
                    <div className="fade-in">
                      <CurrentWeather data={weather} />
                      <OutfitCard suggestion={outfitSuggestion} />
                    </div>
                  )}
                  {activeTab === 'forecast' && (
                    <div className="fade-in">
                      <Forecast data={weather} />
                    </div>
                  )}
                </div>
              </div>
            )}
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