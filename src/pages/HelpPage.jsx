import React from 'react';
import { useTranslation } from 'react-i18next';
import { HelpCircle, FileText, Phone } from 'lucide-react';

const HelpPage = () => {
  const { t } = useTranslation();

  const faqs = [
    { q: t('help.howToField'), a: "Go to Field Analysis page, search your location, and click on the map to draw your field boundary." },
    { q: t('help.howToDisease'), a: "Go to Disease Detection page and upload a clear photo of your affected crop leaf." },
    { q: t('help.howToWeather'), a: "Check the Weather page for current conditions and a 7-day forecast for your location." },
    { q: t('help.howToCrop'), a: "Use the Crop Advisor, enter your land details like soil type and water availability to get the best suggestions." }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold text-dark-green mb-8 flex items-center gap-3">
        <HelpCircle className="text-primary-green" size={36} />
        {t('help.title')}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FileText size={24} className="text-primary-green" /> {t('help.faq')}
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="card p-5 bg-white border border-gray-100">
                <h3 className="font-bold text-lg text-dark-green mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="md:col-span-1">
          <div className="card p-6 bg-light-green border border-green-200 sticky top-24">
            <h2 className="text-xl font-bold text-dark-green mb-4 flex items-center gap-2">
              <Phone size={24} /> {t('help.contact')}
            </h2>
            <p className="text-gray-700 mb-6">Need more help? Contact our support team for assistance.</p>
            
            <div className="space-y-4">
              <a href="tel:18001234567" className="btn-secondary w-full justify-center">
                Call 1800-123-4567
              </a>
              <a href="mailto:support@smartfarmer.ai" className="btn-secondary w-full justify-center">
                Email Support
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HelpPage;
