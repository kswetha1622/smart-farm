import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldAlert, AlertCircle, ShieldCheck, Leaf, Bug, Stethoscope, AlertTriangle, Search } from 'lucide-react';
import { DiseaseUpload } from '../components/disease/DiseaseComponents';
import { analyzeCropImage } from '../services/diseaseService';
import { useLocation } from '../context/LocationContext';

const DiseaseDetectionPage = () => {
  const { t, i18n } = useTranslation();
  const { locationState } = useLocation();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async (file, source) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeCropImage(file, i18n.language, locationState);
      setResult(data);
    } catch (err) {
      console.error('[Disease] Analysis failed:', err);
      setError(t('disease.error') || 'Analysis failed. Please try again with a clear photo.');
    } finally {
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setResult(null);
    setError(null);
  };

  const getSeverityIcon = (severity) => {
    const s = severity?.toLowerCase();
    if (s === 'low') return `🟢 ${t('disease.severityLow') || 'Low'}`;
    if (s === 'moderate') return `🟡 ${t('disease.severityModerate') || 'Moderate'}`;
    if (s === 'severe') return `🔴 ${t('disease.severitySevere') || 'Severe'}`;
    return severity;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-dark-green flex items-center justify-center gap-3 mb-2">
          <ShieldAlert className="text-danger-red" size={36} />
          {t('disease.title')}
        </h1>
        <p className="text-gray-600 text-lg">{t('disease.subtitle') || 'AI-powered crop health analysis system'}</p>
      </div>

      {!loading && !result && !error && (
        <div className="animate-fade-in">
          <DiseaseUpload onAnalyze={handleAnalyze} />
        </div>
      )}

      {loading && (
        <div className="card border-2 border-primary-green/20 min-h-[400px] flex flex-col justify-center items-center p-8">
          <div className="w-16 h-16 border-4 border-primary-green border-t-transparent rounded-full animate-spin mb-8"></div>
          <h2 className="text-2xl font-bold text-dark-green mb-6">🔍 Analyzing your image...</h2>
          <div className="space-y-3 text-left text-gray-700 font-medium">
            <p className="flex items-center gap-2"><span className="animate-pulse">🌱</span> Identifying plant...</p>
            <p className="flex items-center gap-2"><span className="animate-pulse" style={{ animationDelay: '200ms' }}>🍃</span> Examining leaf/fruit...</p>
            <p className="flex items-center gap-2"><span className="animate-pulse" style={{ animationDelay: '400ms' }}>🦠</span> Checking for diseases...</p>
            <p className="flex items-center gap-2"><span className="animate-pulse" style={{ animationDelay: '600ms' }}>🐛</span> Checking for pests...</p>
            <p className="flex items-center gap-2"><span className="animate-pulse" style={{ animationDelay: '800ms' }}>📊</span> Assessing severity...</p>
            <p className="flex items-center gap-2"><span className="animate-pulse" style={{ animationDelay: '1000ms' }}>💊</span> Preparing recommendations...</p>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="card border-2 border-red-200 bg-red-50 text-center p-10 space-y-4">
          <AlertCircle className="mx-auto text-danger-red" size={48} />
          <p className="text-danger-red font-semibold text-lg">{error}</p>
          <button onClick={resetAnalysis} className="btn-primary mx-auto">
            Try Again
          </button>
        </div>
      )}

      {result && !loading && (
        <div className="animate-slide-up space-y-6">
          <button onClick={resetAnalysis} className="text-primary-green font-bold hover:underline mb-2 flex items-center gap-1">
            &larr; Analyze Another Image
          </button>

          {result.isUnclear ? (
            <div className="card bg-yellow-50 border-2 border-yellow-200 p-8 text-center space-y-4">
              <AlertTriangle className="mx-auto text-yellow-600" size={48} />
              <h2 className="text-2xl font-bold text-yellow-800">⚠️ Image quality is insufficient.</h2>
              <p className="text-yellow-700">{result.message}</p>
              <div className="bg-white/50 rounded-xl p-4 text-left max-w-md mx-auto mt-4 text-yellow-800">
                <p className="font-semibold mb-2">Please take or upload a clearer photo showing:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>The affected leaf</li>
                  <li>The damaged fruit</li>
                  <li>The affected plant area</li>
                  <li>The insect/pest if visible</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="card bg-white border-2 shadow-sm p-6 md:p-8">
              <div className="flex items-center gap-3 border-b pb-4 mb-6">
                <Stethoscope className="text-primary-green" size={32} />
                <h2 className="text-2xl font-extrabold text-dark-green">🌱 AI CROP HEALTH ANALYSIS</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">{t('disease.imageType') || 'Image Type'}</p>
                    <p className="text-lg font-bold text-gray-800 capitalize">
                      {result.image_type === 'leaf' ? '🍃' : result.image_type === 'fruit' ? '🍎' : '🌱'} {result.image_type}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">{t('disease.plantId') || 'Plant Identification'}</p>
                    <p className="text-xl font-bold text-dark-green">{result.plant.name}</p>
                    <p className="text-sm text-gray-600">{t('disease.cropType') || 'Crop Type'}: {result.plant.crop_type}</p>
                    <p className="text-sm text-gray-500 italic mt-1">{t('disease.scientificName') || 'Scientific Name'}: {result.plant.scientific_name}</p>
                  </div>

                  {result.pest?.detected && (
                    <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                      <p className="text-sm text-orange-600 font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><Bug size={14} /> {t('disease.pestDetection')}</p>
                      <p className="text-xl font-bold text-orange-800">{result.pest.name}</p>
                      <p className="text-sm text-orange-700 mt-1">{t('disease.confidence')}: {result.pest.confidence} | {t('disease.severity')}: {getSeverityIcon(result.pest.severity)}</p>
                    </div>
                  )}
                </div>

                {/* Disease Info */}
                <div className="space-y-4">
                  <div className={`rounded-xl p-4 border ${result.disease.name === 'Healthy' ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                    <p className={`text-sm font-bold uppercase tracking-wider mb-1 flex items-center gap-1 ${result.disease.name === 'Healthy' ? 'text-green-600' : 'text-red-600'}`}>
                      {result.disease.name === 'Healthy' ? <ShieldCheck size={14} /> : <AlertCircle size={14} />} {t('disease.diseaseDetection')}
                    </p>
                    <p className={`text-xl font-bold ${result.disease.name === 'Healthy' ? 'text-green-800' : 'text-red-800'}`}>
                      {result.disease.name}
                    </p>
                    {result.disease.name !== 'Healthy' && (
                      <p className={`text-sm mt-1 ${result.disease.name === 'Healthy' ? 'text-green-700' : 'text-red-700'}`}>
                        {t('disease.confidence')}: {result.disease.confidence} | {t('disease.severity')}: {getSeverityIcon(result.disease.severity)}
                      </p>
                    )}
                  </div>

                  {result.multiple_possibilities?.length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
                      <p className="text-sm text-yellow-600 font-bold uppercase tracking-wider mb-2">{t('disease.possibleConditions')}</p>
                      <ul className="space-y-1">
                        {result.multiple_possibilities.map((p, i) => (
                          <li key={i} className="text-sm text-yellow-800">
                            <strong>{i+1}. {p.name}</strong> &mdash; {p.likelihood}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Analysis Details */}
              <div className="mt-8 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-dark-green flex items-center gap-2 border-b pb-2 mb-3">
                    <Search size={20} className="text-primary-green" /> {t('disease.visibleSymptoms')}
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    {result.symptoms?.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-dark-green flex items-center gap-2 border-b pb-2 mb-3">
                    <AlertTriangle size={20} className="text-yellow-500" /> {t('disease.effectsOnCrop')}
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    {result.effects?.map((e, i) => <li key={i}>{e}</li>)}
                  </ul>
                </div>

                {result.disease.name !== 'Healthy' && (
                  <div>
                    <h3 className="text-lg font-bold text-dark-green flex items-center gap-2 border-b pb-2 mb-3">
                      <ShieldCheck size={20} className="text-primary-green" /> {t('disease.recommendedTreatment')}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="font-bold text-gray-800 mb-2">{t('disease.immediateActions')}</p>
                        <ul className="list-disc pl-4 text-sm text-gray-600 space-y-1">
                          {result.treatment?.immediate?.map((t, i) => <li key={i}>{t}</li>)}
                        </ul>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="font-bold text-gray-800 mb-2">{t('disease.culturalControl')}</p>
                        <ul className="list-disc pl-4 text-sm text-gray-600 space-y-1">
                          {result.treatment?.cultural?.map((t, i) => <li key={i}>{t}</li>)}
                        </ul>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="font-bold text-gray-800 mb-2">{t('disease.biologicalControl')}</p>
                        <ul className="list-disc pl-4 text-sm text-gray-600 space-y-1">
                          {result.treatment?.biological?.map((t, i) => <li key={i}>{t}</li>)}
                        </ul>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="font-bold text-gray-800 mb-2">{t('disease.chemicalControl')}</p>
                        <ul className="list-disc pl-4 text-sm text-gray-600 space-y-1">
                          {result.treatment?.chemical?.map((t, i) => <li key={i}>{t}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-bold text-dark-green flex items-center gap-2 border-b pb-2 mb-3">
                    <Leaf size={20} className="text-primary-green" /> {t('disease.prevention') || 'Prevention'}
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    {result.prevention?.map((p, i) => <li key={i}>{p}</li>)}
                  </ul>
                </div>

                {result.warnings?.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800 text-sm font-medium">
                    <p className="font-bold mb-1 uppercase tracking-wider text-xs flex items-center gap-1"><AlertTriangle size={14} /> {t('disease.safetyWarning')}</p>
                    {result.warnings.map((w, i) => <p key={i}>{w}</p>)}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DiseaseDetectionPage;
