/**
 * cropEngine.js
 *
 * Crop Recommendation Engine.
 *
 * Input:  { soil, season, tempC, humidity, precipMm, forecastRainMm }
 * Output: Array of scored, ranked crop objects with a "reason" explanation.
 *
 * The engine scores each crop in cropSuitabilityDB against real conditions
 * from the AgroMonitoring API (or user-supplied fallback) and returns the
 * best matches in descending score order.
 */

import { cropSuitabilityDB, WATER_NEEDS_MAP } from '../data/cropSuitability';

// ─── Water availability classifier ───────────────────────────────────────
export function classifyWaterAvailability(precipMm, forecastRainMm, humidity) {
  const score = precipMm * 10 + forecastRainMm * 0.1 + humidity;
  if (score >= 80)  return 'available';
  if (score >= 35)  return 'partial';
  return 'not_available';
}

// ─── Water score helper (0–120) ───────────────────────────────────────────
function computeWaterScore(precipMm, forecastRainMm, humidity) {
  return Math.min(120, precipMm * 10 + forecastRainMm * 0.1 + humidity);
}

// ─── Score a single crop against conditions ───────────────────────────────
export function scoreCrop(crop, { soil, season, tempC, humidity, precipMm, forecastRainMm }) {
  let score   = 0;
  const reasons = [];
  const issues  = [];

  // 1. Soil match (25 pts)
  if (crop.suitableSoils.includes(soil)) {
    score += 25;
    reasons.push(`✅ ${soil.charAt(0).toUpperCase() + soil.slice(1)} soil is suitable for ${crop.name}.`);
  } else {
    issues.push(`⚠ ${crop.name} prefers ${crop.suitableSoils.join(', ')} soils.`);
    return null; // Disqualify if soil doesn't match at all
  }

  // 2. Season match (25 pts)
  if (crop.suitableSeasons.includes(season)) {
    score += 25;
    reasons.push(`✅ ${season.charAt(0).toUpperCase() + season.slice(1)} season is suitable.`);
  } else {
    // Season mismatch → disqualify
    return null;
  }

  // 3. Temperature match (25 pts)
  if (tempC !== null && tempC !== undefined) {
    if (tempC >= crop.tempMinC && tempC <= crop.tempMaxC) {
      // Perfect temperature range
      const proximity = 1 - Math.abs(tempC - crop.tempOptimalC) / (crop.tempMaxC - crop.tempMinC + 1);
      const tempPts = Math.round(25 * proximity);
      score += tempPts;
      reasons.push(`✅ Current temperature (${tempC}°C) is within optimal range (${crop.tempMinC}–${crop.tempMaxC}°C).`);
    } else if (tempC < crop.tempMinC) {
      // Too cold — soft deduction
      score -= 10;
      issues.push(`⚠ Temperature (${tempC}°C) is below the minimum required (${crop.tempMinC}°C).`);
    } else {
      // Too hot — soft deduction
      score -= 15;
      issues.push(`⚠ Temperature (${tempC}°C) exceeds the maximum (${crop.tempMaxC}°C).`);
    }
  } else {
    score += 10; // unknown temp — give partial
    reasons.push('ℹ Temperature data not available; using soil/season compatibility only.');
  }

  // 4. Water/Moisture match (25 pts)
  const waterScore   = computeWaterScore(precipMm, forecastRainMm, humidity);
  const cropMinWater = WATER_NEEDS_MAP[crop.waterNeeds] ?? 0;

  if (waterScore >= cropMinWater) {
    const excess = Math.min(25, Math.round(25 * (waterScore / (cropMinWater + 1))));
    score += Math.min(25, excess);
    reasons.push(`✅ Water availability (score ${waterScore.toFixed(0)}) meets crop requirement (min ${cropMinWater}).`);
  } else {
    const deficit = cropMinWater - waterScore;
    const deduction = Math.min(20, Math.round(deficit * 0.5));
    score -= deduction;
    issues.push(`⚠ Water availability (score ${waterScore.toFixed(0)}) is below crop requirement (min ${cropMinWater}) for ${crop.name}.`);
  }

  return { score: Math.max(0, score), reasons, issues };
}

// ─── Main engine function ─────────────────────────────────────────────────
/**
 * @param {object} conditions - { soil, season, tempC, humidity, precipMm, forecastRainMm, source }
 * @returns Array of { crop, score, reasons, issues } sorted by score descending
 */
export function recommendCrops(conditions) {
  const results = [];

  for (const crop of cropSuitabilityDB) {
    const result = scoreCrop(crop, conditions);
    if (result && result.score > 0) {
      results.push({ crop, ...result });
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);
  return results;
}

// ─── Assign N crops to N fields avoiding repeats where possible ───────────
export function assignCropsToFields(rankedCrops, numFields) {
  const unique = rankedCrops.filter((_, i) => i < rankedCrops.length);
  const assignments = [];

  for (let i = 0; i < numFields; i++) {
    const idx    = i % unique.length;
    const isRep  = i >= unique.length;
    assignments.push({ ...unique[idx], fieldIndex: i + 1, isRepeated: isRep });
  }

  return assignments;
}

// ─── Season detection from current date ──────────────────────────────────
export function detectSeason() {
  const month = new Date().getMonth() + 1; // 1-12
  if (month >= 6 && month <= 10) return 'kharif';
  if (month >= 3 && month <= 5)  return 'zaid';
  return 'rabi';
}
