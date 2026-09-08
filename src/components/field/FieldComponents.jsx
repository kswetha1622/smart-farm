import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, useMap, FeatureGroup } from 'react-leaflet';
import { Edit3, X, Check, MapPin, Navigation, Info, Loader2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import L from 'leaflet';

// Fix leaflet default icon paths broken by bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const GEOAPIFY_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;
const DEFAULT_CENTER = [20.5937, 78.9629]; // Center of India

// ─── Geoapify Reverse Geocoding ───────────────────────────────────────────────
const reverseGeocodeGeoapify = async (lat, lng) => {
  const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${GEOAPIFY_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.features || data.features.length === 0) return null;

  const props = data.features[0].properties;
  return {
    village: props.suburb || props.neighbourhood || props.hamlet || props.village || props.town || '',
    town: props.city || props.town || props.county || '',
    district: props.county || props.state_district || '',
    state: props.state || '',
    country: props.country || '',
    lat: lat.toFixed(6),
    lng: lng.toFixed(6),
  };
};

// ─── Geoapify Place Search ────────────────────────────────────────────────────
const searchPlaces = async (query) => {
  if (!query || query.length < 3) return [];
  const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&filter=countrycode:in&apiKey=${GEOAPIFY_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.features || [];
};

// ─── Map Initialiser: centres on user + attaches Geoman ──────────────────────
const MapSetup = ({ isDrawing, onPolygonCreated }) => {
  const map = useMap();

  // Centre on user on first load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => map.setView([pos.coords.latitude, pos.coords.longitude], 16),
        () => {}
      );
    }
  }, [map]);

  // Load Geoman and wire up draw events
  useEffect(() => {
    import('@geoman-io/leaflet-geoman-free').then(() => {
      if (!map.pm) return;

      map.pm.setGlobalOptions({
        snappable: true,
        snapDistance: 20,
        pathOptions: {
          color: '#16a34a',
          fillColor: '#22c55e',
          fillOpacity: 0.35,
          weight: 3,
        },
      });

      map.on('pm:create', (e) => {
        const layer = e.layer;
        if (layer instanceof L.Polygon) {
          const latlngs = layer.getLatLngs()[0];
          onPolygonCreated(latlngs, layer);
        }
      });
    });

    return () => {
      map.pm?.disableDraw();
      map.off('pm:create');
    };
  }, [map, onPolygonCreated]);

  // Toggle draw mode when isDrawing changes
  useEffect(() => {
    import('@geoman-io/leaflet-geoman-free').then(() => {
      if (!map.pm) return;
      if (isDrawing) {
        map.pm.enableDraw('Polygon');
      } else {
        map.pm.disableDraw();
      }
    });
  }, [isDrawing, map]);

  return null;
};

// ─── Main Component ────────────────────────────────────────────────────────────
export const FieldPolygonSelector = ({ onSelectComplete }) => {
  const { t } = useTranslation();
  const featureGroupRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [areaAcres, setAreaAcres] = useState(null);
  const [locationDetails, setLocationDetails] = useState(null);
  const [geocoding, setGeocoding] = useState(false);
  const [drawnLayer, setDrawnLayer] = useState(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState(5);
  const mapRef = useRef(null);
  const searchTimeout = useRef(null);

  // ── Search handler ──
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
    setSearchQuery(feature.properties.formatted);
    setShowDropdown(false);
    if (mapRef.current) {
      mapRef.current.setView([lat, lon], 15);
    }
  };

  // ── Locate me ──
  const locateMe = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (mapRef.current) {
          mapRef.current.setView([pos.coords.latitude, pos.coords.longitude], 17);
        }
        setIsLocating(false);
      },
      () => {
        alert('Could not get your location. Please allow location access.');
        setIsLocating(false);
      }
    );
  };

  // ── Polygon created callback ──
  const onPolygonCreated = useCallback(async (latlngs, layer) => {
    setIsDrawing(false);

    // Compute centroid
    const latSum = latlngs.reduce((s, p) => s + p.lat, 0);
    const lngSum = latlngs.reduce((s, p) => s + p.lng, 0);
    const centLat = latSum / latlngs.length;
    const centLng = lngSum / latlngs.length;

    // Compute area using Leaflet's geometry (Shoelace + Earth radius)
    const polygon = L.polygon(latlngs);
    const areaSqMeters = L.GeometryUtil
      ? L.GeometryUtil.geodesicArea(latlngs)
      : computeAreaApprox(latlngs);
    const acres = (areaSqMeters / 4046.8564224).toFixed(2);

    setAreaAcres(acres);
    setDrawnLayer(layer);

    // Reverse geocode
    setGeocoding(true);
    try {
      const loc = await reverseGeocodeGeoapify(centLat, centLng);
      setLocationDetails(loc || {
        village: '', town: '', district: '', state: '', country: '',
        lat: centLat.toFixed(6), lng: centLng.toFixed(6)
      });
    } catch {
      setLocationDetails({
        village: '', town: '', district: '', state: '', country: '',
        lat: centLat.toFixed(6), lng: centLng.toFixed(6)
      });
    }
    setGeocoding(false);
  }, []);

  // Fallback area calc using Shoelace formula
  const computeAreaApprox = (latlngs) => {
    const R = 6371000;
    let area = 0;
    const n = latlngs.length;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      const xi = (latlngs[i].lng * Math.PI) / 180;
      const yi = (latlngs[i].lat * Math.PI) / 180;
      const xj = (latlngs[j].lng * Math.PI) / 180;
      const yj = (latlngs[j].lat * Math.PI) / 180;
      area += xi * Math.sin(yj) - xj * Math.sin(yi);
    }
    return Math.abs((area * R * R) / 2);
  };

  // ── Clear drawing ──
  const clearDrawing = () => {
    if (drawnLayer && mapRef.current) {
      mapRef.current.removeLayer(drawnLayer);
    }
    if (featureGroupRef.current) {
      featureGroupRef.current.clearLayers();
    }
    setDrawnLayer(null);
    setAreaAcres(null);
    setLocationDetails(null);
    setIsDrawing(false);
  };

  // ── Confirm field ──
  const confirmField = () => {
    if (!drawnLayer || !locationDetails) return;
    const latlngs = drawnLayer.getLatLngs()[0];
    const points = latlngs.map(p => ({ lat: p.lat, lng: p.lng }));
    onSelectComplete({
      name: fieldName || 'My Field',
      coordinates: points,
      areaAcres: parseFloat(areaAcres),
      location: locationDetails,
      centroid: { lat: locationDetails.lat, lng: locationDetails.lng },
    });
  };

  return (
    <div className="card p-2 md:p-4 mb-8">
      {/* Field Name */}
      <div className="px-2 mb-3">
        <input
          type="text"
          placeholder="Field Name (e.g. North Rice Field)"
          value={fieldName}
          onChange={(e) => setFieldName(e.target.value)}
          className="input-field"
        />
      </div>

      {/* Search + Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 px-2">
        <div className="flex gap-2 flex-1 min-w-[220px] relative">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              placeholder="Search village, district, state..."
              className="input-field pl-10 pr-2"
            />
            <MapPin className="absolute left-3 top-3.5 text-gray-400" size={18} />
            {searchLoading && (
              <Loader2 className="absolute right-3 top-3.5 text-gray-400 animate-spin" size={16} />
            )}

            {/* Dropdown */}
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-[9999] max-h-56 overflow-y-auto mt-1">
                {searchResults.map((f, i) => (
                  <button
                    key={i}
                    onMouseDown={() => handleSelectPlace(f)}
                    className="w-full text-left px-4 py-2.5 hover:bg-light-green/30 text-sm text-gray-700 border-b border-gray-100 last:border-0 flex items-center gap-2"
                  >
                    <MapPin size={14} className="text-primary-green shrink-0" />
                    <span className="truncate">{f.properties.formatted}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button onClick={locateMe} title="Use my location" className="btn-secondary py-2 px-3 text-sm">
            {isLocating ? <Loader2 size={18} className="animate-spin" /> : <Navigation size={18} />}
          </button>
        </div>

        {/* Drawing Actions */}
        <div className="flex gap-2 flex-wrap">
          {!isDrawing && !drawnLayer && (
            <button onClick={() => setIsDrawing(true)} className="btn-primary py-2 text-sm">
              <Edit3 size={16} /> Draw Field
            </button>
          )}
          {(isDrawing || drawnLayer) && (
            <button onClick={clearDrawing} className="btn-secondary py-2 text-sm text-red-600 border-red-300">
              <X size={16} /> Clear
            </button>
          )}
          {!isDrawing && drawnLayer && locationDetails && !geocoding && (
            <button onClick={confirmField} className="btn-primary py-2 text-sm">
              <Check size={16} /> Confirm Field
            </button>
          )}
          {!isDrawing && drawnLayer && geocoding && (
            <button disabled className="btn-secondary py-2 text-sm opacity-70">
              <Loader2 size={16} className="animate-spin" /> Analyzing...
            </button>
          )}
        </div>
      </div>

      {/* Instruction Banner */}
      {isDrawing && (
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg mb-3 text-sm flex items-center gap-2 border border-blue-200">
          <Edit3 size={16} />
          Click on the map to trace your field boundary. Double-click to finish the polygon.
        </div>
      )}

      {/* Area Display */}
      {areaAcres && !isDrawing && (
        <div className="bg-green-50 text-green-800 px-4 py-2 rounded-lg mb-3 text-sm flex items-center justify-between border border-green-200 font-semibold">
          <div className="flex items-center gap-2">
            <Info size={16} />
            Field Area: <span className="text-lg font-bold text-primary-green">{areaAcres} acres</span>
          </div>
          {locationDetails && (
            <div className="text-xs text-green-700">
              {locationDetails.village || locationDetails.town || ''}{locationDetails.district ? `, ${locationDetails.district}` : ''}
            </div>
          )}
        </div>
      )}

      {/* Map Container */}
      <div className="w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm relative h-[460px]" style={{ zIndex: 0 }}>
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={5}
          style={{ width: '100%', height: '100%' }}
          ref={mapRef}
        >
          {/* Geoapify Satellite / Hybrid Tiles */}
          <TileLayer
            url={`https://maps.geoapify.com/v1/tile/satellite/{z}/{x}/{y}.png?apiKey=${GEOAPIFY_KEY}`}
            attribution='Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
            maxZoom={20}
          />
          {/* Overlay roads/labels on top of satellite */}
          <TileLayer
            url={`https://maps.geoapify.com/v1/tile/osm-bright-grey/{z}/{x}/{y}.png?apiKey=${GEOAPIFY_KEY}`}
            opacity={0.4}
            maxZoom={20}
          />

          <FeatureGroup ref={featureGroupRef}>
            <MapSetup isDrawing={isDrawing} onPolygonCreated={onPolygonCreated} />
          </FeatureGroup>
        </MapContainer>
      </div>

      {/* Powered by badge */}
      <div className="flex justify-end mt-2 pr-1">
        <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
          📍 Maps &amp; Geocoding powered by <a href="https://www.geoapify.com" target="_blank" rel="noopener noreferrer" className="text-primary-green underline-offset-2 hover:underline">Geoapify</a>
        </span>
      </div>
    </div>
  );
};
