import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-dark-green text-green-50 pt-12 pb-24 lg:pb-12 mt-auto">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-3 text-white">
              <div className="bg-white p-2 rounded-xl">
                <Leaf className="text-primary-green" size={24} />
              </div>
              <span className="font-bold text-xl tracking-tight">SMART FARM AI</span>
            </Link>
            <p className="text-green-200 font-medium">
              {t('footer.tagline')}
            </p>
          </div>
          
          {/* Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4">{t('footer.links')}</h4>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/" className="hover:text-white transition-colors">{t('footer.home')}</Link>
              <Link to="/crop-advisor" className="hover:text-white transition-colors">{t('nav.cropAdvisor')}</Link>
              <Link to="/weather" className="hover:text-white transition-colors">{t('nav.weather')}</Link>
              <Link to="/disease-detection" className="hover:text-white transition-colors">{t('nav.diseaseDetection')}</Link>
              <Link to="/voice-assistant" className="hover:text-white transition-colors">{t('nav.voiceAssistant')}</Link>
              <Link to="/settings" className="hover:text-white transition-colors">{t('nav.settings')}</Link>
            </div>
          </div>
          
          {/* Legal/Help */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4">{t('nav.help')}</h4>
            <div className="flex flex-col gap-2">
              <Link to="/about" className="hover:text-white transition-colors">{t('footer.about')}</Link>
              <Link to="/help" className="hover:text-white transition-colors">{t('nav.help')}</Link>
              <a href="#" className="hover:text-white transition-colors">{t('footer.privacy')}</a>
              <a href="#" className="hover:text-white transition-colors">{t('footer.terms')}</a>
            </div>
          </div>
          
        </div>
        
        <div className="border-t border-green-800 pt-6 text-center text-sm text-green-300">
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
};
