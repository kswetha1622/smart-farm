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
      theme: 'system', // light, dark, system
      accentColor: 'green',
      loginNotifications: true,
    };
  });

  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    
    const root = document.documentElement;
    
    // Simple Mode
    if (settings.simpleMode) {
      document.body.classList.add('simple-mode');
    } else {
      document.body.classList.remove('simple-mode');
    }

    // Theme (Dark Mode logic for Tailwind)
    const applyTheme = (theme) => {
      if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };
    
    applyTheme(settings.theme);

    // Accent colors could be handled here by injecting CSS variables if needed
    // root.setAttribute('data-accent', settings.accentColor);

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
