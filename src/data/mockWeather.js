export const mockWeather = {
  current: {
    temperature: 32,
    condition: 'Partly Cloudy',
    rainfall: 12,
    humidity: 68,
    windSpeed: 14,
    rainProbability: 70,
    status: 'Rain Likely Today'
  },
  forecast: [
    { day: 'Today', temp: 32, rainProb: 70, icon: 'CloudRain' },
    { day: 'Tomorrow', temp: 34, rainProb: 20, icon: 'Sun' },
    { day: 'Day After', temp: 33, rainProb: 40, icon: 'Cloud' },
    { day: 'Next 3 Days', temp: 31, rainProb: 80, icon: 'CloudLightning' }
  ],
  alerts: [
    { id: 1, type: 'rain', message: 'Rain expected today', severity: 'warning', icon: 'CloudRain' },
    { id: 2, type: 'heat', message: 'High temperature tomorrow', severity: 'info', icon: 'Sun' },
    { id: 3, type: 'wind', message: 'Strong wind expected', severity: 'info', icon: 'Wind' }
  ]
};
