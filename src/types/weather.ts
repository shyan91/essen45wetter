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
    europeanAqi?: number; // Neu: Luftqualität (optional, falls API mal ausfällt)
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
