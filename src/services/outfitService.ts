import type { WeatherData } from '../types/weather';
import type { OutfitSuggestion, OutfitDecision, LayerLevel, FootwearCategory, AccessoryType } from '../types/outfit';

export function calculateOutfit(weather: WeatherData): OutfitSuggestion {
  const temp = weather.current.apparentTemperature;
  const isRaining = weather.current.precipitation > 0 || (weather.daily.precipitationProbabilityMax && weather.daily.precipitationProbabilityMax[0] > 50);
  const windSpeed = weather.current.windSpeed10m;
  const isSunny = weather.current.weatherCode === 0;

  const suggestion: OutfitSuggestion = {
    timestamp: new Date().toISOString(),
    layers: {
      base: { id: 'base', key: 't_shirt', reasonCode: 'default' },
    },
    footwear: { id: 'sneakers', key: 'sneakers', reasonCode: 'default' },
    accessories: [],
    metadata: {
      primaryFactor: 'temperature',
      isWarning: false
    }
  };

  // 1. Zwiebelschichten basierend auf Temperatur (Gefühlte Temp)
  if (temp < 0) {
    suggestion.layers.base = { id: 'base', key: 'thermal_underwear', reasonCode: 'freezing_temp' };
    suggestion.layers.mid = { id: 'mid', key: 'fleece_sweater', reasonCode: 'insulation_needed' };
    suggestion.layers.outer = { id: 'outer', key: 'heavy_parka', reasonCode: 'protection_cold' };
    suggestion.footwear = { id: 'winter_boots', key: 'winter_boots', reasonCode: 'keep_warm' };
    
    suggestion.accessories.push(
      { id: 'winter_hat', key: 'beanie', reasonCode: 'heat_loss_head' },
      { id: 'gloves', key: 'gloves', reasonCode: 'extremities_cold' },
      { id: 'scarf', key: 'scarf', reasonCode: 'neck_protection' }
    );
  } else if (temp < 10) {
    suggestion.layers.base = { id: 'base', key: 'long_sleeve', reasonCode: 'cool_temp' };
    suggestion.layers.mid = { id: 'mid', key: 'sweater', reasonCode: 'layering' };
    suggestion.layers.outer = { id: 'outer', key: 'winter_coat', reasonCode: 'cold_outer' };
    suggestion.footwear = { id: 'boots', key: 'boots', reasonCode: 'cool_ground' };
  } else if (temp < 18) {
    suggestion.layers.base = { id: 'base', key: 't_shirt', reasonCode: 'mild_temp' };
    suggestion.layers.mid = { id: 'mid', key: 'hoodie', reasonCode: 'optional_warmth' };
    suggestion.layers.outer = { id: 'outer', key: 'light_jacket', reasonCode: 'wind_protection' };
  } else if (temp < 25) {
    suggestion.layers.base = { id: 'base', key: 't_shirt', reasonCode: 'warm_temp' };
    // Keine Mid-Layer
    if (windSpeed > 20) {
      suggestion.layers.outer = { id: 'outer', key: 'windbreaker', reasonCode: 'windy' };
    }
    suggestion.footwear = { id: 'sneakers', key: 'sneakers', reasonCode: 'comfortable' };
  } else {
    // Heiß (> 25)
    suggestion.layers.base = { id: 'base', key: 'tank_top', reasonCode: 'hot_temp' };
    suggestion.footwear = { id: 'sandals', key: 'sandals', reasonCode: 'breathable' };
    if (isSunny) {
      suggestion.accessories.push({ id: 'sun_hat', key: 'cap', reasonCode: 'sun_protection' });
    }
  }

  // 2. Regen-Overrides
  if (isRaining) {
    suggestion.metadata!.primaryFactor = 'precipitation';
    
    // Wenn es nicht extrem kalt ist, ersetzen wir die äußere Schicht durch Regenjacke
    if (temp > 5) {
      suggestion.layers.outer = { id: 'outer', key: 'rain_jacket', reasonCode: 'waterproof' };
    }
    
    suggestion.footwear = { id: 'rain_boots', key: 'rain_boots', reasonCode: 'waterproof_feet' };
    suggestion.accessories.push({ id: 'umbrella', key: 'umbrella', reasonCode: 'stay_dry' });
  }

  // 3. Sonnen-Accessoires (wenn nicht schon Wintermütze drauf ist)
  if (isSunny && temp > 10 && !isRaining) {
    suggestion.accessories.push({ id: 'sunglasses', key: 'sunglasses', reasonCode: 'glare_protection' });
  }

  return suggestion;
}
