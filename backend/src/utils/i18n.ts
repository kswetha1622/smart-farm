const messages: Record<string, Record<string, string>> = {
  FIELD_SAVED: {
    en: 'Field selected successfully.',
    te: 'పొలం విజయవంతంగా ఎంపిక చేయబడింది.',
    hi: 'खेत सफलतापूर्वक चुना गया है।',
    kn: 'ಹೊಲವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಆಯ್ಕೆ ಮಾಡಲಾಗಿದೆ.',
    ta: 'வயல் வெற்றிகரமாக தேர்ந்தெடுக்கப்பட்டது.',
    mr: 'शेत यशस्वीपणे निवडले गेले.',
  },
  FIELD_NOT_FOUND: {
    en: 'Selected field could not be found.',
    te: 'ఎంచుకున్న పొలం కనుగొనబడలేదు.',
    hi: 'चुना हुआ खेत नहीं मिला।',
    kn: 'ಆಯ್ಕೆ ಮಾಡಿದ ಹೊಲ ಕಂಡುಬಂದಿಲ್ಲ.',
    ta: 'தேர்ந்தெடுக்கப்பட்ட வயல் கண்டுபிடிக்கப்படவில்லை.',
    mr: 'निवडलेले शेत सापडले नाही.',
  },
  UNAUTHORIZED: {
    en: 'You are not authorized to access this resource.',
    te: 'మీకు ఈ వనరుని యాక్సెస్ చేయడానికి అనుమతి లేదు.',
    hi: 'आपको इस संसाधन तक पहुंचने का अधिकार नहीं है।',
    kn: 'ಈ ಸಂಪನ್ಮೂಲ ಪ್ರವೇಶಿಸಲು ನಿಮಗೆ ಅಧಿಕಾರ ಇಲ್ಲ.',
    ta: 'இந்த ஆதாரத்தை அணுக உங்களுக்கு அனுமதி இல்லை.',
    mr: 'या संसाधनात प्रवेश करण्यासाठी आपल्याला अधिकार नाही.',
  },
  WEATHER_UNAVAILABLE: {
    en: 'Weather information is temporarily unavailable.',
    te: 'వాతావరణ సమాచారం తాత్కాలికంగా అందుబాటులో లేదు.',
    hi: 'मौसम जानकारी अस्थायी रूप से उपलब्ध नहीं है।',
    kn: 'ಹವಾಮಾನ ಮಾಹಿತಿ ತಾತ್ಕಾಲಿಕವಾಗಿ ಲಭ್ಯವಿಲ್ಲ.',
    ta: 'வானிலை தகவல் தற்காலிகமாக கிடைக்கவில்லை.',
    mr: 'हवामान माहिती तात्पुरती उपलब्ध नाही.',
  },
};

export const getLocalizedMessage = (key: string, lang = 'en'): string => {
  const supported = ['en', 'te', 'hi', 'kn', 'ta', 'mr'];
  const useLang = supported.includes(lang) ? lang : 'en';
  return messages[key]?.[useLang] ?? messages[key]?.['en'] ?? key;
};

export const getLangFromRequest = (req: {
  headers: Record<string, string | string[] | undefined>;
  body?: Record<string, unknown>;
}): string => {
  const header = req.headers['accept-language'];
  const body = req.body?.language as string | undefined;
  const lang =
    body ||
    (typeof header === 'string' ? header.split(',')[0].split('-')[0] : 'en');
  return lang;
};
