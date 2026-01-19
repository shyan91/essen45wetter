/**
 * Definierte Bekleidungsschichten gemäß dem Zwiebelprinzip.
 */
export type LayerLevel = 'base' | 'mid' | 'outer';

/**
 * Kategorisierung von Schuhwerk basierend auf Wetterbedingungen.
 */
export type FootwearCategory = 
  | 'sandals'         // Heiß/Trocken
  | 'sneakers'        // Mild/Trocken
  | 'boots'           // Kühl/Robust
  | 'rain_boots'      // Nass
  | 'winter_boots';   // Kalt/Schnee

/**
 * Typen von Accessoires für spezifischen Schutz.
 */
export type AccessoryType = 
  | 'sunglasses' 
  | 'umbrella' 
  | 'sun_hat' 
  | 'winter_hat' 
  | 'scarf' 
  | 'gloves';

/**
 * Repräsentiert eine spezifische Empfehlung innerhalb des Outfits.
 * @template T Der Typ der Kategorie (Layer, Footwear oder Accessory)
 */
export interface OutfitDecision<T> {
  id: T;
  key: string;        // Maschinenlesbarer Bezeichner für die Komponente (z.B. "heavy_jacket")
  reasonCode: string; // Maschinenlesbare Begründung (z.B. "temp_below_5")
}

/**
 * Das vollständige Outfit-Vorschlag Modell.
 * Enthält nur fachliche Daten, keine UI-Texte.
 */
export interface OutfitSuggestion {
  timestamp: string;
  layers: {
    base: OutfitDecision<LayerLevel>;
    mid?: OutfitDecision<LayerLevel>;
    outer?: OutfitDecision<LayerLevel>;
  };
  footwear: OutfitDecision<FootwearCategory>;
  accessories: OutfitDecision<AccessoryType>[];
  
  /**
   * Optionale Metadaten zur Gesamtentscheidung (z.B. "extreme_weather_warning")
   */
  metadata?: {
    primaryFactor: 'temperature' | 'precipitation' | 'uv' | 'wind';
    isWarning: boolean;
  };
}
