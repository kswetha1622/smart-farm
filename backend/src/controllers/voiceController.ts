import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { successResponse, errorResponse } from '../utils/response';
import { getWeatherData } from '../services/weatherService';
import Groq from 'groq-sdk';

// POST /api/voice/query
export const handleVoiceQuery = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { text, language = 'en', location, history = [] } = req.body;

    if (!text || typeof text !== 'string') {
      errorResponse(res, 'MISSING_TEXT', 'Please provide a text query.'); return;
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.warn('Missing GROQ_API_KEY in .env');
      successResponse(res, {
        answer: 'AI API key is missing. Please configure GROQ_API_KEY in the backend .env.',
        text: 'AI API key is missing. Please configure GROQ_API_KEY in the backend .env.',
        category: 'GENERAL',
        sources: [],
        language,
        speakable: true,
      });
      return;
    }

    const groq = new Groq({ apiKey });

    // Fetch live weather context if location is available
    let liveWeatherContext = '';
    if (location?.lat && location?.lng) {
      try {
        const weatherData = await getWeatherData(location.lat, location.lng);
        const current = weatherData.current as Record<string, unknown>;
        liveWeatherContext = `Current Location: Lat ${location.lat}, Lng ${location.lng}. 
Current Weather: ${current.temperature}°C, Condition: ${current.condition}, Rain Probability: ${current.rainProbability}%.`;
        if (location.displayString) {
          liveWeatherContext += `\nLocation Name: ${location.displayString}`;
        }
      } catch (err) {
        liveWeatherContext = `Current Location: Lat ${location.lat}, Lng ${location.lng}. (Live weather fetching failed).`;
      }
    }

    const systemPrompt = `You are an intelligent agricultural AI assistant. Your job is to help farmers with weather, crop selection, crop management, irrigation, fertilizer guidance, pest and disease identification guidance, crop growth stages, harvesting, and general farming questions.

Understand the user's intent instead of relying on predefined questions.
Every new question should be processed independently while using relevant previous conversation context.
Use the user's actual current location whenever location-dependent information is required.
For weather-related questions, use live/current weather API data rather than guessing.
For crop recommendations, consider location, season, weather, soil, water availability, and crop history when those details are available.
For pesticide, fungicide, fertilizer, or disease-treatment questions, do not blindly recommend dangerous chemical quantities. Ask for missing important information such as crop, growth stage, symptoms, affected area, and location when necessary. Give safe, practical guidance and recommend following the product label and local agricultural expert advice for chemical application.
If the user asks an unrelated general question, answer it normally when possible instead of forcing the conversation back to agriculture.

[LIVE CONTEXT FOR THIS REQUEST]
${liveWeatherContext}
User's preferred response language: ${language}
Respond only in the selected language: ${language}. Do not switch to English unless the selected language is English.

CRITICAL INSTRUCTION: You MUST return your response as a pure JSON object with the following schema, and NO MARKDOWN tags or code fences.
{
  "answer": "Your detailed native language response here",
  "category": "GENERAL" | "FARMING" | "WEATHER" | "LOCATION" | "CROP/FIELD" | "DISEASE/PEST" | "OTHER",
  "sources": []
}`;

    // Map history to Groq/OpenAI message format
    const chatHistory: Groq.Chat.ChatCompletionMessageParam[] = history.map(
      (msg: { role: string; content: string }) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content,
      } as Groq.Chat.ChatCompletionMessageParam)
    );

    const messages: Groq.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...chatHistory,
      { role: 'user', content: text },
    ];

    const completion = await groq.chat.completions.create({
      model: 'qwen/qwen3.8-27b', // Best available model on this Groq account
      messages,
      max_tokens: 1024,
      temperature: 0.5,
      response_format: { type: 'json_object' },
    });

    const responseText = completion.choices[0]?.message?.content || '';
    let parsedResponse: { answer: string; category: string; sources: string[] } = {
      answer: 'Sorry, an error occurred.',
      category: 'OTHER',
      sources: [],
    };

    try {
      parsedResponse = JSON.parse(responseText.replace(/```json/gi, '').replace(/```/gi, '').trim());
    } catch (e) {
      console.error('JSON parse failed for voice query', responseText);
      parsedResponse.answer = responseText;
    }

    successResponse(res, {
      answer: parsedResponse.answer,
      text: parsedResponse.answer,
      category: parsedResponse.category,
      sources: parsedResponse.sources,
      language,
      speakable: true,
    });

  } catch (err: any) {
    console.error('[Voice] Error in AI query:', err?.message || err);

    // Safely extract request data with fallback defaults
    const safeLanguage: string = (req.body?.language as string) || 'en';
    const safeText: string = (req.body?.text as string) || '';

    // Fallback Mock AI Mode if Groq API fails
    console.log('Falling back to Mock AI Mode due to API error:', err?.message || String(err));

    let fallbackText = safeLanguage === 'te'
      ? 'నమస్కారం! నేను మీ స్మార్ట్ ఫార్మర్ ఏఐ అసిస్టెంట్. ప్రస్తుతం నా ఏఐ సర్వర్‌తో కనెక్ట్ కావడంలో చిన్న సమస్య ఉంది, కానీ నేను మీ ప్రశ్నలను స్వీకరించగలను. దయచేసి వాతావరణం, పంటలు లేదా వ్యవసాయం గురించి అడగండి.'
      : "Hello! I am your Smart Farm AI Assistant powered by Groq AI. I'm temporarily unable to connect to the AI service. Please ask me about crops, weather, or farming.";

    if (safeText.toLowerCase().includes('weather') || safeText.toLowerCase().includes('వర్షం')) {
      fallbackText = safeLanguage === 'te'
        ? 'మీ ప్రస్తుత ప్రదేశంలో వాతావరణం అనుకూలంగా ఉంది. వర్షం పడే అవకాశం లేదు.'
        : 'The weather in your current location is favorable. There is no rain expected.';
    }

    if (!res.headersSent) {
      successResponse(res, {
        answer: fallbackText,
        text: fallbackText,
        category: 'GENERAL',
        sources: ['Mock AI Fallback'],
        language: safeLanguage,
        speakable: true,
      });
    }
  }
};
