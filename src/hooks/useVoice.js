import { useState, useCallback, useEffect } from 'react';
import { VoiceAPI } from '../services/apiPlaceholders';
import { useSettings } from '../context/SettingsContext';
import { useTranslation } from 'react-i18next';

export const useVoice = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { settings } = useSettings();
  const { i18n } = useTranslation();

  const speak = useCallback((text) => {
    if (!settings.voiceOutput) return;
    
    setIsSpeaking(true);
    VoiceAPI.synthesizeSpeech(text, i18n.language).then(() => {
      setIsSpeaking(false);
    });
  }, [settings.voiceOutput, i18n.language]);

  const stop = useCallback(() => {
    VoiceAPI.stopSpeech();
    setIsSpeaking(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      VoiceAPI.stopSpeech();
    };
  }, []);

  return { isSpeaking, speak, stop };
};
