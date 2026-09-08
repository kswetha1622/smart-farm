import axios from 'axios';

// Land cover classes from ESRI Sentinel-2 Land Cover
const LAND_COVER_CLASSES: Record<string, { type: string; isCrop: boolean; reason?: string }> = {
  '1': { type: 'Water Body', isCrop: false, reason: 'The selected area is predominantly water and no agricultural crop area was detected.' },
  '2': { type: 'Trees/Forest', isCrop: false, reason: 'The selected area is predominantly forested and no agricultural crop area was detected.' },
  '3': { type: 'Grassland', isCrop: false, reason: 'The selected area is grassland and no active agricultural crop area was detected.' },
  '4': { type: 'Flooded Vegetation', isCrop: false, reason: 'The selected area is flooded vegetation/wetland.' },
  '5': { type: 'Agricultural Land', isCrop: true },
  '6': { type: 'Scrub/Shrub', isCrop: false, reason: 'The selected area is scrub/shrub land and not an agricultural crop.' },
  '7': { type: 'Built-up/Urban Area', isCrop: false, reason: 'No significant agricultural crop area was detected. The area is predominantly built-up/urban.' },
  '8': { type: 'Bare Soil', isCrop: false, reason: 'The selected area is predominantly bare soil and no active crops were detected.' },
  '9': { type: 'Snow/Ice', isCrop: false, reason: 'The selected area is covered by snow/ice.' },
  '10': { type: 'Clouds', isCrop: false, reason: 'The land cover classification was obscured by clouds.' },
};

const getLandCover = async (lat: number, lon: number) => {
  try {
    const url = `https://ic.imagery1.arcgis.com/arcgis/rest/services/Sentinel2_10m_LandCover/ImageServer/identify?geometry=%7B%22x%22%3A${lon}%2C%22y%22%3A${lat}%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D&geometryType=esriGeometryPoint&f=json`;
    const { data } = await axios.get(url, { timeout: 10000 });
    if (data && data.value) {
      return LAND_COVER_CLASSES[data.value] || null;
    }
    return null;
  } catch (error) {
    console.error('[LandCover] ESRI API error:', error instanceof Error ? error.message : String(error));
    return null;
  }
};

export const analyzeCropDamageSTAC = async (lat: number, lon: number, beforeDate: string, afterDate: string, maxCloudCover: number) => {
  // Step 1: Detect Land Cover First
  const landCover = await getLandCover(lat, lon);
  
  if (landCover && !landCover.isCrop) {
    // Return early without calculating damage, strictly per requirements
    return {
      isCrop: false,
      locationType: landCover.type,
      reason: landCover.reason,
    };
  }

  // Step 2: Proceed with satellite data retrieval for Crops
  const STAC_URL = 'https://earth-search.aws.element84.com/v1/search';
  const toleranceDays = 45;
  const bDate = new Date(beforeDate);
  const bStart = new Date(bDate.getTime() - toleranceDays * 24 * 60 * 60 * 1000).toISOString();
  const bEnd = new Date(bDate.getTime() + toleranceDays * 24 * 60 * 60 * 1000).toISOString();
  
  const aDate = new Date(afterDate);
  const aStart = new Date(aDate.getTime() - toleranceDays * 24 * 60 * 60 * 1000).toISOString();
  const aEnd = new Date(aDate.getTime() + toleranceDays * 24 * 60 * 60 * 1000).toISOString();

  const fetchImage = async (start: string, end: string, targetDate: Date) => {
    const body = {
      collections: ['sentinel-2-l2a'],
      intersects: { type: 'Point', coordinates: [lon, lat] },
      datetime: `${start}/${end}`,
      query: { 'eo:cloud_cover': { lte: maxCloudCover } },
      limit: 50
    };
    
    try {
      const { data } = await axios.post(STAC_URL, body, { timeout: 15000 });
      if (data.features && data.features.length > 0) {
        const sorted = data.features.sort((f1: any, f2: any) => {
          const t1 = Math.abs(new Date(f1.properties.datetime).getTime() - targetDate.getTime());
          const t2 = Math.abs(new Date(f2.properties.datetime).getTime() - targetDate.getTime());
          return t1 - t2;
        });
        const validFeatures = sorted.filter((f: any) => f.properties['s2:vegetation_percentage'] !== undefined);
        return validFeatures.length > 0 ? validFeatures[0] : sorted[0];
      }
      return null;
    } catch (err) {
      console.error('[Satellite] Element84 STAC error:', err instanceof Error ? err.message : String(err));
      return null;
    }
  };

  const [beforeFeature, afterFeature] = await Promise.all([
    fetchImage(bStart, bEnd, bDate),
    fetchImage(aStart, aEnd, aDate)
  ]);

  if (!beforeFeature && !afterFeature) {
    throw new Error(`Insufficient satellite data available. No usable satellite imagery was found for this location and date ranges (max cloud cover ${maxCloudCover}%).`);
  }
  if (!beforeFeature) {
    throw new Error(`Insufficient satellite data available. No usable satellite imagery found near the Before Date (tried ±${toleranceDays} days).`);
  }
  if (!afterFeature) {
    throw new Error(`Insufficient satellite data available. No usable satellite imagery found near the After Date (tried ±${toleranceDays} days).`);
  }

  const beforeVeg = beforeFeature.properties['s2:vegetation_percentage'] || 0;
  const afterVeg = afterFeature.properties['s2:vegetation_percentage'] || 0;
  
  // Calculate percentage points difference (After - Before)
  const vegetationDifference = afterVeg - beforeVeg;
  const changeDirection = vegetationDifference > 0 ? 'Increase' : (vegetationDifference < 0 ? 'Decrease' : 'No Change');

  // Relative Change (%)
  let relativeChange = 0;
  if (beforeVeg > 0) {
    relativeChange = (vegetationDifference / beforeVeg) * 100;
  }
  relativeChange = Math.round(relativeChange * 10) / 10;

  // Status mapping based on actual percentage point difference
  let condition = 'Healthy / Stable';
  if (vegetationDifference <= -20) {
    condition = 'Significant Vegetation Loss';
  } else if (vegetationDifference < -5) {
    condition = 'Declining';
  } else if (vegetationDifference >= 5) {
    condition = 'Improving / Growing';
  }

  const beforeImage = beforeFeature.assets?.thumbnail?.href || beforeFeature.assets?.visual?.href || null;
  const afterImage = afterFeature.assets?.thumbnail?.href || afterFeature.assets?.visual?.href || null;

  // Provide regional proportions from the STAC item to represent the surrounding scene (100x100km tile)
  const regionalProportions = {
    agricultural: beforeFeature.properties['s2:vegetation_percentage'] || 0,
    water: beforeFeature.properties['s2:water_percentage'] || 0,
    builtUp: beforeFeature.properties['s2:built_up_percentage'] || 0,
    bare: (beforeFeature.properties['s2:not_vegetated_percentage'] || 0) + (beforeFeature.properties['s2:unclassified_percentage'] || 0)
  };

  return {
    isCrop: true,
    locationType: 'Agricultural Land',
    vegetationDifference, // Signed percentage points difference
    changeDirection,
    relativeChange,
    condition,
    requestedBeforeDate: bDate.toISOString(),
    requestedAfterDate: aDate.toISOString(),
    beforeDate: beforeFeature.properties.datetime,
    afterDate: afterFeature.properties.datetime,
    beforeImage,
    afterImage,
    beforeVegetation: beforeVeg,
    afterVegetation: afterVeg,
    beforeBbox: beforeFeature.bbox,
    afterBbox: afterFeature.bbox,
    regionalProportions
  };
};
