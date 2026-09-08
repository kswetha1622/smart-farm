import React from 'react';
import { useTranslation } from 'react-i18next';
import { Leaf, Droplets, Thermometer, Calendar, Info, Beaker } from 'lucide-react';
import { ListenButton } from '../ui/ListenButton';

export const CropCard = ({ crop }) => {
  const { t } = useTranslation();
  
  // Format soil, season, water for display
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1).replace('_', ' ');

  const listenText = `${crop.cropName}. ${crop.description} Requires ${crop.waterRequirement} water. Sowing period is ${crop.sowingPeriod}.`;

  return (
    <div className="card overflow-hidden p-0 flex flex-col h-full hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="h-56 overflow-hidden relative group">
        <img src={crop.image} alt={crop.cropName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm text-sm font-bold text-dark-green">
          {capitalize(crop.season)} Crop
        </div>
      </div>
      
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-2xl font-extrabold text-dark-green mb-2">{crop.cropName}</h3>
        <p className="text-gray-600 mb-6 text-sm leading-relaxed">{crop.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-6 flex-grow">
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-start gap-3">
            <Droplets className="text-blue-500 mt-0.5" size={18} />
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-0.5">Water Req.</p>
              <p className="text-sm font-bold text-gray-800">{crop.waterRequirement}</p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-start gap-3">
            <Calendar className="text-orange-500 mt-0.5" size={18} />
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-0.5">Sowing</p>
              <p className="text-sm font-bold text-gray-800">{crop.sowingPeriod}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-start gap-3">
            <Leaf className="text-primary-green mt-0.5" size={18} />
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-0.5">Duration</p>
              <p className="text-sm font-bold text-gray-800">{crop.growingDuration}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-start gap-3">
            <Thermometer className="text-red-500 mt-0.5" size={18} />
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-0.5">Temperature</p>
              <p className="text-sm font-bold text-gray-800">{crop.temperature}</p>
            </div>
          </div>
          
          <div className="col-span-2 bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-start gap-3">
            <Beaker className="text-purple-500 mt-0.5 shrink-0" size={18} />
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-0.5">Fertilizer</p>
              <p className="text-sm font-bold text-gray-800">{crop.fertilizer}</p>
            </div>
          </div>
        </div>

        <div className="bg-light-green/30 p-4 rounded-xl flex items-start gap-3 mb-5 border border-primary-green/20">
          <Info size={20} className="text-primary-green shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-primary-green font-bold uppercase tracking-wider mb-1">Crop Care</p>
            <p className="text-sm text-dark-green font-medium">{crop.cropCare}</p>
          </div>
        </div>

        <ListenButton text={listenText} className="w-full justify-center bg-gray-50 hover:bg-gray-100 text-gray-700" />
      </div>
    </div>
  );
};
