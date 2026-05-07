export interface WeatherData {
  current: {
    time: string;
    temperature2m: number;
    relativeHumidity2m: number;
    apparentTemperature: number;
    isDay: number;
    precipitation: number;
    weatherCode: number;
    windSpeed10m: number;
    europeanAqi?: number;
    uvIndex?: number;
    visibility?: number;
    pollen?: {
      alder: number;
      birch: number;
      grass: number;
      mugwort: number;
      olive: number;
      ragweed: number;
    };
  };
  daily: {
    time: string[];
    weatherCode: number[];
    temperature2mMax: number[];
    temperature2mMin: number[];
    precipitationProbabilityMax: number[];
    sunrise: string[];
    sunset: string[];
  };
  location: {
    name: string;
    latitude: number;
    longitude: number;
  };
}

export interface GeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}
