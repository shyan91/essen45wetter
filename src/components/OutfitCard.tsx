import React from 'react';
import type { OutfitSuggestion, OutfitDecision } from '../types/outfit';
import {
  Shirt,
  Umbrella,
  Glasses,
  Sun,
  CloudSnow,
} from 'lucide-react';

interface OutfitCardProps {
  suggestion: OutfitSuggestion;
  minimal?: boolean;
}

// Mapping von maschinenlesbaren Keys zu UI-Texten und Icons
const LABEL_MAP: Record<string, string> = {
  // Layers
  'thermal_underwear': 'Thermowäsche',
  't_shirt': 'T-Shirt',
  'long_sleeve': 'Langarmshirt',
  'tank_top': 'Trägershirt',
  'fleece_sweater': 'Fleece-Pullover',
  'sweater': 'Pullover',
  'hoodie': 'Kapuzenpulli',
  'heavy_parka': 'Dicker Parka',
  'winter_coat': 'Wintermantel',
  'light_jacket': 'Übergangsjacke',
  'windbreaker': 'Windjacke',
  'rain_jacket': 'Regenjacke',

  // Footwear
  'sneakers': 'Sneaker',
  'boots': 'Stiefel',
  'winter_boots': 'Winterstiefel',
  'rain_boots': 'Gummistiefel',
  'sandals': 'Sandalen',

  // Accessories
  'beanie': 'Mütze',
  'gloves': 'Handschuhe',
  'scarf': 'Schal',
  'umbrella': 'Regenschirm',
  'sunglasses': 'Sonnenbrille',
  'cap': 'Kappe'
};

const LayerRow = ({ label, item }: { label: string, item?: OutfitDecision<any> }) => {
  if (!item) return null;
  return (
    <div className="layer-row">
      <span className="layer-label">{label}</span>
      <span className="layer-value">{LABEL_MAP[item.key] || item.key}</span>
    </div>
  );
};

export const OutfitCard: React.FC<OutfitCardProps> = ({ suggestion, minimal = false }) => {
  const { layers, footwear, accessories } = suggestion;

  return (
    <div className={`outfit-card ${minimal ? 'minimal' : ''}`}>
      {!minimal && (
        <div className="outfit-header">
          <div className="outfit-icon-bg">
            <Shirt className="outfit-icon" size={24} />
          </div>
          <div>
            <h3 className="outfit-title">Outfit Vorschlag</h3>
            <p className="outfit-subtitle">Basierend auf Temperatur & Wetter</p>
          </div>
        </div>
      )}

      <div className="layer-list">
        <LayerRow label="Basis" item={layers.base} />
        <LayerRow label="Mitte" item={layers.mid} />
        <LayerRow label="Außen" item={layers.outer} />
        <LayerRow label="Schuhe" item={footwear} />
      </div>

      {accessories.length > 0 && (
        <div className="accessories-section">
          <p className="accessories-title">Empfohlenes Zubehör</p>
          <div className="accessories-grid">
            {accessories.map((acc, idx) => (
              <span
                key={`${acc.key}-${idx}`}
                className="accessory-tag"
              >
                {/* Dynamisches Icon basierend auf Typ */}
                {acc.id === 'umbrella' && <Umbrella size={14} />}
                {acc.id === 'sunglasses' && <Glasses size={14} />}
                {acc.id === 'sun_hat' && <Sun size={14} />}
                {acc.id === 'winter_hat' && <CloudSnow size={14} />}
                <span>{LABEL_MAP[acc.key] || acc.key}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};