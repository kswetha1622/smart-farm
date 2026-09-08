// Interpret WMO weather codes
const interpretWeatherCode = (code) => {
  if (code === 0) return { condition: 'Clear Sky', icon: 'Sun' };
  if (code === 1 || code === 2 || code === 3) return { condition: 'Partly Cloudy', icon: 'Cloud' };
  if (code === 45 || code === 48) return { condition: 'Fog', icon: 'CloudFog' }; // Fallback to Cloud if CloudFog missing
  if (code >= 51 && code <= 55) return { condition: 'Drizzle', icon: 'CloudRain' };
  if (code >= 61 && code <= 65) return { condition: 'Rain', icon: 'CloudRain' };
  if (code >= 71 && code <= 77) return { condition: 'Snow', icon: 'CloudSnow' }; // fallback
  if (code >= 80 && code <= 82) return { condition: 'Showers', icon: 'CloudRain' };
  if (code >= 95 && code <= 99) return { condition: 'Thunderstorm', icon: 'CloudLightning' };
  return { condition: 'Unknown', icon: 'Cloud' };
};

export const fetchLocationName = async (lat, lon) => {
  try {
    const geoKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
    const res = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${geoKey}`);
    const data = await res.json();
    if (data.features && data.features.length > 0) {
      const props = data.features[0].properties;
      const city = props.city || props.town || props.village || props.county;
      const state = props.state;
      if (city && state) return `${city}, ${state}`;
      if (city) return city;
      return props.formatted?.split(',').slice(0, 2).join(', ') || 'Unknown Location';
    }
    return 'Unknown Location';
  } catch (e) {
    console.error('Geocoding error', e);
    return 'Unknown Location';
  }
};

export const fetchWeatherData = async (lat = 22, lon = 79) => {
  const baseUrl = import.meta.env.VITE_WEATHER_API_URL || 'https://api.open-meteo.com/v1/forecast';
  
  try {
    const url = new URL(baseUrl);
    url.searchParams.append('latitude', lat);
    url.searchParams.append('longitude', lon);
    url.searchParams.append('daily', 'sunrise,sunset,weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,rain_sum,daylight_duration');
    url.searchParams.append('hourly', 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,wind_speed_10m,weather_code,wind_direction_10m,wind_direction_80m');
    url.searchParams.append('current', 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,rain,wind_speed_10m,precipitation,snowfall,pressure_msl,weather_code');
    url.searchParams.append('utm_source', 'chatgpt.com');
    url.searchParams.append('timezone', 'auto');

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Parse current
    const currTemp = data.current.temperature_2m;
    const currCode = data.current.weather_code;
    const weatherStatus = interpretWeatherCode(currCode);
    const rain = data.current.rain || 0;
    
    // Find rain probability in the hourly array for the next few hours
    // Just a rough estimate if not directly available
    let rainProbability = 0;
    if (data.hourly && data.hourly.precipitation) {
      // average precipitation chance or something. Open-Meteo provides precipitation_probability but the user's url didn't include it.
      // If rain > 0, it's 100%. Otherwise, we'll just check if there is precipitation in next 24h.
      const next24hPrecip = data.hourly.precipitation.slice(0, 24);
      const hasRain = next24hPrecip.some(p => p > 0);
      rainProbability = hasRain ? 70 : 10;
      if (rain > 0) rainProbability = 100;
    }

    const current = {
      temperature: Math.round(currTemp),
      condition: weatherStatus.condition,
      rainfall: rain,
      humidity: data.current.relative_humidity_2m || 0,
      windSpeed: data.current.wind_speed_10m || 0,
      rainProbability: rainProbability,
      status: rain > 0 ? 'Raining Now' : (rainProbability > 50 ? 'Rain Likely Today' : 'Good Farming Conditions')
    };

    // Parse forecast
    const forecast = [];
    if (data.daily) {
      const days = ['Today', 'Tomorrow', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
      for (let i = 0; i < 4; i++) {
        const dCode = data.daily.weather_code[i];
        const dWeather = interpretWeatherCode(dCode);
        forecast.push({
          day: days[i],
          temp: Math.round(data.daily.temperature_2m_max[i] || 0),
          rainProb: (data.daily.rain_sum[i] > 0) ? 80 : 10, // heuristic since user's URL didn't have prob
          icon: dWeather.icon
        });
      }
    }

    // Generate alerts dynamically based on the daily data
    const alerts = [];
    let alertId = 1;
    
    // Check for heavy rain today or tomorrow
    if (data.daily && data.daily.rain_sum) {
      if (data.daily.rain_sum[0] > 10 || data.daily.rain_sum[1] > 10) {
        alerts.push({ id: alertId++, type: 'rain', message: 'Heavy rain expected soon', severity: 'warning', icon: 'CloudRain' });
      }
    }
    
    // Check for heat
    if (data.daily && data.daily.temperature_2m_max) {
      if (data.daily.temperature_2m_max[0] > 35) {
        alerts.push({ id: alertId++, type: 'heat', message: 'High temperature alert', severity: 'info', icon: 'Sun' });
      }
    }

    // Check for wind
    if (data.daily && data.daily.wind_speed_10m_max) {
      if (data.daily.wind_speed_10m_max[0] > 25) {
        alerts.push({ id: alertId++, type: 'wind', message: 'Strong wind expected', severity: 'info', icon: 'Wind' });
      }
    }
    
    // Fallback if no alerts generated to match UI style
    if (alerts.length === 0) {
      alerts.push({ id: alertId++, type: 'heat', message: 'Normal weather conditions', severity: 'info', icon: 'Sun' });
    }

    return {
      current,
      forecast,
      alerts
    };
  } catch (error) {
    console.error("Weather API Error:", error);
    throw error;
  }
};
