import React, { createContext, useContext, useState } from 'react';

const LocationContext = createContext();

export const useLocation = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
  const [locationState, setLocationState] = useState({
    mode: null, // 'current' | 'manual'
    lat: null,
    lon: null,
    village: '',
    district: '',
    state: '',
    country: '',
    accuracy: null,
    displayString: '',
  });
  
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState('');
  const [permissionDenied, setPermissionDenied] = useState(false);

  const detectCurrentLocation = () => {
    // Clear previous result and set loading
    setLocationState({
      mode: null,
      lat: null,
      lon: null,
      village: '',
      district: '',
      state: '',
      country: '',
      accuracy: null,
      displayString: 'Detecting current location...'
    });
    
    setGeoLoading(true);
    setGeoError('');
    setPermissionDenied(false);
    
    if (!navigator.geolocation) {
      setGeoError('Your browser does not support location services.');
      setGeoLoading(false);
      setLocationState(prev => ({ ...prev, displayString: '' }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        
        try {
          const geoKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
          let village = '';
          let district = '';
          let state = '';
          let country = '';
          let display = '';
          
          if (geoKey) {
            const r = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${geoKey}`);
            if (r.ok) {
              const d = await r.json();
              const props = (d.features && d.features[0]?.properties) || {};
              
              village = props.suburb || props.neighbourhood || props.hamlet || props.village || props.town || props.city || '';
              district = props.county || props.state_district || '';
              state = props.state || '';
              country = props.country || '';
              
              const parts = [village, district, state].filter(Boolean);
              display = parts.length > 0 ? parts.join(', ') : `${latitude}, ${longitude}`;
            } else {
              display = `${latitude}, ${longitude}`;
            }
          } else {
             display = `${latitude}, ${longitude}`;
          }

          setLocationState({
            mode: 'current',
            lat: latitude,
            lon: longitude,
            village,
            district,
            state,
            country,
            accuracy: Math.round(accuracy),
            displayString: display
          });
          
          if (accuracy > 1000) {
            setGeoError('Location accuracy is low. Please move to an open area and try again.');
          }
          
        } catch (err) {
          setLocationState({
            mode: 'current',
            lat: latitude,
            lon: longitude,
            village: '', district: '', state: '', country: '',
            accuracy: Math.round(accuracy),
            displayString: `${latitude}, ${longitude}`
          });
          setGeoError('Reverse geocoding failed. Using raw coordinates.');
        }
        setGeoLoading(false);
      },
      (err) => {
        let msg = 'Unable to determine your current location. Please try again.';
        if (err.code === 1) {
          msg = 'Location permission is required to detect your current location.';
          setPermissionDenied(true);
        } else if (err.code === 2) {
          msg = 'Please enable location services on your device/browser.';
        } else if (err.code === 3) {
          msg = 'Location request timed out. Please try again.';
        }
        setGeoError(msg);
        setGeoLoading(false);
        setLocationState(prev => ({ ...prev, displayString: '' }));
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  };

  const setManualLocation = (lat, lon, displayString) => {
    setLocationState({
      mode: 'manual',
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      village: '',
      district: '',
      state: '',
      country: '',
      accuracy: null,
      displayString
    });
    setGeoError('');
    setPermissionDenied(false);
  };

  return (
    <LocationContext.Provider value={{ locationState, geoLoading, geoError, permissionDenied, detectCurrentLocation, setManualLocation }}>
      {children}
    </LocationContext.Provider>
  );
};
