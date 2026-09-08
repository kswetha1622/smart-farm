import React from 'react';
import { useLocation } from '../../context/LocationContext';
import { MapPin, Loader2, CheckCircle, XCircle, RefreshCw, Navigation } from 'lucide-react';

export const LocationButton = ({ className = "" }) => {
  const { geoLoading, geoError, permissionDenied, locationState, detectCurrentLocation } = useLocation();
  const { lat, lon, mode } = locationState;
  
  const isFound = lat && lon && mode === 'current' && !geoError;

  let icon = <Navigation size={18} />;
  let text = "Use Current Location";
  let bgClass = "bg-primary-green hover:bg-dark-green text-white";

  if (geoLoading) {
    icon = <Loader2 size={18} className="animate-spin" />;
    text = "Detecting Location...";
    bgClass = "bg-gray-100 text-gray-500 cursor-not-allowed";
  } else if (permissionDenied) {
    icon = <XCircle size={18} />;
    text = "Location Permission Denied";
    bgClass = "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100";
  } else if (geoError) {
    icon = <RefreshCw size={18} />;
    text = "Try Again";
    bgClass = "bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100";
  } else if (isFound) {
    icon = <CheckCircle size={18} />;
    text = "Location Found";
    bgClass = "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100";
  }

  const baseClasses = "px-4 py-2 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-sm whitespace-nowrap";

  return (
    <button 
      type="button"
      onClick={detectCurrentLocation}
      disabled={geoLoading}
      className={`${baseClasses} ${bgClass} ${className}`}
      title={geoError || "Use browser GPS to find current location"}
    >
      {icon}
      {text}
    </button>
  );
};
