import React from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';

export const LoadingState = ({ messageKey = 'common.loading' }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <Loader2 size={48} className="text-primary-green animate-spin mb-4" />
      <p className="text-lg font-medium text-gray-600">{t(messageKey)}</p>
    </div>
  );
};

export const EmptyState = ({ icon: Icon, titleKey, descKey, action }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-gray-400 mb-4 shadow-sm">
        <Icon size={40} />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{t(titleKey)}</h3>
      {descKey && <p className="text-gray-500 mb-6 max-w-md">{t(descKey)}</p>}
      {action && action}
    </div>
  );
};
