import React from 'react';
import { useTranslation } from 'react-i18next';
import { Leaf } from 'lucide-react';

const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="card p-8 text-center bg-white border border-gray-100">
        <div className="w-24 h-24 bg-dark-green rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green">
          <Leaf className="text-white" size={48} />
        </div>
        <h1 className="text-4xl font-bold text-dark-green mb-2">{t('about.title')}</h1>
        <p className="text-gray-500 font-medium mb-10">{t('about.version')}</p>
        
        <div className="text-left space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">{t('about.mission')}</h2>
            <p className="text-gray-600 leading-relaxed text-lg">{t('about.missionText')}</p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('about.features')}</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-600 font-medium">
              <li className="flex items-center gap-2"><span className="text-primary-green">✔</span> {t('features.fieldAnalysis.title')}</li>
              <li className="flex items-center gap-2"><span className="text-primary-green">✔</span> {t('features.cropAdvisor.title')}</li>
              <li className="flex items-center gap-2"><span className="text-primary-green">✔</span> {t('features.weatherForecast.title')}</li>
              <li className="flex items-center gap-2"><span className="text-primary-green">✔</span> {t('features.diseaseDetection.title')}</li>
              <li className="flex items-center gap-2"><span className="text-primary-green">✔</span> {t('features.cropDamage.title')}</li>
              <li className="flex items-center gap-2"><span className="text-primary-green">✔</span> {t('features.voiceAssistant.title')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
