// Geometry utilities using pure math — no external geo library needed for polygon area

export interface Coordinate {
  lat: number;
  lng: number;
}

/**
 * Calculates the area of a polygon given lat/lng coordinates using the
 * Shoelace formula adapted for geographic coordinates (spherical earth).
 * Returns area in square meters.
 */
export const calculatePolygonArea = (coordinates: Coordinate[]): number => {
  if (coordinates.length < 3) return 0;
  const EARTH_RADIUS_M = 6378137; // meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  let area = 0;
  const n = coordinates.length;

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const xi = toRad(coordinates[i].lng) * EARTH_RADIUS_M * Math.cos(toRad(coordinates[i].lat));
    const yi = toRad(coordinates[i].lat) * EARTH_RADIUS_M;
    const xj = toRad(coordinates[j].lng) * EARTH_RADIUS_M * Math.cos(toRad(coordinates[j].lat));
    const yj = toRad(coordinates[j].lat) * EARTH_RADIUS_M;
    area += xi * yj - xj * yi;
  }

  return Math.abs(area / 2);
};

export const squareMetersToAcres = (sqm: number): number => sqm / 4046.8564224;

/**
 * Calculates the centroid (geometric center) of a polygon.
 */
export const calculateCentroid = (coordinates: Coordinate[]): Coordinate => {
  const n = coordinates.length;
  const lat = coordinates.reduce((sum, c) => sum + c.lat, 0) / n;
  const lng = coordinates.reduce((sum, c) => sum + c.lng, 0) / n;
  return { lat, lng };
};

/**
 * Converts our coordinate array to GeoJSON Polygon format.
 * GeoJSON uses [lng, lat] order and the polygon must close (first = last point).
 */
export const toGeoJSONPolygon = (coordinates: Coordinate[]) => {
  const ring = coordinates.map((c) => [c.lng, c.lat]);
  // Close the ring
  ring.push(ring[0]);
  return {
    type: 'Polygon' as const,
    coordinates: [ring],
  };
};

/**
 * Validates that coordinates form a sensible polygon.
 */
export const validatePolygon = (coordinates: Coordinate[]): { valid: boolean; reason?: string } => {
  if (!Array.isArray(coordinates) || coordinates.length < 3) {
    return { valid: false, reason: 'A polygon requires at least 3 coordinates.' };
  }
  for (const coord of coordinates) {
    if (typeof coord.lat !== 'number' || typeof coord.lng !== 'number') {
      return { valid: false, reason: 'Each coordinate must have numeric lat and lng.' };
    }
    if (coord.lat < -90 || coord.lat > 90 || coord.lng < -180 || coord.lng > 180) {
      return { valid: false, reason: 'Coordinate values are out of valid range.' };
    }
  }
  const area = calculatePolygonArea(coordinates);
  if (area < 100) {
    return { valid: false, reason: 'Field area is too small to be a valid field.' };
  }
  return { valid: true };
};
