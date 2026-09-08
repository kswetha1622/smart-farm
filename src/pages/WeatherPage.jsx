import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CloudSun, MapPin, AlertTriangle, Loader2, Navigation } from 'lucide-react';
import { CurrentWeatherCard, ForecastCard, WeatherIcon } from '../components/weather/WeatherComponents';
import { fetchWeatherData } from '../services/weatherService';
import { mockWeather } from '../data/mockWeather';
import { useLocation } from '../context/LocationContext';
import { LocationButton } from '../components/ui/LocationButton';
import { LocationSearch } from '../components/ui/LocationSearch';

const WeatherPage = () => {
  const { t, i18n } = useTranslation();
  const { locationState, geoLoading, geoError, detectCurrentLocation } = useLocation();
  const { lat, lon, displayString, mode } = locationState;
  
  const [weatherData, setWeatherData] = useState(mockWeather);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(null);

  useEffect(() => {
    // If no location at all, try to auto-detect once on mount
    if (!lat || !lon) {
      detectCurrentLocation();
    }
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!lat || !lon) return;
      setWeatherLoading(true);
      setWeatherError(null);
      try {
        const data = await fetchWeatherData(lat, lon);
        setWeatherData(data);
      } catch (err) {
        setWeatherError("Failed to fetch weather data.");
      } finally {
        setWeatherLoading(false);
      }
    };
    fetchWeather();
  }, [lat, lon]);

  const loading = geoLoading || weatherLoading;
  const locationName = displayString || "Detecting your location...";
  const errorMsg = geoError || weatherError;

  return (
    <div className="relative min-h-screen">
      {/* 3D Premium Weather Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/assets/weather_bg.jpg" 
          alt="Agriculture Weather Background" 
          className="w-full h-full object-cover fixed"
        />
        {/* Soft overlay to make text readable but keep background beautiful */}
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[4px] fixed"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-dark-green/20 to-transparent fixed"></div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl relative z-10 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white/50">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-dark-green flex items-center gap-3 mb-2">
              <CloudSun className="text-primary-green drop-shadow-sm" size={36} />
              {t('weather.forecastTitle')}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-dark-green/80 flex items-center gap-2 font-bold text-lg">
                <MapPin size={20} className="text-primary-green" /> 
                {locationName}
              </p>
              {errorMsg && <span className="text-red-500 text-sm font-medium ml-2">({errorMsg})</span>}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <LocationSearch className="w-full sm:w-64" />
            <LocationButton />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center my-20 bg-white/60 backdrop-blur-md p-10 rounded-3xl border border-white shadow-lg">
            <Loader2 size={48} className="animate-spin text-primary-green mb-4" />
            <h2 className="text-xl font-bold text-dark-green">{t('common.loading') || 'Loading...'}</h2>
          </div>
        ) : (!lat || !lon) ? (
          <div className="flex flex-col items-center justify-center my-20 bg-white/60 backdrop-blur-md p-10 rounded-3xl border border-white shadow-lg text-center">
            <MapPin size={48} className="text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-dark-green mb-2">{t('weather.locationRequired')}</h2>
            <p className="text-gray-700 max-w-md mx-auto">
              {geoError || t('weather.locationRequiredMsg')}
            </p>
          </div>
        ) : weatherError ? (
          <div className="flex flex-col items-center justify-center my-20 bg-red-50/90 backdrop-blur-md p-10 rounded-3xl border border-red-100 shadow-lg text-center">
            <AlertTriangle size={48} className="text-red-500 mb-4" />
            <p className="text-red-700 max-w-md mx-auto font-medium">
              {t('weather.weatherErrorMsg')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Weather Card */}
            <div className="lg:col-span-1 transform hover:scale-105 transition-transform duration-300">
              <div className="shadow-2xl rounded-3xl overflow-hidden bg-white/80 backdrop-blur-lg border border-white/50 h-full">
                <CurrentWeatherCard weather={weatherData.current} />
              </div>
            </div>

            {/* Forecast and Alerts */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Forecast Horizon */}
              <div className="card p-6 bg-white/80 backdrop-blur-lg border border-white/50 shadow-xl rounded-3xl">
                <h2 className="text-2xl font-extrabold text-dark-green mb-6 flex items-center gap-2">
                  {t('weather.forecastTitle')}
                </h2>
                
                <div className="flex overflow-x-auto pb-4 -mx-2 px-2 gap-4 snap-x no-scrollbar">
                  {weatherData.forecast.map((day, idx) => (
                    <div key={idx} className="snap-start shrink-0 transform hover:-translate-y-1 transition-transform">
                      <ForecastCard day={day} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Alerts */}
              <div className="card p-6 bg-yellow-50/90 backdrop-blur-lg border border-yellow-200 shadow-xl rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 rounded-full blur-3xl opacity-20 -mr-10 -mt-10 pointer-events-none"></div>
                <h2 className="text-2xl font-extrabold text-dark-green mb-6 flex items-center gap-2 relative z-10">
                  <AlertTriangle className="text-harvest-yellow drop-shadow-sm" size={28} />
                  {t('weather.farmingAlerts')}
                </h2>
                
                <div className="space-y-4 relative z-10">
                  {weatherData.alerts.map(alert => (
                    <div key={alert.id} className="flex items-center gap-4 bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-white hover:shadow-md transition-shadow">
                      <div className={`p-4 rounded-full shadow-inner ${alert.severity === 'warning' ? 'bg-gradient-to-br from-yellow-100 to-yellow-200' : 'bg-gradient-to-br from-blue-100 to-blue-200'}`}>
                        <WeatherIcon type={alert.icon} className="w-8 h-8 drop-shadow-sm" />
                      </div>
                      <div className="font-bold text-dark-green text-lg">
                        {/* For localization, we match the key or use fallback */}
                        {t(alert.type === 'rain' ? 'weather.rainExpected' : alert.type === 'heat' ? 'weather.highTemp' : (alert.type === 'wind' ? 'weather.strongWind' : alert.message))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherPage;
