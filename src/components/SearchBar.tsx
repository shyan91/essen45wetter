import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { searchCity } from '../services/weatherService';
import type { GeocodingResult } from '../types/weather';

interface SearchBarProps {
  onSelectCity: (lat: number, lon: number, name: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSelectCity }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    
    if (val.length > 2) {
      try {
        const data = await searchCity(val);
        setResults(data);
        setIsOpen(true);
      } catch (err) {
        console.error(err);
      }
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  const handleSelect = (city: GeocodingResult) => {
    onSelectCity(city.latitude, city.longitude, city.name);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="search-container">
      <div className="search-wrapper">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Stadt suchen..."
          className="search-input"
        />
      </div>

      {isOpen && results.length > 0 && (
        <div className="search-results">
          {results.map((city, idx) => (
            <button
              key={`${city.latitude}-${idx}`}
              onClick={() => handleSelect(city)}
              className="search-result-item"
            >
              <span className="city-name">{city.name}</span>
              <span className="city-detail">{city.admin1 ? `${city.admin1}, ` : ''}{city.country}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};