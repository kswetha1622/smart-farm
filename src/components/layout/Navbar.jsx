import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Bell, User, Leaf } from 'lucide-react';
import { LanguageSelector } from '../ui/LanguageSelector';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const { t } = useTranslation();
  const { currentUser, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/', label: 'home' },
    { to: '/crop-advisor', label: 'cropAdvisor' },
    { to: '/weather', label: 'weather' },
    { to: '/disease-detection', label: 'diseaseDetection' },
    { to: '/voice-assistant', label: 'voiceAssistant' },
  ];

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <>
      <header 
        className={`fixed top-0 w-full z-40 transition-all duration-300 ${
          isScrolled ? 'bg-dark-green shadow-lg py-3' : 'bg-dark-green py-4 md:py-5'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 text-white group">
            <div className="bg-white p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-green">
              <Leaf className="text-primary-green" size={24} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight leading-none">SMART FARM AI</span>
              <span className="text-xs text-green-200 hidden md:block mt-1 font-medium tracking-wide">
                Smart Farming, Better Tomorrow
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => 
                  `px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive 
                      ? 'bg-primary-green text-white shadow-inner' 
                      : 'text-green-50 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                {t(`nav.${link.label}`)}
              </NavLink>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3 md:gap-4">
            <LanguageSelector />
            
            <button className="hidden md:flex bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-lg transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-danger-red rounded-full border-2 border-dark-green"></span>
            </button>
            
            {currentUser ? (
              <button onClick={() => logout()} title="Logout" className="hidden md:flex bg-danger-red/20 hover:bg-danger-red/40 text-white p-2.5 rounded-lg transition-colors">
                <User size={20} />
              </button>
            ) : (
              <Link to="/login" className="hidden md:flex bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-lg transition-colors">
                <User size={20} />
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden text-white p-2 -mr-2 bg-white/5 rounded-lg active:scale-95"
              onClick={toggleMenu}
            >
              {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 pt-20 bg-dark-green lg:hidden overflow-y-auto"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => 
                    `p-4 rounded-xl text-lg font-semibold flex items-center gap-3 transition-colors ${
                      isActive 
                        ? 'bg-primary-green text-white' 
                        : 'bg-white/5 text-green-50 hover:bg-white/10'
                    }`
                  }
                >
                  {t(`nav.${link.label}`)}
                </NavLink>
              ))}
              
              <div className="h-px bg-white/10 my-4" />
              <div className="grid grid-cols-2 gap-4">
                <Link 
                  to="/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-white/5 p-4 rounded-xl text-center text-white font-medium hover:bg-white/10"
                >
                  {t('nav.settings')}
                </Link>
                {currentUser ? (
                  <button 
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="bg-danger-red/20 text-danger-red p-4 rounded-xl text-center font-bold hover:bg-danger-red/30 flex items-center justify-center gap-2"
                  >
                    Logout
                  </button>
                ) : (
                  <Link 
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-white/5 p-4 rounded-xl text-center text-white font-medium hover:bg-white/10 flex items-center justify-center gap-2"
                  >
                    <User size={20} /> Login
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Spacer for fixed header */}
      <div className="h-20"></div>
    </>
  );
};
