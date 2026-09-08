import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Home, Map, CloudSun, Leaf, Mic } from 'lucide-react';

export const MobileBottomNav = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const navItems = [
    { to: '/', icon: Home, label: 'home' },
    { to: '/voice-assistant', icon: Mic, label: 'voiceAssistant', primary: true },
    { to: '/weather', icon: CloudSun, label: 'weather' },
    { to: '/disease-detection', icon: Leaf, label: 'diseaseDetection' },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 pb-safe">
      <div className="flex justify-around items-end h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          
          if (item.primary) {
            return (
              <Link 
                key={item.to} 
                to={item.to}
                className="flex flex-col items-center justify-center -mt-6 relative z-10"
              >
                <div className="w-14 h-14 bg-primary-green rounded-full flex items-center justify-center shadow-green text-white active:scale-95 transition-transform border-4 border-white">
                  <item.icon size={26} />
                </div>
              </Link>
            );
          }

          return (
            <Link 
              key={item.to} 
              to={item.to}
              className={`flex flex-col items-center justify-center w-16 h-full pb-1 transition-colors ${
                isActive ? 'text-primary-green' : 'text-gray-500 hover:text-dark-green'
              }`}
            >
              <div className={`mb-1 transition-transform ${isActive ? 'scale-110' : ''}`}>
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="text-[10px] font-semibold text-center leading-tight truncate w-full px-1">
                {t(`nav.${item.label}`)}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
