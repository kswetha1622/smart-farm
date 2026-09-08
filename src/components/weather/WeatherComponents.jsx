import React from 'react';
import { useTranslation } from 'react-i18next';
import { CloudRain, Sun, Cloud, CloudLightning, Wind, Droplets } from 'lucide-react';
import { ListenButton } from '../ui/ListenButton';

export const WeatherIcon = ({ type, className = "" }) => {
  switch (type) {
    case 'Sun': return <Sun className={`text-harvest-yellow ${className}`} />;
    case 'Cloud': return <Cloud className={`text-gray-400 ${className}`} />;
    case 'CloudLightning': return <CloudLightning className={`text-gray-600 ${className}`} />;
    case 'CloudRain': default: return <CloudRain className={`text-weather-blue ${className}`} />;
  }
};

export const CurrentWeatherCard = ({ weather }) => {
  const { t } = useTranslation();
  
  if (!weather) return null;

  const weatherText = `${t('weather.temperature')} ${weather.temperature} degrees. ${t(`weather.${weather.condition.toLowerCase().replace(' ', '')}`)}. ${t('weather.rainProbability')} ${weather.rainProbability} percent.`;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-card p-6 border border-blue-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-50 -mr-10 -mt-10"></div>
      
      <div className="flex justify-between items-start relative z-10">
        <div>
          <h3 className="text-gray-500 font-medium mb-1">{t('weather.title')}</h3>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-5xl font-bold text-gray-800">{weather.temperature}°C</span>
            <span className="text-xl text-gray-600 mb-1">{t(`weather.${weather.condition.toLowerCase().replace(' ', '')}`)}</span>
          </div>
          <div className="inline-flex items-center gap-1 bg-blue-100 text-weather-blue px-3 py-1 rounded-full text-sm font-semibold mb-6">
            <CloudRain size={16} />
            {t('weather.status')}
          </div>
        </div>
        <WeatherIcon type="CloudRain" className="w-16 h-16" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg text-weather-blue"><Droplets size={20} /></div>
          <div>
            <div className="text-xs text-gray-500">{t('weather.rainfall')}</div>
            <div className="font-semibold">{weather.rainfall} mm</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg text-weather-blue"><Cloud size={20} /></div>
          <div>
            <div className="text-xs text-gray-500">{t('weather.humidity')}</div>
            <div className="font-semibold">{weather.humidity}%</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg text-weather-blue"><Wind size={20} /></div>
          <div>
            <div className="text-xs text-gray-500">{t('weather.windSpeed')}</div>
            <div className="font-semibold">{weather.windSpeed} km/h</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg text-weather-blue"><CloudRain size={20} /></div>
          <div>
            <div className="text-xs text-gray-500">{t('weather.rainProbability')}</div>
            <div className="font-semibold">{weather.rainProbability}%</div>
          </div>
        </div>
      </div>

      <ListenButton text={weatherText} labelKey="weather.listenWeather" className="w-full justify-center" />
    </div>
  );
};

export const ForecastCard = ({ day }) => {
  const { t } = useTranslation();
  
  // Convert camelCase like 'next3Days' to translation key if needed, or exact match
  const dayKey = day.day.replace(/ /g, '');
  const dayName = t(`weather.${dayKey.toLowerCase()}`) || day.day;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col items-center text-center min-w-[120px]">
      <span className="text-gray-500 text-sm font-medium mb-2">{dayName}</span>
      <WeatherIcon type={day.icon} className="w-10 h-10 mb-2" />
      <span className="text-xl font-bold mb-1">{day.temp}°C</span>
      <div className="flex items-center gap-1 text-weather-blue text-sm font-semibold">
        <CloudRain size={14} />
        {day.rainProb}%
      </div>
    </div>
  );
};
