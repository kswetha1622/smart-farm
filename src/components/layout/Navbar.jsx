import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Bell, User, Leaf, LogOut, Settings, UserCircle } from 'lucide-react';
import { LanguageSelector } from '../ui/LanguageSelector';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const { t } = useTranslation();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setUserMenuOpen(false);
      setMobileMenuOpen(false);
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const loggedOutLinks = [
    { to: '/', label: 'home' }
  ];

  const loggedInLinks = [
    { to: '/', label: 'dashboard' },
    { to: '/crop-advisor', label: 'cropAdvisor' },
    { to: '/weather', label: 'weather' },
    { to: '/disease-detection', label: 'diseaseDetection' },
    { to: '/voice-assistant', label: 'voiceAssistant' },
  ];

  const navLinks = currentUser ? loggedInLinks : loggedOutLinks;
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
                    isActive && link.to === '/' && !currentUser ? '' :
                    isActive 
                      ? 'bg-primary-green text-white shadow-inner' 
                      : 'text-green-50 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                {t(`nav.${link.label}`) || link.label.charAt(0).toUpperCase() + link.label.slice(1)}
              </NavLink>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3 md:gap-4">
            <div className="hidden sm:block">
              <LanguageSelector />
            </div>
            
            {currentUser && (
              <button className="hidden md:flex bg-white/10 hover:bg-white/20 text-white p-2.5 rounded-lg transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-danger-red rounded-full border-2 border-dark-green"></span>
              </button>
            )}
            
            {/* User Menu Desktop */}
            <div className="relative hidden md:block" ref={userMenuRef}>
              {currentUser ? (
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white p-2 px-3 rounded-lg transition-colors"
                >
                  {currentUser.photoURL ? (
                    <img src={currentUser.photoURL} alt="User" className="w-6 h-6 rounded-full object-cover" />
                  ) : (
                    <User size={20} />
                  )}
                  <span className="text-sm font-semibold max-w-[100px] truncate">
                    {currentUser.displayName || 'Account'}
                  </span>
                </button>
              ) : (
                <div className="flex gap-2">
                  <Link to="/login" className="px-4 py-2 text-white font-semibold hover:bg-white/10 rounded-lg transition-colors">
                    Login
                  </Link>
                  <Link to="/login" onClick={() => {/* Pass state to open in signup mode */}} className="px-4 py-2 bg-primary-green text-white font-semibold rounded-lg hover:bg-green-600 transition-colors shadow-sm">
                    Register
                  </Link>
                </div>
              )}

              {/* Dropdown */}
              <AnimatePresence>
                {userMenuOpen && currentUser && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl overflow-hidden py-2 border border-gray-100"
                  >
                    <div className="px-4 py-3 border-b border-gray-100 mb-2">
                      <p className="text-sm font-semibold text-gray-800 truncate">{currentUser.displayName || 'Farmer'}</p>
                      <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                    </div>
                    
                    <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-green font-medium transition-colors">
                      <UserCircle size={18} /> Profile
                    </Link>
                    <Link to="/settings" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-green font-medium transition-colors">
                      <Settings size={18} /> Settings
                    </Link>
                    
                    <div className="h-px bg-gray-100 my-2"></div>
                    
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors">
                      <LogOut size={18} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

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
              <div className="mb-4 sm:hidden flex justify-center bg-white/5 p-2 rounded-xl">
                <LanguageSelector />
              </div>

              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => 
                    `p-4 rounded-xl text-lg font-semibold flex items-center gap-3 transition-colors ${
                      isActive && link.to === '/' && !currentUser ? 'bg-white/5 text-green-50' :
                      isActive 
                        ? 'bg-primary-green text-white' 
                        : 'bg-white/5 text-green-50 hover:bg-white/10'
                    }`
                  }
                >
                  {t(`nav.${link.label}`) || link.label.charAt(0).toUpperCase() + link.label.slice(1)}
                </NavLink>
              ))}
              
              <div className="h-px bg-white/10 my-4" />
              
              {currentUser ? (
                <div className="grid grid-cols-2 gap-4">
                  <Link 
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-white/5 p-4 rounded-xl text-center text-white font-medium hover:bg-white/10 flex flex-col items-center gap-2"
                  >
                    <UserCircle size={24} /> Profile
                  </Link>
                  <Link 
                    to="/settings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-white/5 p-4 rounded-xl text-center text-white font-medium hover:bg-white/10 flex flex-col items-center gap-2"
                  >
                    <Settings size={24} /> Settings
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="bg-danger-red/20 text-danger-red p-4 rounded-xl text-center font-bold hover:bg-danger-red/30 flex items-center justify-center gap-2 col-span-2"
                  >
                    <LogOut size={20} /> Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link 
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-white/10 p-4 rounded-xl text-center text-white font-bold hover:bg-white/20 transition-colors"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-primary-green p-4 rounded-xl text-center text-white font-bold hover:bg-green-600 transition-colors"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
