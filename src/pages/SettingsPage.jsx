import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../context/SettingsContext';
import { Settings, Volume2, Bell, Type, Eye, Save, Globe } from 'lucide-react';
import { LanguageSelector } from '../components/ui/LanguageSelector';

const SettingsPage = () => {
  const { t } = useTranslation();
  const { settings, updateSetting } = useSettings();
  const [showSaved, setShowSaved] = React.useState(false);

  const handleSave = () => {
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  const Toggle = ({ label, checked, onChange }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
      <span className="font-medium text-gray-800">{label}</span>
      <button 
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
          checked ? 'bg-primary-green' : 'bg-gray-300'
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
        <div className="bg-dark-green p-3 rounded-xl text-white">
          <Settings size={28} />
        </div>
        <h1 className="text-3xl font-bold text-dark-green">{t('settings.title')}</h1>
      </div>

      <div className="space-y-6">
        
        {/* Language */}
        <section className="card p-6">
          <h2 className="text-xl font-bold text-dark-green mb-4 flex items-center gap-2">
            <Globe size={24} /> {t('settings.language')}
          </h2>
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center">
            <span className="font-medium text-gray-800">{t('settings.currentLanguage')}</span>
            <div className="bg-dark-green rounded-lg">
              <LanguageSelector />
            </div>
          </div>
        </section>

        {/* Voice */}
        <section className="card p-6">
          <h2 className="text-xl font-bold text-dark-green mb-4 flex items-center gap-2">
            <Volume2 size={24} /> {t('settings.voice')}
          </h2>
          <div className="space-y-3">
            <Toggle 
              label={t('settings.voiceOutput')} 
              checked={settings.voiceOutput} 
              onChange={(v) => updateSetting('voiceOutput', v)} 
            />
            <Toggle 
              label={t('settings.autoRead')} 
              checked={settings.autoRead} 
              onChange={(v) => updateSetting('autoRead', v)} 
            />
            
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <label className="block font-medium text-gray-800 mb-3">{t('settings.speechSpeed')}</label>
              <div className="flex gap-2">
                {['slow', 'normal', 'fast'].map(speed => (
                  <button 
                    key={speed}
                    onClick={() => updateSetting('speechSpeed', speed)}
                    className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                      settings.speechSpeed === speed 
                        ? 'bg-primary-green text-white' 
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {t(`settings.${speed}`)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="card p-6">
          <h2 className="text-xl font-bold text-dark-green mb-4 flex items-center gap-2">
            <Bell size={24} /> {t('settings.notifications')}
          </h2>
          <div className="space-y-3">
            <Toggle 
              label={t('settings.weatherAlerts')} 
              checked={settings.weatherAlerts} 
              onChange={(v) => updateSetting('weatherAlerts', v)} 
            />
            <Toggle 
              label={t('settings.cropAlerts')} 
              checked={settings.cropAlerts} 
              onChange={(v) => updateSetting('cropAlerts', v)} 
            />
            <Toggle 
              label={t('settings.diseaseAlerts')} 
              checked={settings.diseaseAlerts} 
              onChange={(v) => updateSetting('diseaseAlerts', v)} 
            />
          </div>
        </section>

        {/* Accessibility */}
        <section className="card p-6">
          <h2 className="text-xl font-bold text-dark-green mb-4 flex items-center gap-2">
            <Eye size={24} /> {t('settings.accessibility')}
          </h2>
          <div className="space-y-3">
            <Toggle 
              label={t('settings.simpleMode')} 
              checked={settings.simpleMode} 
              onChange={(v) => updateSetting('simpleMode', v)} 
            />
            <Toggle 
              label={t('settings.largeText')} 
              checked={settings.largeText} 
              onChange={(v) => updateSetting('largeText', v)} 
            />
            <Toggle 
              label={t('settings.highContrast')} 
              checked={settings.highContrast} 
              onChange={(v) => updateSetting('highContrast', v)} 
            />
          </div>
        </section>

        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
          <button onClick={handleSave} className="btn-primary w-full sm:w-auto text-lg flex-1 justify-center">
            <Save size={24} /> {t('settings.saveSettings')}
          </button>
          
          {showSaved && (
            <span className="text-primary-green font-bold flex items-center gap-2 animate-fade-in">
              {t('settings.saved')}
            </span>
          )}
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;
