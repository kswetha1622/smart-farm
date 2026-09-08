import React from 'react';
import { Volume2, Square } from 'lucide-react';
import { useVoice } from '../../hooks/useVoice';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export const ListenButton = ({ text, labelKey = 'common.listenResult', className = '' }) => {
  const { t } = useTranslation();
  const { isSpeaking, speak, stop } = useVoice();

  return (
    <button
      onClick={() => isSpeaking ? stop() : speak(text)}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all ${
        isSpeaking 
          ? 'bg-blue-100 text-weather-blue border border-blue-300' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      } ${className}`}
    >
      {isSpeaking ? (
        <>
          <Square size={18} className="animate-pulse" />
          <span>{t('common.stop')}</span>
          <div className="flex gap-1 ml-2">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="w-1 bg-weather-blue rounded-full"
                animate={{ height: [8, 16, 8] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </>
      ) : (
        <>
          <Volume2 size={18} />
          <span>{t(labelKey)}</span>
        </>
      )}
    </button>
  );
};
