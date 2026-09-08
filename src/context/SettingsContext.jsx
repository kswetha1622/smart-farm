import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('appSettings');
    return saved ? JSON.parse(saved) : {
      voiceOutput: true,
      autoRead: false,
      speechSpeed: 'normal', // slow, normal, fast
      weatherAlerts: true,
      cropAlerts: true,
      diseaseAlerts: true,
      largeText: false,
      highContrast: false,
      simpleMode: false,
    };
  });

  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    if (settings.simpleMode) {
      document.body.classList.add('simple-mode');
    } else {
      document.body.classList.remove('simple-mode');
    }
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  );
};
