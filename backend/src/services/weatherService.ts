import axios from 'axios';
import WeatherCache from '../models/WeatherCache';

const BASE_URL = process.env.WEATHER_API_BASE_URL || 'https://api.open-meteo.com/v1';
const CACHE_MINUTES = 15;

const WMO_CODES: Record<number, string> = {
  0: 'Clear Sky', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Icy Fog', 51: 'Light Drizzle', 53: 'Drizzle',
  55: 'Dense Drizzle', 61: 'Slight Rain', 63: 'Rain', 65: 'Heavy Rain',
  71: 'Slight Snow', 73: 'Snow', 75: 'Heavy Snow', 77: 'Snow Grains',
  80: 'Slight Showers', 81: 'Showers', 82: 'Violent Showers',
  85: 'Snow Showers', 86: 'Heavy Snow Showers',
  95: 'Thunderstorm', 96: 'Thunderstorm with Hail', 99: 'Thunderstorm with Heavy Hail',
};

const makeLocationKey = (lat: number, lng: number) =>
  `${lat.toFixed(2)}:${lng.toFixed(2)}`;

const fetchFromOpenMeteo = async (lat: number, lng: number) => {
  const url = `${BASE_URL}/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,rain,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,sunrise,sunset&timezone=auto&forecast_days=4`;

  const { data } = await axios.get(url, { timeout: 10000 });

  const current = data.current;
  const daily = data.daily;

  const currentWeather = {
    temperature: Math.round(current.temperature_2m),
    apparentTemperature: Math.round(current.apparent_temperature),
    humidity: current.relative_humidity_2m,
    rain: current.rain,
    precipitation: current.precipitation,
    weatherCode: current.weather_code,
    condition: WMO_CODES[current.weather_code as number] || 'Unknown',
    cloudCover: current.cloud_cover,
    windSpeed: Math.round(current.wind_speed_10m),
    windDirection: current.wind_direction_10m,
    updatedAt: current.time,
  };

  const forecast = (daily.time as string[]).map((date: string, i: number) => ({
    date,
    day: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : date,
    tempMax: Math.round((daily.temperature_2m_max as number[])[i]),
    tempMin: Math.round((daily.temperature_2m_min as number[])[i]),
    rainfall: (daily.precipitation_sum as number[])[i],
    rainProbability: (daily.precipitation_probability_max as number[])[i],
    weatherCode: (daily.weather_code as number[])[i],
    condition: WMO_CODES[(daily.weather_code as number[])[i]] || 'Unknown',
    windSpeed: Math.round((daily.wind_speed_10m_max as number[])[i]),
    sunrise: (daily.sunrise as string[])[i],
    sunset: (daily.sunset as string[])[i],
  }));

  return { currentWeather, forecast };
};

export const getWeatherData = async (lat: number, lng: number) => {
  const locationKey = makeLocationKey(lat, lng);

  // Check cache
  const cached = await WeatherCache.findOne({ locationKey, expiresAt: { $gt: new Date() } });
  if (cached) {
    return {
      current: cached.currentWeather,
      forecast: cached.forecast,
      fromCache: true,
      cachedAt: cached.fetchedAt,
    };
  }

  const { currentWeather, forecast } = await fetchFromOpenMeteo(lat, lng);

  const expiresAt = new Date(Date.now() + CACHE_MINUTES * 60 * 1000);
  await WeatherCache.findOneAndUpdate(
    { locationKey },
    { locationKey, currentWeather, forecast, fetchedAt: new Date(), expiresAt },
    { upsert: true, new: true }
  );

  return { current: currentWeather, forecast, fromCache: false, cachedAt: new Date() };
};
