import { useWeather } from './hooks/useWeather';
import { usePinnedLocations } from './hooks/usePinnedLocations';
import { useSettings } from './hooks/useSettings';
import { SearchBar } from './components/SearchBar';
import { CurrentWeather } from './components/CurrentWeather';
import { Forecast } from './components/Forecast';

import { WeatherSummary } from './components/WeatherSummary';
import { PinnedWeatherCard } from './components/PinnedWeatherCard';
import { SettingsModal } from './components/SettingsModal';
import { calculateOutfit } from './services/outfitService';
import { CloudLightning, Pin, PinOff, Settings } from 'lucide-react';
import React, { useMemo, useState } from 'react';

function App() {
  // homeWeather ist immer Essen (oder der initiale Standardwert) und wird auf der Startseite angezeigt
  const { weather: homeWeather, loading: homeLoading } = useWeather();

  // activeWeather ist das Wetter, das in der Detailansicht angezeigt wird (Suche, Pin oder Klick auf Home)
  const { weather, loading, error, updateWeather } = useWeather();

  const { pinnedLocations, addPin, removePin, isPinned } = usePinnedLocations();
  const { settings, toggleTheme, toggleUnit } = useSettings();

  const [showDetails, setShowDetails] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'current' | 'forecast'>('current');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleSelectCity = (lat: number, lon: number, name: string) => {
    updateWeather(lat, lon, name);
    setShowDetails(true); // Sofort zur Detailansicht wechseln
  };

  const handleHomeClick = () => {
    if (homeWeather) {
      updateWeather(homeWeather.location.latitude, homeWeather.location.longitude, homeWeather.location.name);
      setShowDetails(true);
    }
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

  // Berechne Outfit basierend auf dem GLEICHEN Wetter wie in der Anzeige
  // Im Overview nutzen wir homeWeather, in Details nutzen wir weather
  const activeOutfit = useMemo(() => {
    if (showDetails) {
      return weather ? calculateOutfit(weather) : null;
    } else {
      return homeWeather ? calculateOutfit(homeWeather) : null;
    }
  }, [weather, homeWeather, showDetails]);

  return (
    <div className="app-container">
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        toggleTheme={toggleTheme}
        toggleUnit={toggleUnit}
      />

      {/* Header Area */}
      <header className="main-header">
        <div className="header-content" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CloudLightning size={32} strokeWidth={2.5} />
            <h1 className="header-title">Essen45 Wetter</h1>
          </div>
          <button
            onClick={() => setIsSettingsOpen(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: '0.5rem' }}
          >
            <Settings size={24} />
          </button>
        </div>
      </header>

      <main className="main-content">
        <SearchBar onSelectCity={handleSelectCity} />

        {/* Global Loading/Error mainly for the Detail View or initial Load */}
        {showDetails && loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5rem 0' }}>
            <div className="loading-spinner"></div>
            <p style={{ color: '#64748b', fontWeight: 500 }}>Lade Wetterdaten...</p>
          </div>
        )}

        {showDetails && error && (
          <div className="error-box">
            <p style={{ fontWeight: 'bold' }}>Hoppla!</p>
            <p>{error}</p>
          </div>
        )}

        {!showDetails ? (
          /* OVERVIEW */
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem', flex: 1 }}>
            {/* Home / Current Location Card */}
            <div>
              <h3 style={{ marginLeft: '0.5rem', marginBottom: '0.5rem', color: '#64748b', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Aktueller Ort</h3>

              {homeLoading && <div className="loading-spinner"></div>}

              {!homeLoading && homeWeather && activeOutfit && (
                <WeatherSummary
                  data={homeWeather}
                  outfit={activeOutfit}
                  onClick={handleHomeClick}
                  unit={settings.unit}
                />
              )}
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
                      unit={settings.unit}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* DETAIL VIEW */
          !loading && !error && weather && activeOutfit && (
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
                    <CurrentWeather data={weather} unit={settings.unit} outfit={activeOutfit} />
                  </div>
                )}
                {activeTab === 'forecast' && (
                  <div className="fade-in">
                    <Forecast data={weather} unit={settings.unit} />
                  </div>
                )}
              </div>
            </div>
          )
        )}
      </main>

      <footer>
        <p>© {new Date().getFullYear()} Essen45 Wetter • Daten von Open-Meteo</p>
      </footer>
    </div>
  );
}

export default App;