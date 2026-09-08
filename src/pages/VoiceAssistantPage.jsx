import React from 'react';
import { useTranslation } from 'react-i18next';
import { VoiceAssistant } from '../components/voice/VoiceComponents';

const VoiceAssistantPage = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-dark-green mb-3">
          {t('voice.title')}
        </h1>
        <p className="text-gray-600 text-lg">{t('voice.subtitle')}</p>
      </div>

      <div className="animate-fade-in">
        <VoiceAssistant />
      </div>
    </div>
  );
};

export default VoiceAssistantPage;
