import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { Settings, Volume2, Bell, Type, Eye, Save, Globe, Palette, User, Shield, AlertTriangle, LogOut, CheckCircle, Moon, Sun } from 'lucide-react';
import { LanguageSelector } from '../components/ui/LanguageSelector';
import { auth } from '../config/firebase';
import { deleteUser, sendEmailVerification } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const { t } = useTranslation();
  const { settings, updateSetting } = useSettings();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const [showSaved, setShowSaved] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = () => {
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      setError(null);
      await deleteUser(auth.currentUser);
      // Wait for AuthContext to detect logout and redirect
    } catch (err) {
      if (err.code === 'auth/requires-recent-login') {
        setError('Please log out and log back in before deleting your account for security reasons.');
      } else {
        setError('Failed to delete account. ' + err.message);
      }
      setDeleteConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  const Toggle = ({ label, checked, onChange }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
      <span className="font-medium text-gray-800 dark:text-gray-200">{label}</span>
      <button 
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green ${
          checked ? 'bg-primary-green' : 'bg-gray-300 dark:bg-gray-600'
        }`}
      >
        <span 
          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`} 
        />
      </button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-dark-green p-3 rounded-xl text-white shadow-md">
          <Settings size={28} />
        </div>
        <h1 className="text-3xl font-bold text-dark-green dark:text-green-500">{t('settings.title') || 'Settings'}</h1>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-lg shadow-sm">
          <p>{error}</p>
        </div>
      )}

      <div className="space-y-8">
        
        {/* A. Appearance */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6">
          <h2 className="text-xl font-bold text-dark-green dark:text-green-400 mb-4 flex items-center gap-2">
            <Palette size={24} /> Appearance
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block font-medium text-gray-800 dark:text-gray-200 mb-3">Theme</label>
              <div className="grid grid-cols-3 gap-3">
                {['light', 'dark', 'system'].map(theme => (
                  <button 
                    key={theme}
                    onClick={() => updateSetting('theme', theme)}
                    className={`flex flex-col items-center justify-center py-4 rounded-xl border-2 transition-all ${
                      settings.theme === theme 
                        ? 'border-primary-green bg-green-50 dark:bg-green-900/20 text-primary-green' 
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {theme === 'light' && <Sun size={24} className="mb-2" />}
                    {theme === 'dark' && <Moon size={24} className="mb-2" />}
                    {theme === 'system' && <Settings size={24} className="mb-2" />}
                    <span className="capitalize font-medium">{theme}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-800 dark:text-gray-200 mb-3">Accent Color</label>
              <div className="flex flex-wrap gap-4">
                {[
                  { name: 'green', color: 'bg-green-600' },
                  { name: 'blue', color: 'bg-blue-600' },
                  { name: 'purple', color: 'bg-purple-600' },
                  { name: 'teal', color: 'bg-teal-600' },
                  { name: 'orange', color: 'bg-orange-500' }
                ].map(accent => (
                  <button
                    key={accent.name}
                    onClick={() => updateSetting('accentColor', accent.name)}
                    className={`w-12 h-12 rounded-full ${accent.color} flex items-center justify-center transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-${accent.name}-500 ${settings.accentColor === accent.name ? 'ring-4 ring-offset-2 ring-gray-400 dark:ring-gray-300' : ''}`}
                    title={accent.name}
                  >
                    {settings.accentColor === accent.name && <CheckCircle size={20} className="text-white" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* B. Language */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6">
          <h2 className="text-xl font-bold text-dark-green dark:text-green-400 mb-4 flex items-center gap-2">
            <Globe size={24} /> {t('settings.language')}
          </h2>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600 flex justify-between items-center">
            <span className="font-medium text-gray-800 dark:text-gray-200">Website Language</span>
            <div className="bg-dark-green rounded-lg">
              <LanguageSelector />
            </div>
          </div>
        </section>

        {/* C. Notifications */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6">
          <h2 className="text-xl font-bold text-dark-green dark:text-green-400 mb-4 flex items-center gap-2">
            <Bell size={24} /> Notifications
          </h2>
          <div className="space-y-3">
            <Toggle 
              label="Login notification emails" 
              checked={settings.loginNotifications ?? true} 
              onChange={(v) => updateSetting('loginNotifications', v)} 
            />
            <Toggle 
              label="Security alerts" 
              checked={true} // Always on for security
              onChange={() => {}} 
            />
          </div>
        </section>

        {/* D. Account */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6">
          <h2 className="text-xl font-bold text-dark-green dark:text-green-400 mb-4 flex items-center gap-2">
            <User size={24} /> Account
          </h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Logged in as</p>
                  <p className="font-bold text-lg text-gray-800 dark:text-gray-100">{currentUser?.displayName || 'Farmer'}</p>
                  <p className="text-gray-600 dark:text-gray-300">{currentUser?.email}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => navigate('/profile')} className="px-4 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors">
                    Edit Profile
                  </button>
                  <button onClick={() => navigate('/reset-password')} className="px-4 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors">
                    Change Password
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600">
              <div className="flex items-center gap-3">
                <CheckCircle className={currentUser?.emailVerified ? "text-green-500" : "text-yellow-500"} size={24} />
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {currentUser?.emailVerified ? "Email Verified" : "Email Not Verified"}
                </span>
              </div>
              {!currentUser?.emailVerified && (
                <button className="text-sm font-medium text-primary-green hover:underline">
                  Resend Verification
                </button>
              )}
            </div>
          </div>
        </section>

        {/* E. Privacy & Security */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-6">
          <h2 className="text-xl font-bold text-dark-green dark:text-green-400 mb-4 flex items-center gap-2">
            <Shield size={24} /> Privacy & Security
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600">
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Authentication Method</p>
              <p className="font-semibold text-gray-800 dark:text-gray-200 capitalize">
                {currentUser?.providerData[0]?.providerId.replace('.com', '') || 'Password'}
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600">
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Last Login</p>
              <p className="font-semibold text-gray-800 dark:text-gray-200">
                {currentUser?.metadata?.lastSignInTime ? new Date(currentUser.metadata.lastSignInTime).toLocaleDateString() : 'Today'}
              </p>
            </div>
          </div>
        </section>

        {/* Save Settings Button */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 pb-6">
          <button onClick={handleSave} className="btn-primary w-full sm:w-auto text-lg px-8 justify-center">
            <Save size={24} /> Save Preferences
          </button>
          
          {showSaved && (
            <span className="text-primary-green font-bold flex items-center gap-2 animate-fade-in">
              Preferences saved successfully
            </span>
          )}
        </div>

        {/* F. Danger Zone */}
        <section className="bg-red-50 dark:bg-red-900/10 rounded-2xl border-2 border-red-200 dark:border-red-900/30 p-6">
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
            <AlertTriangle size={24} /> Danger Zone
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            These actions are permanent and cannot be undone. Please proceed with caution.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleLogout}
              className="px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut size={20} /> Logout
            </button>

            {!deleteConfirm ? (
              <button 
                onClick={() => setDeleteConfirm(true)}
                className="px-6 py-3 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 font-bold rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
              >
                Delete Account
              </button>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-red-100 dark:bg-red-900/40 rounded-xl">
                <span className="text-red-800 dark:text-red-300 font-medium text-sm">Are you sure?</span>
                <button 
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors text-sm"
                >
                  {loading ? 'Deleting...' : 'Yes, Delete'}
                </button>
                <button 
                  onClick={() => setDeleteConfirm(false)}
                  disabled={loading}
                  className="px-4 py-2 bg-white text-gray-700 font-bold rounded-lg transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
};

export default SettingsPage;
