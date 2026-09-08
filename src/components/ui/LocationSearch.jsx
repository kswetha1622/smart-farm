import React, { useState, useRef } from 'react';
import { useLocation } from '../../context/LocationContext';
import { MapPin, Loader2, Search } from 'lucide-react';

export const LocationSearch = ({ className = "" }) => {
  const { setManualLocation } = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchTimeout = useRef(null);

  const searchPlaces = async (query) => {
    if (!query || query.length < 3) return [];
    const geoKey = import.meta.env.VITE_GEOAPIFY_API_KEY;
    if (!geoKey) return [];
    
    const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&apiKey=${geoKey}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      return data.features || [];
    } catch (e) {
      return [];
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    setShowDropdown(false);
    clearTimeout(searchTimeout.current);
    if (val.length < 3) { setSearchResults([]); return; }
    
    searchTimeout.current = setTimeout(async () => {
      setSearchLoading(true);
      const results = await searchPlaces(val);
      setSearchResults(results);
      setShowDropdown(results.length > 0);
      setSearchLoading(false);
    }, 400);
  };

  const handleSelectPlace = (feature) => {
    const [lon, lat] = feature.geometry.coordinates;
    const name = feature.properties.formatted;
    setSearchQuery('');
    setShowDropdown(false);
    // Update global location context manually
    setManualLocation(lat, lon, name);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          placeholder="Search for a location..."
          className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-10 shadow-sm focus:ring-2 focus:ring-primary-green focus:border-transparent outline-none transition-all text-gray-800"
        />
        <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
        {searchLoading && (
          <Loader2 className="absolute right-3 top-3.5 text-primary-green animate-spin" size={18} />
        )}
      </div>

      {showDropdown && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto mt-2 py-1">
          {searchResults.map((f, i) => (
            <button
              key={i}
              onMouseDown={() => handleSelectPlace(f)}
              className="w-full text-left px-4 py-3 hover:bg-green-50 text-sm text-gray-700 border-b border-gray-100 last:border-0 flex items-start gap-3 transition-colors"
            >
              <MapPin size={16} className="text-primary-green shrink-0 mt-0.5" />
              <span className="leading-tight">{f.properties.formatted}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
