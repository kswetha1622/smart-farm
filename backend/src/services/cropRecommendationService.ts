// Crop recommendation logic based on agronomic rules
// In production this can be extended with ML models or more detailed datasets

interface CropParams {
  lat: number;
  lng: number;
  landAreaAcres: number;
  soilType: string;
  season: string;
  previousCrop?: string;
  irrigation: string;
  weatherData?: Record<string, unknown>;
}

interface CropScore {
  crop: string;
  score: number;
  suitability: 'Best' | 'Good' | 'Average' | 'Not Recommended';
  waterRequirement: string;
  duration: string;
  notes: string;
}

const CROP_RULES: Record<string, {
  soils: string[];
  seasons: string[];
  irrigation: string[];
  baseScore: number;
  waterReq: string;
  duration: string;
  avoidAfter?: string[];
}> = {
  Rice: { soils: ['clay', 'loamy', 'alluvial'], seasons: ['kharif'], irrigation: ['available', 'partial'], baseScore: 85, waterReq: 'High', duration: '120-150 days', avoidAfter: ['Rice'] },
  Maize: { soils: ['loamy', 'black', 'red', 'alluvial'], seasons: ['kharif', 'rabi', 'zaid'], irrigation: ['available', 'partial', 'none'], baseScore: 80, waterReq: 'Medium', duration: '90-110 days' },
  Cotton: { soils: ['black', 'loamy'], seasons: ['kharif'], irrigation: ['available', 'partial'], baseScore: 78, waterReq: 'Low-Medium', duration: '150-180 days', avoidAfter: ['Cotton'] },
  Wheat: { soils: ['loamy', 'clay', 'alluvial', 'black'], seasons: ['rabi'], irrigation: ['available', 'partial'], baseScore: 85, waterReq: 'Medium', duration: '100-120 days' },
  Sorghum: { soils: ['black', 'red', 'sandy', 'loamy'], seasons: ['kharif', 'rabi'], irrigation: ['partial', 'none'], baseScore: 75, waterReq: 'Low', duration: '100-110 days' },
  Groundnut: { soils: ['red', 'sandy', 'loamy'], seasons: ['kharif', 'zaid'], irrigation: ['partial', 'none'], baseScore: 73, waterReq: 'Low-Medium', duration: '90-120 days', avoidAfter: ['Groundnut'] },
  Turmeric: { soils: ['loamy', 'alluvial', 'red'], seasons: ['kharif'], irrigation: ['available'], baseScore: 70, waterReq: 'High', duration: '180-270 days' },
  Chilli: { soils: ['loamy', 'black', 'alluvial'], seasons: ['kharif', 'rabi'], irrigation: ['available', 'partial'], baseScore: 72, waterReq: 'Medium', duration: '100-130 days' },
};

const getSuitabilityLabel = (score: number): CropScore['suitability'] => {
  if (score >= 85) return 'Best';
  if (score >= 70) return 'Good';
  if (score >= 55) return 'Average';
  return 'Not Recommended';
};

export const getRecommendations = (params: CropParams): CropScore[] => {
  const { soilType, season, previousCrop, irrigation } = params;
  const normSeason = season.toLowerCase();
  const normIrrigation = irrigation.toLowerCase().includes('yes') || irrigation.toLowerCase().includes('available')
    ? 'available'
    : irrigation.toLowerCase().includes('partial') ? 'partial' : 'none';

  const scored: CropScore[] = [];

  for (const [cropName, rules] of Object.entries(CROP_RULES)) {
    let score = rules.baseScore;
    const reasons: string[] = [];

    // Soil match
    if (rules.soils.includes(soilType)) score += 8;
    else { score -= 15; reasons.push('Soil type is suboptimal for this crop.'); }

    // Season match
    if (rules.seasons.includes(normSeason)) score += 7;
    else { score -= 20; }

    // Irrigation match
    if (rules.irrigation.includes(normIrrigation)) score += 5;
    else if (normIrrigation === 'none' && !rules.irrigation.includes('none')) {
      score -= 25;
      reasons.push('Insufficient irrigation.');
    }

    // Rotation penalty — avoid same crop consecutively
    if (previousCrop && rules.avoidAfter?.includes(previousCrop)) {
      score -= 10;
      reasons.push(`Avoid planting ${cropName} after ${previousCrop} for best yields.`);
    }

    if (score <= 0) continue;

    scored.push({
      crop: cropName,
      score: Math.min(score, 100),
      suitability: getSuitabilityLabel(Math.min(score, 100)),
      waterRequirement: rules.waterReq,
      duration: rules.duration,
      notes: reasons.join(' ') || 'Suitable for your field conditions.',
    });
  }

  return scored
    .filter((c) => c.score >= 40)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
};
