import axios from 'axios';
import { IField } from '../models/Field';

const STAC_BASE = 'https://stac.dataspace.copernicus.eu/v1';
const TOKEN_URL = 'https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token';

let cachedToken: string | null = null;
let tokenExpiry: Date | null = null;

const getCopernicusToken = async (): Promise<string | null> => {
  const clientId = process.env.COPERNICUS_CLIENT_ID;
  const clientSecret = process.env.COPERNICUS_CLIENT_SECRET;
  const username = process.env.COPERNICUS_USERNAME;
  const password = process.env.COPERNICUS_PASSWORD;

  if (!clientId && !username) {
    console.warn('[Satellite] Copernicus credentials not configured. Searching as public.');
    return null;
  }

  if (cachedToken && tokenExpiry && new Date() < tokenExpiry) {
    return cachedToken;
  }

  let params: URLSearchParams;

  // Use email/password if provided (Bypasses the need for the 503 Developer Dashboard)
  if (username && password) {
    params = new URLSearchParams({
      grant_type: 'password',
      client_id: 'cdse-public',
      username: username,
      password: password,
    });
  } 
  // Fallback to client_credentials if using OAuth client
  else if (clientId && clientSecret) {
    params = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    });
  } else {
    return null;
  }

  const { data } = await axios.post(TOKEN_URL, params.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    timeout: 15000,
  });

  cachedToken = data.access_token as string;
  tokenExpiry = new Date(Date.now() + (data.expires_in as number) * 1000 - 30000);
  return cachedToken;
};

export interface SatelliteSearchParams {
  field: IField;
  dateFrom: string;
  dateTo: string;
  maxCloudCover: number;
}

export interface SatelliteProduct {
  productId: string;
  date: string;
  cloudCover: number;
  collection: string;
  bbox: number[];
  downloadUrl?: string;
  quicklookUrl?: string;
  assets?: Record<string, { href: string; type: string }>;
}

export const searchSentinel2 = async (
  params: SatelliteSearchParams
): Promise<SatelliteProduct[]> => {
  const { field, dateFrom, dateTo, maxCloudCover } = params;
  const geometry = field.geoJsonPolygon;

  const body = {
    collections: ['SENTINEL-2'],
    datetime: `${dateFrom}T00:00:00Z/${dateTo}T23:59:59Z`,
    intersects: geometry,
    query: {
      'eo:cloud_cover': { lte: maxCloudCover },
      'processing:level': { eq: 'L2A' },
    },
    fields: {
      include: [
        'id', 'datetime', 'eo:cloud_cover', 'collection', 'assets', 'bbox',
        'properties.datetime', 'properties.eo:cloud_cover',
      ],
    },
    sortby: [{ field: 'eo:cloud_cover', direction: 'asc' }],
    limit: 10,
  };

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = await getCopernicusToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const { data } = await axios.post(`${STAC_BASE}/search`, body, { headers, timeout: 30000 });
    const features = data.features || [];

    return features.map((f: Record<string, unknown>) => {
      const props = f.properties as Record<string, unknown>;
      return {
        productId: f.id as string,
        date: props['datetime'] as string,
        cloudCover: (props['eo:cloud_cover'] as number) ?? 0,
        collection: 'Sentinel-2 Level-2A',
        bbox: f.bbox as number[],
        assets: f.assets as Record<string, { href: string; type: string }>,
        quicklookUrl: (f.assets as Record<string, Record<string, string>>)?.['thumbnail']?.href || undefined,
      };
    });
  } catch (err) {
    console.error('[Satellite] STAC search error:', err);
    throw new Error('Failed to query satellite imagery. Please try again later.');
  }
};

export const getBestImage = async (
  params: SatelliteSearchParams
): Promise<SatelliteProduct | null> => {
  const results = await searchSentinel2(params);
  if (results.length === 0) return null;
  // Results are sorted by cloud cover asc; pick the first (clearest)
  return results[0];
};
