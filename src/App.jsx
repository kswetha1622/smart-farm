import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { Footer } from './components/layout/Footer';
import { LocationProvider } from './context/LocationContext';

// Pages
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
import ProfilePage from './pages/ProfilePage';
import ResetPasswordPage from './pages/ResetPasswordPage';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const PublicRoute = ({ children }) => {
  const { currentUser } = useAuth();
  
  if (currentUser) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Layout wrapper to hide Navbar/Footer on login page
const AppLayout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/reset-password' || location.pathname === '/__/auth/action';

  if (isAuthPage) {
    return <div className="min-h-screen flex flex-col">{children}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen relative bg-gray-50">
      <Navbar />
      <main className="flex-grow pt-20">{children}</main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <LocationProvider>
        <BrowserRouter>
          <AppLayout>
            <Routes>
              {/* Public route */}
              <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
              <Route path="/reset-password" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />
              <Route path="/__/auth/action" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />
              
              {/* Protected routes */}
              <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
              <Route path="/satellite-analysis" element={<ProtectedRoute><SatelliteAnalysisPage /></ProtectedRoute>} />
              <Route path="/crop-advisor" element={<ProtectedRoute><CropAdvisorPage /></ProtectedRoute>} />
              <Route path="/weather" element={<ProtectedRoute><WeatherPage /></ProtectedRoute>} />
              <Route path="/disease-detection" element={<ProtectedRoute><DiseaseDetectionPage /></ProtectedRoute>} />
              <Route path="/voice-assistant" element={<ProtectedRoute><VoiceAssistantPage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/about" element={<ProtectedRoute><AboutPage /></ProtectedRoute>} />
              <Route path="/help" element={<ProtectedRoute><HelpPage /></ProtectedRoute>} />
              
              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </LocationProvider>
    </AuthProvider>
  );
};

export default App;
