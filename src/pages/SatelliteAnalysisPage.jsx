import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Activity, AlertCircle, Loader2, Thermometer, CloudRain, Droplets, Wind, TrendingUp, CheckCircle, MapPin, Target } from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { LocationButton } from '../components/ui/LocationButton';
import { LocationSearch } from '../components/ui/LocationSearch';

const CROP_DATABASE = [
  { name: 'Cotton', reqSoil: ['Black Soil', 'Clay Soil'], reqWater: 'Medium', season: ['Kharif'], cost: 25000, price: 7000, yield: 8, duration: '150-180 days' },
  { name: 'Paddy', reqSoil: ['Clay Soil', 'Alluvial Soil'], reqWater: 'High', season: ['Kharif', 'Rabi'], cost: 20000, price: 2200, yield: 20, duration: '120-150 days' },
  { name: 'Maize', reqSoil: ['Loamy Soil', 'Red Soil', 'Alluvial Soil'], reqWater: 'Medium', season: ['Kharif', 'Rabi', 'Zaid'], cost: 15000, price: 2100, yield: 25, duration: '90-120 days' },
  { name: 'Red Gram', reqSoil: ['Red Soil', 'Black Soil', 'Loamy Soil'], reqWater: 'Low', season: ['Kharif'], cost: 12000, price: 6500, yield: 6, duration: '150-180 days' },
  { name: 'Groundnut', reqSoil: ['Sandy Soil', 'Red Soil'], reqWater: 'Low', season: ['Kharif', 'Rabi'], cost: 18000, price: 5500, yield: 10, duration: '100-120 days' },
  { name: 'Soybean', reqSoil: ['Black Soil', 'Loamy Soil'], reqWater: 'Medium', season: ['Kharif'], cost: 14000, price: 4500, yield: 8, duration: '90-110 days' },
  { name: 'Tomato', reqSoil: ['Loamy Soil', 'Red Soil', 'Sandy Soil'], reqWater: 'Medium', season: ['Kharif', 'Rabi', 'Zaid'], cost: 30000, price: 1500, yield: 150, duration: '90-120 days' },
  { name: 'Chilli', reqSoil: ['Black Soil', 'Red Soil', 'Loamy Soil'], reqWater: 'Medium', season: ['Kharif', 'Rabi'], cost: 35000, price: 18000, yield: 15, duration: '150-180 days' }
];

const SatelliteAnalysisPage = () => {
  const { t, i18n } = useTranslation();
  const { locationState, detectCurrentLocation, geoLoading, geoError, permissionDenied } = useLocation();
  const { lat, lon, displayString: locationString, district, mandal, village, state, accuracy } = locationState;
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  const [prevCrop, setPrevCrop] = useState('Cotton');
  const [customCrop, setCustomCrop] = useState('');
  const [soilType, setSoilType] = useState('Black Soil');
  const [waterAvail, setWaterAvail] = useState('50');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  
  const [weatherData, setWeatherData] = useState(null);
  const [weatherError, setWeatherError] = useState(false);

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const getSeason = (monthIndex) => {
    if (monthIndex >= 5 && monthIndex <= 9) return 'Kharif'; // June-Oct
    if (monthIndex >= 10 || monthIndex <= 2) return 'Rabi'; // Nov-March
    return 'Zaid'; // April-May
  };

  const season = getSeason(currentMonth);

  const getWaterLevel = (val) => {
    if (val < 25) return 'Low';
    if (val < 75) return 'Medium';
    return 'High';
  };

  useEffect(() => {
    if (lat && lon) {
      // Fetch weather
      const fetchWeather = async () => {
        try {
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m,precipitation_probability`);
          const data = await res.json();
          setWeatherData({
            temperature: data.current_weather.temperature,
            windspeed: data.current_weather.windspeed,
            humidity: data.hourly.relativehumidity_2m[0],
            precipProb: data.hourly.precipitation_probability[0]
          });
        } catch(e) {
          setWeatherError(true);
        }
      };
      fetchWeather();
    } else {
      setWeatherError(true);
    }
  }, [lat, lon]);

  const handleRecommend = () => {
    setLoading(true);
    setTimeout(() => {
      const waterLevel = getWaterLevel(waterAvail);
      
      let scoredCrops = CROP_DATABASE.map(crop => {
        let score = 50;
        let reasons = [];
        let rotationInfo = "Suitable";
        
        // Soil check
        if (crop.reqSoil.includes(soilType)) { score += 15; reasons.push({ key: 'nextCrop.reasons.soil', params: { soil: t('advisor.soilTypes.' + soilType.toLowerCase().replace(' soil', '')) || soilType } }); }
        else { score -= 10; }
        
        // Water check
        if (crop.reqWater === waterLevel || waterLevel === 'High') { score += 15; reasons.push({ key: 'nextCrop.reasons.water' }); }
        else if (crop.reqWater === 'High' && waterLevel === 'Low') { score -= 20; }
        
        // Season check
        if (crop.season.includes(season)) { score += 15; reasons.push({ key: 'nextCrop.reasons.season', params: { season: t('advisor.seasons.' + season.toLowerCase()) || season } }); }
        else { score -= 15; }
        
        // Previous crop rotation logic
        const actualPrevCrop = prevCrop === 'Other' ? customCrop : prevCrop;
        if (actualPrevCrop === crop.name) {
          score -= 10;
          rotationInfo = { key: 'nextCrop.rotation.notRecommended' };
        } else if ((actualPrevCrop === 'Cotton' && crop.name === 'Red Gram') || (actualPrevCrop === 'Paddy' && ['Groundnut', 'Red Gram'].includes(crop.name))) {
          score += 15;
          rotationInfo = { key: 'nextCrop.rotation.highlyRecommended' };
        } else {
          rotationInfo = { key: 'nextCrop.rotation.suitable' };
        }

        // Weather impact (simplified)
        let weatherRisk = 'Medium';
        if (weatherData) {
          if (weatherData.temperature > 35 && crop.reqWater === 'High' && waterLevel === 'Low') weatherRisk = 'High';
          else if (weatherData.temperature >= 25 && weatherData.temperature <= 32) { weatherRisk = 'Low'; reasons.push({ key: 'nextCrop.reasons.climate' }); }
        }

        const estRevenue = crop.yield * crop.price;
        const estProfit = estRevenue - crop.cost;

        return {
          ...crop,
          score: Math.min(99, Math.max(10, score)),
          reasons,
          rotationInfo,
          weatherRisk,
          estRevenue,
          estProfit
        };
      });

      scoredCrops.sort((a, b) => b.score - a.score);
      setResult(scoredCrops.slice(0, 3));
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="card mb-8 bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden animate-slide-up">
        {/* Banner Image */}
        <div className="w-full h-64 md:h-80 relative overflow-hidden bg-light-green">
          <img 
            src="/assets/card_next_crop.jpg" 
            alt="Smart Crop Planning" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">{t('nextCrop.title')}</h1>
            <p className="text-white/90 text-sm md:text-base font-medium">{t('nextCrop.subtitle')}</p>
          </div>
        </div>

        <div className="p-6 md:p-8">
          {/* Inputs Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t('nextCrop.previousCrop')}</label>
              <select className="input-field w-full mb-3" value={prevCrop} onChange={e => setPrevCrop(e.target.value)}>
                {CROP_DATABASE.map(c => <option key={c.name} value={c.name}>{t(`crops.${c.name}`)}</option>)}
                <option value="Other">{t('crops.Other') || 'Other'}</option>
              </select>
              {prevCrop === 'Other' && (
                <input 
                  type="text" 
                  placeholder="Enter previous crop name"
                  className="input-field w-full animate-fade-in"
                  value={customCrop}
                  onChange={e => setCustomCrop(e.target.value)}
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t('nextCrop.soilType')}</label>
              <select className="input-field w-full" value={soilType} onChange={e => setSoilType(e.target.value)}>
                <option value="Black Soil">{t('advisor.soilTypes.black') || 'Black Soil'}</option>
                <option value="Red Soil">{t('advisor.soilTypes.red') || 'Red Soil'}</option>
                <option value="Sandy Soil">{t('advisor.soilTypes.sandy') || 'Sandy Soil'}</option>
                <option value="Loamy Soil">{t('advisor.soilTypes.loamy') || 'Loamy Soil'}</option>
                <option value="Clay Soil">{t('advisor.soilTypes.clay') || 'Clay Soil'}</option>
                <option value="Alluvial Soil">{t('advisor.soilTypes.alluvial') || 'Alluvial Soil'}</option>
                <option value="Other">{t('crops.Other') || 'Other'}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex justify-between">
                <span>{t('nextCrop.waterAvailability')}</span>
                <span className="text-primary-green font-bold">{waterAvail}% ({getWaterLevel(waterAvail) === 'Low' ? t('nextCrop.levelLow') : getWaterLevel(waterAvail) === 'Medium' ? t('nextCrop.levelMedium') : t('nextCrop.levelHigh')})</span>
              </label>
              <input 
                type="range" 
                min="0" max="100" 
                value={waterAvail} 
                onChange={e => setWaterAvail(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-green"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{t('nextCrop.rainfed')} (0%)</span>
                <span>{t('nextCrop.fullIrrigation')} (100%)</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t('nextCrop.currentMonth')} ({t('nextCrop.seasonLabel')}: {season === 'Kharif' ? t('advisor.seasons.kharif') : season === 'Rabi' ? t('advisor.seasons.rabi') : t('advisor.seasons.zaid')})</label>
              <select className="input-field w-full" value={currentMonth} onChange={e => setCurrentMonth(parseInt(e.target.value))}>
                {months.map((m, i) => (
                  <option key={i} value={i}>
                    {new Intl.DateTimeFormat(i18n.language, { month: 'long' }).format(new Date(2000, i, 1))}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t('nextCrop.location')}</label>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <MapPin className="text-primary-green shrink-0 mt-0.5" size={20} />
                  <div className="flex-1 w-full overflow-hidden">
                    <p className="text-gray-800 font-medium truncate">
                      {district ? `${village ? village + ', ' : ''}${mandal ? mandal + ', ' : ''}${district}, ${state || ''}` : locationString || t('location.notSelected') || 'No location selected'}
                    </p>
                    {lat && lon && (
                      <p className="text-xs text-gray-500 mt-1">
                        {lat.toFixed(6)}, {lon.toFixed(6)}
                        {accuracy && <span className="ml-2 bg-gray-200 px-2 py-0.5 rounded text-gray-700">{t('location.accuracy') || 'Accuracy'}: ±{accuracy} {t('location.meters') || 'meters'}</span>}
                      </p>
                    )}
                    <div className="mt-4 flex flex-col sm:flex-row gap-2 w-full">
                      <LocationSearch className="flex-grow w-full" />
                      <LocationButton className="w-full sm:w-auto" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Climate Info */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-dark-green mb-4 border-b border-gray-100 pb-2">{t('weather.currentClimate') || 'Current Climate Conditions'}</h3>
            {weatherError ? (
              <div className="p-4 bg-yellow-50 text-yellow-800 rounded-xl text-sm">
                {t('weather.liveDataUnavailable') || 'Live weather data unavailable. Recommendation is based on available crop and agricultural data.'}
              </div>
            ) : weatherData ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50 flex flex-col items-center justify-center text-center">
                  <Thermometer className="text-blue-500 mb-2" size={24} />
                  <p className="text-xs text-gray-500 uppercase font-bold">{t('weather.tempShort') || 'Temp'}</p>
                  <p className="text-lg font-bold text-gray-800">{weatherData.temperature}°C</p>
                </div>
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50 flex flex-col items-center justify-center text-center">
                  <CloudRain className="text-blue-500 mb-2" size={24} />
                  <p className="text-xs text-gray-500 uppercase font-bold">{t('weather.rainProbShort') || 'Rain Prob'}</p>
                  <p className="text-lg font-bold text-gray-800">{weatherData.precipProb}%</p>
                </div>
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50 flex flex-col items-center justify-center text-center">
                  <Droplets className="text-blue-500 mb-2" size={24} />
                  <p className="text-xs text-gray-500 uppercase font-bold">{t('weather.humidity') || 'Humidity'}</p>
                  <p className="text-lg font-bold text-gray-800">{weatherData.humidity}%</p>
                </div>
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50 flex flex-col items-center justify-center text-center">
                  <Wind className="text-blue-500 mb-2" size={24} />
                  <p className="text-xs text-gray-500 uppercase font-bold">{t('weather.windShort') || 'Wind'}</p>
                  <p className="text-lg font-bold text-gray-800">{weatherData.windspeed} km/h</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center p-4 text-gray-400">
                <Loader2 className="animate-spin mr-2" size={18} /> {t('weather.loadingClimate') || 'Loading climate data...'}
              </div>
            )}
          </div>

          <button 
            onClick={handleRecommend} 
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 py-4 px-6 text-lg font-bold disabled:opacity-50 shadow-lg hover:shadow-xl transition-all"
          >
            {loading ? <Loader2 size={24} className="animate-spin" /> : <TrendingUp size={24} />}
            {t('nextCrop.analyzeBtn') || 'Recommend Next Crop'}
          </button>
        </div>
      </div>

      {result && !loading && (
        <div className="animate-slide-up space-y-6">
          <h2 className="text-2xl font-extrabold text-dark-green mb-4">{t('nextCrop.recommendedCrops') || 'Recommended Crops'}</h2>
          
          {result.map((crop, idx) => (
            <div key={idx} className={`card bg-white border ${idx === 0 ? 'border-primary-green ring-4 ring-primary-green/10' : 'border-gray-200'} p-0 rounded-2xl overflow-hidden`}>
              {idx === 0 && (
                <div className="bg-primary-green text-white py-2 px-6 font-bold flex items-center gap-2 text-sm tracking-wide">
                  <CheckCircle size={18} /> {t('nextCrop.topRecommended') || 'TOP RECOMMENDED CROP'}
                </div>
              )}
              
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-gray-100 pb-6 mb-6">
                  <div>
                    <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">{t('nextCrop.rank') || 'Rank'} #{idx + 1}</div>
                    <h3 className="text-3xl font-extrabold text-gray-800">{t(`crops.${crop.name}`) || crop.name}</h3>
                  </div>
                  <div className="mt-4 md:mt-0 text-right">
                    <div className="text-sm font-bold text-gray-500 uppercase mb-1">{t('nextCrop.suitabilityScore') || 'Suitability Score'}</div>
                    <div className={`text-4xl font-extrabold ${crop.score >= 80 ? 'text-primary-green' : crop.score >= 60 ? 'text-yellow-500' : 'text-danger-red'}`}>
                      {crop.score}%
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                  <div>
                    <h4 className="font-bold text-dark-green mb-3 flex items-center gap-2">
                      <CheckCircle className="text-primary-green" size={18} /> {t('nextCrop.whyRecommended') || 'Why Recommended:'}
                    </h4>
                    <ul className="space-y-2 mb-6">
                      {crop.reasons.map((r, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <div className="mt-1 min-w-[6px] h-[6px] rounded-full bg-primary-green"></div>
                          {typeof r === 'object' ? t(r.key, r.params) : r}
                        </li>
                      ))}
                      {crop.reasons.length === 0 && <li className="text-sm text-gray-500 italic">No specific strong matches found.</li>}
                    </ul>
                    
                    <h4 className="font-bold text-dark-green mb-2">Previous Crop Impact</h4>
                    <div className="bg-gray-50 p-3 rounded-lg text-sm border border-gray-100">
                      <span className="font-semibold text-gray-700">Crop Rotation:</span> <span className={crop.rotationInfo.key?.includes('notRecommended') ? 'text-danger-red font-bold' : 'text-primary-green font-bold'}>{t(crop.rotationInfo.key)}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <div className="text-xs font-bold text-gray-500 uppercase mb-1">Water Req</div>
                      <div className="font-semibold text-gray-800">{crop.reqWater === 'Low' ? t('nextCrop.riskLevels.Low') || 'Low' : crop.reqWater === 'Medium' ? t('nextCrop.riskLevels.Medium') || 'Medium' : t('nextCrop.riskLevels.High') || 'High'}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <div className="text-xs font-bold text-gray-500 uppercase mb-1">{t('nextCrop.duration') || 'Duration'}</div>
                      <div className="font-semibold text-gray-800">{crop.duration}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <div className="text-xs font-bold text-gray-500 uppercase mb-1">Expected Yield</div>
                      <div className="font-semibold text-gray-800">{crop.yield} Quintals/acre</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <div className="text-xs font-bold text-gray-500 uppercase mb-1">{t('nextCrop.weatherRisk') || 'Weather Risk'}</div>
                      <div className={`font-semibold ${crop.weatherRisk === 'Low' ? 'text-primary-green' : crop.weatherRisk === 'High' ? 'text-danger-red' : 'text-yellow-600'}`}>{t('nextCrop.riskLevels.' + crop.weatherRisk) || crop.weatherRisk}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase mb-1">{t('nextCrop.estCost') || 'Est. Cost'}</p>
                      <p className="text-xl font-bold text-gray-800">₹{crop.cost.toLocaleString()} <span className="text-sm font-normal text-gray-500">/ acre</span></p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase mb-1">{t('nextCrop.estRevenue') || 'Est. Revenue'}</p>
                      <p className="text-xl font-bold text-gray-800">₹{crop.estRevenue.toLocaleString()} <span className="text-sm font-normal text-gray-500">/ acre</span></p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase mb-1">{t('nextCrop.estProfit') || 'Est. Profit'}</p>
                      <p className="text-2xl font-extrabold text-primary-green">₹{crop.estProfit.toLocaleString()} <span className="text-sm font-normal text-gray-500">/ acre</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="card bg-dark-green text-white p-8 rounded-2xl text-center shadow-xl mt-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-white/5"></div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-white/80 uppercase tracking-widest mb-4">Final Recommendation</h3>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6">🌱 BEST NEXT CROP: {result[0].name.toUpperCase()}</h2>
              <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8 leading-relaxed">
                Recommended because it matches the selected soil ({soilType}), available water ({getWaterLevel(waterAvail)}), current season ({season}), climate conditions and previous crop rotation ({prevCrop === 'Other' ? customCrop || 'Unknown' : prevCrop}).
              </p>
              
              <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur-md py-3 px-6 rounded-xl border border-white/20">
                  <span className="block text-sm uppercase text-white/70 mb-1 font-bold">Recommendation Confidence</span>
                  <span className="text-3xl font-extrabold">{result[0].score}%</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md py-3 px-6 rounded-xl border border-white/20">
                  <span className="block text-sm uppercase text-white/70 mb-1 font-bold">Expected Profit</span>
                  <span className="text-3xl font-extrabold text-green-300">₹{result[0].estProfit.toLocaleString()} <span className="text-lg">/ acre</span></span>
                </div>
              </div>

              <div className="text-xs md:text-sm text-white/60 max-w-3xl mx-auto italic bg-black/20 p-4 rounded-lg">
                Note: Profit is an estimate and may vary based on market price, yield, weather, input costs and actual farming conditions. It is not guaranteed.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SatelliteAnalysisPage;
