import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { Footer } from './components/layout/Footer';
import { LocationProvider } from './context/LocationContext';

// Pages (to be created)
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SatelliteAnalysisPage from './pages/SatelliteAnalysisPage';
import CropAdvisorPage from './pages/CropAdvisorPage';
import WeatherPage from './pages/WeatherPage';
import DiseaseDetectionPage from './pages/DiseaseDetectionPage';
import VoiceAssistantPage from './pages/VoiceAssistantPage';
import SettingsPage from './pages/SettingsPage';
import AboutPage from './pages/AboutPage';
import HelpPage from './pages/HelpPage';

const App = () => {
  return (
    <LocationProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen relative">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/satellite-analysis" element={<SatelliteAnalysisPage />} />
              <Route path="/crop-advisor" element={<CropAdvisorPage />} />
              <Route path="/weather" element={<WeatherPage />} />
              <Route path="/disease-detection" element={<DiseaseDetectionPage />} />
              <Route path="/voice-assistant" element={<VoiceAssistantPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/help" element={<HelpPage />} />
            </Routes>
          </main>
          <Footer />
          <MobileBottomNav />
        </div>
      </BrowserRouter>
    </LocationProvider>
  );
};

export default App;
