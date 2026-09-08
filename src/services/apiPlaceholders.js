// These are placeholder services that would connect to real backends later.

export const WeatherAPI = {
  getForecast: async (lat, lng) => {
    // In real app, call OpenWeatherMap or similar
    return new Promise(resolve => {
      setTimeout(() => {
        import('../data/mockWeather').then(module => resolve(module.mockWeather));
      }, 1500);
    });
  }
};

export const CropAdvisorAPI = {
  getRecommendations: async (params) => {
    return new Promise(resolve => {
      setTimeout(() => {
        import('../data/mockCrops').then(module => resolve(module.mockCrops));
      }, 2000);
    });
  }
};

export const SatelliteAPI = {
  getDamageAssessment: async (polygon, beforeDate, afterDate) => {
    return new Promise(resolve => {
      setTimeout(() => {
        import('../data/mockSatellite').then(module => resolve(module.mockSatelliteData));
      }, 3000);
    });
  }
};

export const DiseaseDetectionAPI = {
  analyzeImage: async (imageFile) => {
    return new Promise(resolve => {
      setTimeout(() => {
        import('../data/mockDisease').then(module => resolve(module.mockDiseaseResult));
      }, 2500);
    });
  }
};

export const VoiceAPI = {
  synthesizeSpeech: (text, langCode = 'en-US') => {
    if (!('speechSynthesis' in window)) return Promise.resolve();
    
    // Frontend-only placeholder using browser TTS
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    // Map our app languages to browser TTS if possible
    const langMap = {
      'en': 'en-IN',
      'hi': 'hi-IN',
      'te': 'te-IN',
      'ta': 'ta-IN',
      'kn': 'kn-IN',
      'mr': 'mr-IN'
    };
    if (langMap[langCode]) {
      utterance.lang = langMap[langCode];
    }
    
    window.speechSynthesis.speak(utterance);
    
    return new Promise(resolve => {
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve(); // always resolve so .then() never hangs
    });
  },
  stopSpeech: () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
};
