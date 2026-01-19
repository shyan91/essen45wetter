import type { WeatherData } from '../types/weather';

const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';
const AIR_QUALITY_API_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality';

export async function fetchWeather(lat: number, lon: number, cityName: string): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset',
    timezone: 'auto'
  });

  const aqiParams = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: 'european_aqi'
  });

  // Parallele Anfragen für maximale Geschwindigkeit
  const [weatherRes, aqiRes] = await Promise.all([
    fetch(`${WEATHER_API_URL}?${params.toString()}`),
    fetch(`${AIR_QUALITY_API_URL}?${aqiParams.toString()}`)
  ]);
  
  if (!weatherRes.ok) {
    throw new Error('Wetterdaten konnten nicht geladen werden.');
  }

  const data = await weatherRes.json();
  let aqiData = null;

  // AQI ist optional, falls der Service mal nicht erreichbar ist, stürzt die App nicht ab
  if (aqiRes.ok) {
    aqiData = await aqiRes.json();
  }

  return {
    current: {
      time: data.current.time,
      temperature2m: data.current.temperature_2m,
      relativeHumidity2m: data.current.relative_humidity_2m,
      apparentTemperature: data.current.apparent_temperature,
      isDay: data.current.is_day,
      precipitation: data.current.precipitation,
      weatherCode: data.current.weather_code,
      windSpeed10m: data.current.wind_speed_10m,
      europeanAqi: aqiData?.current?.european_aqi
    },
    daily: {
      time: data.daily.time,
      weatherCode: data.daily.weather_code,
      temperature2mMax: data.daily.temperature_2m_max,
      temperature2mMin: data.daily.temperature_2m_min,
      precipitationProbabilityMax: data.daily.precipitation_probability_max,
      sunrise: data.daily.sunrise,
      sunset: data.daily.sunset,
    },
    location: {
      name: cityName,
      latitude: lat,
      longitude: lon,
    }
  };
}

export async function searchCity(query: string) {
  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=de&format=json`);
  
  if (!response.ok) {
    throw new Error('Suche fehlgeschlagen.');
  }

  const data = await response.json();
  return data.results || [];
}
