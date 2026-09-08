import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Map, Satellite, Leaf, CloudSun, ShieldAlert, Mic, Loader2 } from 'lucide-react';
import { CurrentWeatherCard } from '../components/weather/WeatherComponents';
import { fetchWeatherData } from '../services/weatherService';
import { mockWeather } from '../data/mockWeather'; // Fallback
import { useLocation } from '../context/LocationContext';

const HomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { locationState, detectCurrentLocation } = useLocation();
  const { lat, lon } = locationState;
  
  const [weather, setWeather] = useState(mockWeather.current); // initial fallback
  const [loadingWeather, setLoadingWeather] = useState(true);

  useEffect(() => {
    // If no location at all, try to auto-detect once on mount
    if (!lat || !lon) {
      detectCurrentLocation();
    }
  }, []);

  useEffect(() => {
    const fetchWithCoords = async (latitude, longitude) => {
      setLoadingWeather(true);
      try {
        const data = await fetchWeatherData(latitude, longitude);
        setWeather(data.current);
      } catch (err) {
        console.error("Failed to fetch live weather", err);
      } finally {
        setLoadingWeather(false);
      }
    };

    if (lat && lon) {
      fetchWithCoords(lat, lon);
    } else {
      setLoadingWeather(false);
    }
  }, [lat, lon]);

  const features = [
    { image: '/assets/card_next_crop.jpg', icon: Satellite, titleKey: 'features.cropDamage.title', descKey: 'features.cropDamage.desc', to: '/satellite-analysis' },
    { image: '/assets/card_advisor.jpg', icon: Leaf, titleKey: 'features.cropAdvisor.title', descKey: 'features.cropAdvisor.desc', to: '/crop-advisor' },
    { image: '/assets/card_weather.jpg', icon: CloudSun, titleKey: 'features.weatherForecast.title', descKey: 'features.weatherForecast.desc', to: '/weather' },
    { image: '/assets/card_disease.jpg', icon: ShieldAlert, titleKey: 'features.diseaseDetection.title', descKey: 'features.diseaseDetection.desc', to: '/disease-detection' },
    { image: '/assets/card_voice.jpg', icon: Mic, titleKey: 'features.voiceAssistant.title', descKey: 'features.voiceAssistant.desc', to: '/voice-assistant' },
  ];

  return (
    <div className="pb-10 bg-gray-50/50">
      {/* Hero Section */}
      <section className="relative bg-dark-green text-white overflow-hidden min-h-[500px] flex items-center">
        {/* Background image overlay */}
        <div className="absolute inset-0">
          <img 
            src="/assets/hero_bg.jpg" 
            alt="Farm" 
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay for Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-dark-green/95 via-dark-green/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-dark-green/50 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 py-12 md:py-20 relative z-10 animate-fade-in">
          <div className="flex flex-col lg:flex-row gap-10 items-center">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 drop-shadow-md whitespace-normal break-words" style={{ lineHeight: '1.4', overflowWrap: 'anywhere' }}>
                <span className="block text-harvest-yellow mb-3 md:mb-4 h-auto min-h-0">{t('hero.title1')}</span>
                <span className="block h-auto min-h-0">{t('hero.title2')}</span>
              </h1>
              <p className="text-lg md:text-xl text-green-50 mb-8 max-w-2xl mx-auto lg:mx-0 font-medium drop-shadow-sm whitespace-normal" style={{ lineHeight: '1.6', overflowWrap: 'anywhere' }}>
                {t('hero.subtitle')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button 
                  onClick={() => navigate('/voice-assistant')}
                  className="bg-harvest-yellow text-dark-green font-bold px-8 py-4 rounded-xl hover:bg-yellow-400 hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-xl text-lg flex items-center justify-center gap-2 whitespace-normal break-words"
                >
                  <Mic size={24} className="shrink-0" /> <span className="flex-1 text-center">{t('hero.talkAssistant') || 'Voice Assistant'}</span>
                </button>
              </div>
            </div>
            
            <div className="w-full max-w-md lg:w-1/3 mt-8 lg:mt-0 transform hover:scale-105 transition-transform duration-500 shadow-2xl rounded-2xl overflow-hidden backdrop-blur-sm bg-white/10 border border-white/20">
              {loadingWeather ? (
                <div className="h-64 flex flex-col items-center justify-center text-white bg-dark-green/40 backdrop-blur-md">
                  <Loader2 className="w-8 h-8 animate-spin text-primary-green mb-4" />
                  <p>{t('weather.loadingMsg') || 'Loading Live Weather...'}</p>
                </div>
              ) : (lat && lon && weather) ? (
                <CurrentWeatherCard weather={weather} />
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-white bg-dark-green/40 backdrop-blur-md text-center p-6">
                  <CloudSun className="w-12 h-12 text-gray-300 mb-4" />
                  <h3 className="font-bold text-lg mb-2">{t('weather.locationRequiredTitle') || 'Location Required'}</h3>
                  <p className="text-sm text-gray-200">{t('weather.locationRequiredMsg') || 'Allow location access to view local weather.'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 md:py-24 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-dark-green inline-block relative">
            {t('features.title')}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1.5 bg-primary-green rounded-full"></div>
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <Link 
              key={idx} 
              to={feature.to}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group flex flex-col h-full border border-gray-100"
            >
              {/* Card Image Area */}
              <div className="h-48 relative overflow-hidden bg-light-green">
                <img 
                  src={feature.image} 
                  alt={t(feature.titleKey)} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-green/90 via-dark-green/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Floating Icon */}
                <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-md p-3 rounded-xl border border-white/30 text-white shadow-lg group-hover:bg-primary-green group-hover:border-primary-green transition-colors">
                  <feature.icon size={28} />
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-dark-green mb-3 group-hover:text-primary-green transition-colors">{t(feature.titleKey)}</h3>
                <p className="text-gray-600 font-medium flex-grow leading-relaxed">{t(feature.descKey)}</p>
                
                <div className="mt-6 text-primary-green font-bold flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                  {t('common.next')} <span className="text-xl">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
};

export default HomePage;
