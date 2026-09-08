import { Router, Request, Response } from 'express';

const router = Router();

const AGRO_BASE = 'https://api.agromonitoring.com/agro/1.0';

// Helper: classify water availability from precipitation + humidity
function classifyWater(precipMm: number, humiditePct: number): 'available' | 'partial' | 'not_available' {
  // precipMm is mm of rain in the last hour (from current weather)
  // We also look at humidity as a moisture proxy
  const score = precipMm * 10 + humiditePct;
  if (score >= 80) return 'available';
  if (score >= 35) return 'partial';
  return 'not_available';
}

// Helper: detect agricultural season from month
function detectSeason(month: number): 'kharif' | 'rabi' | 'zaid' {
  if (month >= 6 && month <= 10) return 'kharif';
  if (month >= 3 && month <= 5)  return 'zaid';
  return 'rabi'; // Nov–Mar
}

/**
 * GET /api/agro/conditions?lat=X&lon=Y
 *
 * Calls AgroMonitoring weather endpoint + soil endpoint (if polygon available),
 * then returns classified environmental conditions for the crop engine.
 */
router.get('/conditions', async (req: Request, res: Response) => {
  const { lat, lon } = req.query as { lat: string; lon: string };

  if (!lat || !lon) {
    return res.status(400).json({
      success: false,
      error: { code: 'MISSING_COORDS', message: 'lat and lon are required.' }
    });
  }

  try {
    // We use Open-Meteo as the primary reliable, free weather/soil API
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code&daily=precipitation_sum,temperature_2m_max,temperature_2m_min&timezone=auto`;
    
    const wRes = await fetch(weatherUrl);
    if (!wRes.ok) {
      throw new Error(`Open-Meteo API returned ${wRes.status}`);
    }

    const wData: any = await wRes.json();

    const tempC = wData?.current?.temperature_2m ?? 25;
    const humidity = wData?.current?.relative_humidity_2m ?? 50;
    const precipMm = wData?.current?.precipitation ?? 0;
    const windKph = wData?.current?.wind_speed_10m ?? 0;
    const weatherCode = wData?.current?.weather_code ?? 0;
    
    // Map WMO code to description
    let weatherDesc = 'Clear';
    if (weatherCode >= 1 && weatherCode <= 3) weatherDesc = 'Cloudy';
    if (weatherCode >= 51 && weatherCode <= 67) weatherDesc = 'Rain';
    if (weatherCode >= 71 && weatherCode <= 77) weatherDesc = 'Snow';
    if (weatherCode >= 80 && weatherCode <= 99) weatherDesc = 'Showers/Thunderstorm';

    // Forecast (7-day rain accumulation)
    let forecastRainMm = 0;
    const dailyRain = wData?.daily?.precipitation_sum ?? [];
    if (dailyRain.length > 0) {
      forecastRainMm = dailyRain.reduce((a: number, b: number) => a + (b || 0), 0);
    }

    // Classify conditions
    const now = new Date();
    const season = detectSeason(now.getMonth() + 1);
    const water = classifyWater(precipMm + forecastRainMm * 0.1, humidity);

    return res.json({
      success: true,
      data: {
        source: 'Open-Meteo API',
        location: { lat: parseFloat(lat), lon: parseFloat(lon) },
        current: {
          tempC,
          humidity,
          precipMm,
          windKph,
          weatherDesc
        },
        forecast: {
          rainNext7DaysMm: Math.round(forecastRainMm * 10) / 10,
          days: [] 
        },
        classified: {
          season,
          waterAvailability: water,
          waterReason: `Classified from current precipitation (${precipMm} mm) + 7-day forecast rain (${Math.round(forecastRainMm)} mm) + humidity (${humidity}%).`
        }
      }
    });
  } catch (err: any) {
    console.error('[Agro] Unexpected error:', err.message);
    return res.status(500).json({
      success: false,
      error: { code: 'AGRO_INTERNAL', message: 'Failed to fetch agricultural conditions. ' + err.message }
    });
  }
});

export default router;
