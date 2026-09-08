import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Leaf, MapPin, Droplets, Sun, CheckCircle, XCircle,
  ChevronRight, ChevronLeft, Divide, LayoutGrid, Loader2,
  Thermometer, Calendar, Beaker, Info, Repeat2, Sprout,
  Wifi, WifiOff, AlertTriangle, Wind, CloudRain, BarChart3
} from 'lucide-react';
import { recommendCrops, assignCropsToFields, detectSeason, classifyWaterAvailability } from '../services/cropEngine';
import { useLocation } from '../context/LocationContext';
import { LocationButton } from '../components/ui/LocationButton';
import { LocationSearch } from '../components/ui/LocationSearch';


const SCORE_COLOR = (s) => s >= 60 ? 'text-green-700 bg-green-100' : s >= 35 ? 'text-yellow-700 bg-yellow-100' : 'text-red-700 bg-red-100';

// ─── Image with fallback ─────────────────────────────────────────────────
const CropImg = ({ crop }) => {
  const [src, setSrc] = useState(crop.image);
  return (
    <img
      src={src}
      alt={crop.name}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
      onError={() => setSrc(crop.fallbackImage || crop.image)}
    />
  );
};

// ─── Field Crop Result Card ───────────────────────────────────────────────
const FieldResultCard = ({ assignment }) => {
  const { t } = useTranslation();
  const { crop, score, reasons, issues, isRepeated, fieldIndex, fieldSize, dataSource } = assignment;
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100">
      {/* Image */}
      <div className="h-52 overflow-hidden relative group">
        <CropImg crop={crop} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-4 left-4 right-12">
          <h3 className="text-white text-2xl font-extrabold drop-shadow">{crop.name}</h3>
          <span className="text-white/80 text-xs capitalize">{crop.suitableSeasons.map(s => t(`advisor.seasons.${s}`) || s).join(', ')} Crop</span>
        </div>
        <div className={`absolute top-3 right-3 text-xs font-extrabold px-2.5 py-1 rounded-full ${SCORE_COLOR(score)}`}>
          {score} pts
        </div>
        {isRepeated && (
          <div className="absolute top-9 right-3 bg-yellow-400/90 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 mt-1">
            <Repeat2 size={12} /> {t('advisor.repeated')}
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col gap-4">
        <p className="text-gray-600 text-sm leading-relaxed">{crop.description}</p>

        {/* Data Source Badge */}
        <div className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full w-fit
          ${dataSource === 'api' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
          {dataSource === 'api'
            ? <><Wifi size={12} /> {t('advisor.apiDataBadge')}</>
            : <><WifiOff size={12} /> {t('advisor.manualDataBadge')}</>}
        </div>

        {/* Quick info grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: <Droplets size={14} className="text-blue-500" />, label: t('advisor.waterReq'), val: crop.waterRequirement || crop.waterNeeds?.replace('_', ' ') || '—', bg: 'bg-blue-50' },
            { icon: <Calendar size={14} className="text-orange-500" />, label: t('advisor.sowing'), val: crop.sowingPeriod, bg: 'bg-orange-50' },
            { icon: <Leaf size={14} className="text-green-600" />, label: t('advisor.harvest'), val: crop.harvestingPeriod, bg: 'bg-green-50' },
            { icon: <Thermometer size={14} className="text-red-500" />, label: t('advisor.temp'), val: `${crop.tempMinC}–${crop.tempMaxC}°C`, bg: 'bg-red-50' },
            { icon: <Beaker size={14} className="text-purple-500" />, label: t('advisor.fertilizer'), val: crop.fertilizer, bg: 'bg-purple-50', full: true },
            { icon: <Calendar size={14} className="text-gray-500" />, label: t('advisor.duration'), val: crop.growingDuration, bg: 'bg-gray-50', full: true },
          ].map((item, i) => (
            <div key={i} className={`${item.full ? 'col-span-2' : ''} ${item.bg} p-3 rounded-xl flex items-start gap-2`}>
              <span className="mt-0.5 shrink-0">{item.icon}</span>
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-0.5">{item.label}</p>
                <p className="text-sm font-bold text-gray-800">{item.val}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Crop Care */}
        <div className="bg-light-green/30 p-4 rounded-xl flex items-start gap-3 border border-primary-green/20">
          <Info size={16} className="text-primary-green shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-primary-green font-bold uppercase tracking-wide mb-1">{t('advisor.cropCare')}</p>
            <p className="text-sm text-dark-green font-medium">{crop.cropCare}</p>
          </div>
        </div>

        {/* Why This Crop - expandable */}
        <button
          onClick={() => setExpanded(e => !e)}
          className="w-full flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors rounded-xl px-4 py-2.5 text-sm font-bold text-dark-green"
        >
          <span className="flex items-center gap-2"><BarChart3 size={15} /> {t('advisor.whyCrop')}</span>
          <ChevronRight size={16} className={`transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </button>

        {expanded && (
          <div className="space-y-2 animate-slide-up">
            {reasons.map((r, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-green-800 bg-green-50 rounded-lg px-3 py-2">
                <span className="shrink-0">{r.split(' ')[0]}</span>
                <span>{r.split(' ').slice(1).join(' ')}</span>
              </div>
            ))}
            {issues.map((w, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-yellow-800 bg-yellow-50 rounded-lg px-3 py-2">
                <AlertTriangle size={14} className="shrink-0 mt-0.5 text-yellow-600" />
                <span>{w.replace(/^[–\- ]+/, '')}</span>
              </div>
            ))}
            <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
              <Info size={12} /> {t('advisor.suitability')}: {score}/100
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Step Progress Bar ────────────────────────────────────────────────────
const StepBar = ({ step }) => {
  const steps = ['Land', 'Fields', 'Conditions', 'Results'];
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map((label, i) => (
        <React.Fragment key={i}>
          <div className="flex flex-col items-center">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300
              ${i + 1 < step ? 'bg-primary-green text-white' :
                i + 1 === step ? 'bg-dark-green text-white ring-4 ring-primary-green/30' :
                'bg-gray-200 text-gray-500'}`}>
              {i + 1 < step ? <CheckCircle size={18} /> : i + 1}
            </div>
            <span className={`text-xs mt-1.5 font-semibold ${i + 1 === step ? 'text-dark-green' : 'text-gray-400'}`}>{label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`h-0.5 w-12 sm:w-20 mb-5 transition-all duration-300 ${i + 1 < step ? 'bg-primary-green' : 'bg-gray-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const BackBtn = ({ onClick, label }) => (
  <button type="button" onClick={onClick}
    className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-dark-green transition-colors mb-6 group">
    <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
    {label}
  </button>
);

// ═══════════════════════════════════════════════════════════════════════════
const CropAdvisorPage = () => {
  const [step, setStep]       = useState(1);
  const [loading, setLoading] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);

  // Step 1
  const [totalArea, setTotalArea] = useState('');
  
  // Use Centralized Location Context
  const { locationState, geoLoading, geoError, detectCurrentLocation, setManualLocation } = useLocation();
  const { lat, lon, displayString: location } = locationState;

  // Step 2
  const [numFields, setNumFields]   = useState('');
  const [fieldSizes, setFieldSizes] = useState([]);

  // Step 3: conditions (API-fetched or manual)
  const [soil, setSoil]                 = useState('black');
  const [season, setSeason]             = useState(detectSeason());
  const [water, setWater]               = useState('available');
  const [apiConditions, setApiConditions] = useState(null);
  const [apiError, setApiError]           = useState('');
  const [seasonOverridden, setSeasonOverridden] = useState(false);
  const [waterOverridden, setWaterOverridden]   = useState(false);

  // Results
  const [fieldAssignments, setFieldAssignments] = useState([]);
  const [noResults, setNoResults]               = useState(false);

  // ── Step 1 ────────────────────────────────────────────────────────────────
  const handleStep1 = (e) => {
    e.preventDefault();
    const val = parseFloat(totalArea);
    if (!val || val <= 0) return;
    setStep(2);
  };

  // ── Step 2: field count ──────────────────────────────────────────────────
  const handleNumFieldsChange = (n) => {
    const count = parseInt(n);
    if (!count || count < 1) return;
    setNumFields(count);
    const area = parseFloat(totalArea) || 0;
    const eq   = Number((area / count).toFixed(2));
    setFieldSizes(Array.from({ length: count }, () => eq.toString()));
  };

  const handleDivideEqually = () => {
    if (!numFields) return;
    const area = parseFloat(totalArea) || 0;
    const eq   = Number((area / numFields).toFixed(2));
    setFieldSizes(Array.from({ length: numFields }, () => eq.toString()));
  };

  const handleFieldSizeChange = (idx, val) => {
    const u = [...fieldSizes]; u[idx] = val; setFieldSizes(u);
  };

  const totalAllocated = fieldSizes.reduce((s, v) => s + (parseFloat(v) || 0), 0);
  const overAllocated  = parseFloat(totalArea) > 0 && totalAllocated > parseFloat(totalArea) + 0.01;

  const handleStep2 = (e) => {
    e.preventDefault();
    if (!numFields || fieldSizes.length === 0) return;
    setStep(3);
  };

  // ── Step 3: Fetch API conditions ─────────────────────────────────────────
  const handleFetchConditions = async () => {
    if (!lat || !lon) {
      setApiError('Please detect or enter location coordinates first.');
      return;
    }
    setApiLoading(true);
    setApiError('');
    try {
      const res  = await fetch(`/api/agro/conditions?lat=${lat}&lon=${lon}`);
      const data = await res.json();
      if (!data.success) {
        setApiError(data.error?.message || 'API error. Using manual selection.');
        setApiLoading(false);
        return;
      }
      const c = data.data;
      setApiConditions(c);
      // Auto-fill from API (unless user has overridden)
      if (!seasonOverridden) setSeason(c.classified.season);
      if (!waterOverridden)  setWater(c.classified.waterAvailability);
      setApiLoading(false);
    } catch (err) {
      setApiError('Could not reach the server. Using manual selection.');
      setApiLoading(false);
    }
  };

  React.useEffect(() => {
    if (step === 3 && lat && lon && !apiConditions && !apiError) {
      handleFetchConditions();
    }
  }, [step, lat, lon]);

  // ── Step 3: Get recommendations ──────────────────────────────────────────
  const handleGenerate = (e) => {
    e.preventDefault();
    setLoading(true);
    setNoResults(false);

    setTimeout(() => {
      const tempC          = apiConditions?.current?.tempC ?? null;
      const humidity       = apiConditions?.current?.humidity ?? 60;
      const precipMm       = apiConditions?.current?.precipMm ?? 0;
      const forecastRainMm = apiConditions?.forecast?.rainNext7DaysMm ?? 0;
      const dataSource     = apiConditions ? 'api' : 'manual';

      const ranked = recommendCrops({ soil, season, tempC, humidity, precipMm, forecastRainMm });

      if (ranked.length === 0) {
        setNoResults(true);
        setFieldAssignments([]);
        setLoading(false);
        setStep(4);
        return;
      }

      const assignments = assignCropsToFields(ranked, parseInt(numFields)).map((a, i) => ({
        ...a,
        fieldSize:  parseFloat(fieldSizes[i]) || 0,
        dataSource
      }));

      setFieldAssignments(assignments);
      setLoading(false);
      setStep(4);
    }, 600);
  };

  // ── Reset ────────────────────────────────────────────────────────────────
  const handleReset = () => {
    setStep(1);
    setTotalArea(''); 
    // Do not clear the global location state on reset so they don't have to re-fetch
    setNumFields(''); setFieldSizes([]);
    setSoil('black'); setSeason(detectSeason()); setWater('available');
    setApiConditions(null); setApiError('');
    setSeasonOverridden(false); setWaterOverridden(false);
    setFieldAssignments([]); setNoResults(false);
  };

  // ═══════════════════════════════════════════════════════════════════════
  const { t } = useTranslation();
  
  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-light-green rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
          <Leaf className="text-primary-green" size={32} />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-dark-green mb-2">{t('advisor.title')}</h1>
        <p className="text-gray-500 text-base">{t('advisor.subtitle')}</p>
      </div>

      <StepBar step={step} />

      {/* ══ STEP 1: Land ═════════════════════════════════════════════════ */}
      {step === 1 && (
        <form onSubmit={handleStep1} className="card bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-lg mx-auto">
          <h2 className="text-xl font-extrabold text-dark-green mb-6 flex items-center gap-2">
            <MapPin className="text-primary-green" size={20} /> {t('advisor.step1Title')}
          </h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t('advisor.location')}</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <LocationSearch className="flex-grow" />
                <LocationButton />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">{t('advisor.latitude')}</label>
                <input type="number" step="0.00001" placeholder={t('advisor.latPlaceholder')} value={lat || ''}
                  onChange={e => setManualLocation(e.target.value, lon, location)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-green" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">{t('advisor.longitude')}</label>
                <input type="number" step="0.00001" placeholder={t('advisor.lngPlaceholder')} value={lon || ''}
                  onChange={e => setManualLocation(lat, e.target.value, location)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-green" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t('advisor.landArea')}</label>
              <input type="number" step="0.01" min="0.1" className="input-field text-lg font-bold"
                placeholder={t('advisor.landAreaPlaceholder')} value={totalArea} onChange={e => setTotalArea(e.target.value)} required />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full justify-center mt-8 text-lg py-4 flex items-center gap-2">
            {t('common.continue') || 'Continue'} <ChevronRight size={22} />
          </button>
        </form>
      )}

      {/* ══ STEP 2: Fields ═══════════════════════════════════════════════ */}
      {step === 2 && (
        <form onSubmit={handleStep2} className="card bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
          <BackBtn onClick={() => setStep(1)} label={t('advisor.backToLand')} />
          <h2 className="text-xl font-extrabold text-dark-green mb-1 flex items-center gap-2">
            <LayoutGrid className="text-primary-green" size={20} /> {t('advisor.step2Title')}
          </h2>
          <p className="text-gray-500 text-sm mb-6">{t('advisor.totalLand')}: <strong>{totalArea} {t('common.acres')}</strong>{location && <> · <span className="text-primary-green">{location}</span></>}</p>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">{t('advisor.numFieldsQuestion')}</label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {[2, 3, 4, 5, 6, 8].map(n => (
                <button key={n} type="button" onClick={() => handleNumFieldsChange(n)}
                  className={`py-3 rounded-xl text-sm font-bold border-2 transition-all duration-200
                    ${numFields === n ? 'bg-primary-green text-white border-primary-green shadow-md scale-105'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-primary-green hover:text-primary-green'}`}>
                  {n} {t('advisor.fields')}
                </button>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm text-gray-500">{t('advisor.customLabel')}</span>
              <input type="number" min="1" max="20" value={numFields || ''} placeholder={t('advisor.customPlaceholder')}
                onChange={e => handleNumFieldsChange(e.target.value)}
                className="w-24 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-green" />
            </div>
          </div>

          {numFields > 0 && fieldSizes.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-gray-700">{t('advisor.eachFieldSize')}</label>
                <button type="button" onClick={handleDivideEqually}
                  className="text-xs bg-light-green text-primary-green px-3 py-1.5 rounded-full font-bold flex items-center gap-1 hover:bg-primary-green hover:text-white transition-colors">
                  <Divide size={14} /> {t('advisor.splitField')}
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {fieldSizes.map((size, idx) => (
                  <div key={idx}>
                    <label className="block text-xs font-bold text-dark-green mb-1">{t('advisor.field')} {idx + 1}</label>
                    <input type="number" step="0.01" min="0" required
                      className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none font-semibold
                        ${overAllocated ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white focus:border-primary-green'}`}
                      value={size} onChange={e => handleFieldSizeChange(idx, e.target.value)} />
                  </div>
                ))}
              </div>
              <div className={`mt-3 flex items-center justify-between text-sm px-3 py-2.5 rounded-lg font-semibold
                ${overAllocated ? 'bg-red-100 text-red-700' : 'bg-green-50 text-green-700'}`}>
                <span>Allocated: {totalAllocated.toFixed(2)} {t('common.acres')}</span>
                <span>Remaining: {Math.max(0, parseFloat(totalArea) - totalAllocated).toFixed(2)} {t('common.acres')}</span>
              </div>
              {overAllocated && <p className="text-red-600 text-xs mt-1 font-semibold">⚠ Exceeds total land area.</p>}
            </div>
          )}

          <div className="flex gap-3 mt-4">
            <button type="button" onClick={() => setStep(1)}
              className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold flex items-center justify-center gap-2 hover:border-gray-400 transition-colors">
              <ChevronLeft size={18} /> {t('common.back')}
            </button>
            <button type="submit" disabled={!numFields || fieldSizes.length === 0 || overAllocated}
              className="flex-1 btn-primary justify-center py-3 text-base flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {t('common.continue') || 'Continue'} <ChevronRight size={20} />
            </button>
          </div>
        </form>
      )}

      {/* ══ STEP 3: Conditions ════════════════════════════════════════════ */}
      {step === 3 && (
        <form onSubmit={handleGenerate} className="max-w-2xl mx-auto space-y-5">
          <BackBtn onClick={() => setStep(2)} label={t('advisor.backToFields')} />
          <h2 className="text-xl font-extrabold text-dark-green mb-1 flex items-center gap-2">
            <Sun className="text-primary-green" size={20} /> {t('advisor.step3Title')}
          </h2>
          <p className="text-gray-500 text-sm">{numFields} {t('advisor.fields')} · {totalArea} {t('common.acres')} · {location || t('advisor.location')}</p>

          {/* API fetch panel */}
          <div className="card bg-white p-6 rounded-2xl shadow-sm border border-blue-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-dark-green flex items-center gap-2">
                <Wifi size={16} className="text-blue-500" /> {t('advisor.fetchLiveData')}
              </h3>
              <button type="button" onClick={handleFetchConditions} disabled={apiLoading || !lat || !lon}
                className="bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                {apiLoading ? <Loader2 size={16} className="animate-spin" /> : <Wifi size={16} />}
                {apiLoading ? t('advisor.fetching') : t('advisor.fetchBtn')}
              </button>
            </div>
            {!lat && <p className="text-xs text-orange-600 font-semibold">⚠ Set location coordinates in Step 1 to use the API.</p>}

            {apiError && (
              <div className="mt-2 bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2 text-sm text-red-700">
                <WifiOff size={14} className="shrink-0 mt-0.5" /> {apiError}
              </div>
            )}

            {apiConditions && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: <Thermometer size={14} className="text-red-500" />, label: 'Temperature', val: `${apiConditions.current.tempC}°C`, bg: 'bg-red-50' },
                  { icon: <Droplets size={14} className="text-blue-500" />, label: 'Humidity', val: `${apiConditions.current.humidity}%`, bg: 'bg-blue-50' },
                  { icon: <CloudRain size={14} className="text-cyan-500" />, label: 'Current Rain', val: `${apiConditions.current.precipMm} mm`, bg: 'bg-cyan-50' },
                  { icon: <Wind size={14} className="text-gray-500" />, label: 'Wind', val: `${apiConditions.current.windKph} km/h`, bg: 'bg-gray-50' },
                  { icon: <CloudRain size={14} className="text-indigo-500" />, label: '7-day Rain', val: `${apiConditions.forecast.rainNext7DaysMm} mm`, bg: 'bg-indigo-50' },
                  { icon: <Sun size={14} className="text-yellow-500" />, label: 'Condition', val: apiConditions.current.weatherDesc, bg: 'bg-yellow-50', full: true },
                ].map((item, i) => (
                  <div key={i} className={`${item.full ? 'col-span-2' : ''} ${item.bg} rounded-xl p-3 flex items-start gap-2`}>
                    <span className="mt-0.5">{item.icon}</span>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">{item.label}</p>
                      <p className="text-sm font-extrabold text-gray-800 capitalize">{item.val}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {apiConditions && (
              <div className="mt-3 bg-green-50 border border-green-200 rounded-xl px-4 py-2 text-xs text-green-800 font-semibold">
                ✅ {apiConditions.classified.waterReason}
              </div>
            )}
          </div>

          {/* Manual fields */}
          <div className="card bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-dark-green">
              {apiConditions ? 'Review / Override Conditions' : 'Manual Condition Selection'}
            </h3>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t('advisor.soilType')}</label>
              <select className="input-field bg-white" value={soil} onChange={e => setSoil(e.target.value)}>
                <option value="sandy">{t('advisor.soilTypes.sandy')}</option>
                <option value="clay">{t('advisor.soilTypes.clay')}</option>
                <option value="loamy">{t('advisor.soilTypes.loamy')}</option>
                <option value="black">{t('advisor.soilTypes.black')}</option>
                <option value="red">{t('advisor.soilTypes.red')}</option>
                <option value="alluvial">{t('advisor.soilTypes.alluvial')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                {t('advisor.season')}
                {apiConditions && !seasonOverridden && <span className="ml-2 text-xs text-blue-600 font-semibold">{t('advisor.autoDetected')}</span>}
              </label>
              <div className="relative">
                <select className="input-field pl-10 bg-white" value={season}
                  onChange={e => { setSeason(e.target.value); setSeasonOverridden(true); }}>
                  <option value="kharif">{t('advisor.seasons.kharif')}</option>
                  <option value="rabi">{t('advisor.seasons.rabi')}</option>
                  <option value="zaid">{t('advisor.seasons.zaid')}</option>
                </select>
                <Sun className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                {t('advisor.water')}
                {apiConditions && !waterOverridden && <span className="ml-2 text-xs text-blue-600 font-semibold">{t('advisor.fromAPI')}</span>}
              </label>
              <div className="relative">
                <select className="input-field pl-10 bg-white" value={water}
                  onChange={e => { setWater(e.target.value); setWaterOverridden(true); }}>
                  <option value="available">{t('advisor.irrigationOptions.available')}</option>
                  <option value="partial">{t('advisor.irrigationOptions.partial')}</option>
                  <option value="not_available">{t('advisor.irrigationOptions.not_available')}</option>
                </select>
                <Droplets className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(2)}
              className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold flex items-center justify-center gap-2 hover:border-gray-400 transition-colors">
              <ChevronLeft size={18} /> {t('common.back')}
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 btn-primary justify-center py-3 text-base flex items-center gap-2">
              {loading ? <Loader2 size={20} className="animate-spin" /> : <Leaf size={20} />}
              {loading ? t('advisor.calculating') : t('advisor.getRecommendations')}
            </button>
          </div>
        </form>
      )}

      {/* ══ STEP 4: Results ══════════════════════════════════════════════ */}
      {step === 4 && (
        <div className="animate-slide-up">
          <BackBtn onClick={() => setStep(3)} label={t('advisor.backToConditions')} />

          {/* Summary */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <h2 className="text-2xl font-extrabold text-dark-green mb-4 flex items-center gap-2">
              <CheckCircle className="text-primary-green" size={24} /> {t('advisor.step4Title')}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm mb-4">
              {[
                { label: t('advisor.totalLand'), value: `${totalArea} ${t('common.acres')}` },
                { label: t('advisor.fields'), value: `${numFields}` },
                { label: t('advisor.soil'), value: t(`advisor.soilTypes.${soil}`) || soil },
                { label: t('advisor.season'), value: t(`advisor.seasons.${season}`) || season },
                { label: t('advisor.water_label'), value: t(`advisor.irrigationOptions.${water}`) || water },
                { label: t('advisor.location_label'), value: location || '—' },
              ].map(item => (
                <div key={item.label} className="bg-gray-50 rounded-xl px-3 py-2">
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{item.label}</p>
                  <p className="font-bold text-dark-green">{item.value}</p>
                </div>
              ))}
            </div>

            {apiConditions && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2 text-sm text-blue-800 font-semibold flex items-center gap-2">
                <Wifi size={15} /> {t('advisor.apiSuccess')} · Temperature: {apiConditions.current.tempC}°C · Humidity: {apiConditions.current.humidity}%
              </div>
            )}
            {!apiConditions && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-2 text-sm text-orange-800 font-semibold flex items-center gap-2">
                <WifiOff size={15} /> {t('advisor.apiManual')}
              </div>
            )}

            {fieldAssignments.some(a => a.isRepeated) && (
              <div className="mt-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl px-4 py-2 text-sm flex items-start gap-2">
                <Repeat2 size={15} className="shrink-0 mt-0.5" />
                {t('advisor.cropRepeatedNote')}
              </div>
            )}
          </div>

          {/* No results */}
          {noResults && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-3 mb-6">
              <XCircle className="text-red-500 shrink-0 mt-0.5" size={22} />
              <div>
                <p className="font-bold text-red-700">{t('advisor.noResultsTitle')}</p>
                <p className="text-sm text-red-600">
                  {t('advisor.noResultsMsg')}
                </p>
              </div>
            </div>
          )}

          {/* Field cards */}
          <div className="space-y-8">
            {fieldAssignments.map((assignment) => (
              <div key={assignment.fieldIndex} className="bg-gray-50 rounded-2xl p-4 sm:p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 bg-primary-green text-white rounded-xl flex items-center justify-center font-extrabold text-xl shadow">
                    {assignment.fieldIndex}
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-dark-green">{t('advisor.field')} {assignment.fieldIndex}</h3>
                    <p className="text-sm text-gray-500 font-semibold">
                      {assignment.fieldSize} {t('common.acres')} · {t('advisor.recommended')}: <span className="text-primary-green">{assignment.crop.name}</span>
                      {' · '}{t('advisor.suitability')}: <span className={`font-bold ${assignment.score >= 60 ? 'text-green-600' : assignment.score >= 35 ? 'text-yellow-600' : 'text-red-600'}`}>{assignment.score}/100</span>
                    </p>
                  </div>
                </div>
                <FieldResultCard assignment={assignment} />
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
            <button onClick={() => setStep(3)}
              className="bg-white border-2 border-primary-green text-primary-green font-bold px-8 py-3 rounded-xl hover:bg-light-green transition-all flex items-center justify-center gap-2">
              <ChevronLeft size={18} /> {t('advisor.changeConditions')}
            </button>
            <button onClick={handleReset}
              className="bg-primary-green text-white font-bold px-8 py-3 rounded-xl hover:bg-dark-green transition-all">
              {t('advisor.startOver')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropAdvisorPage;
