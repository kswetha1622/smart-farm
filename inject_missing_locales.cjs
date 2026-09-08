const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');

const translations = {
  en: {
    disease: {
      uploadPromptLong: "Upload a photo of your crop, fruit or leaf for AI analysis",
      takePhoto: "Take Photo",
      uploadPhoto: "Upload Photo",
      supportedFormats: "Supported formats: JPG, PNG, WEBP",
      imagePreview: "Image Preview",
      retake: "Retake",
      chooseAnother: "Choose Another",
      remove: "Remove",
      analyzePhoto: "Analyze Photo"
    },
    nextCrop: {
      title: "Next Crop & Profit Recommendation",
      subtitle: "Find the most suitable next crop based on your previous crop, soil, water availability, weather and expected profitability.",
      previousCrop: "Previous Crop",
      soilType: "Soil Type",
      waterAvailability: "Water Availability",
      currentMonth: "Current Month",
      seasonLabel: "Season",
      location: "Location",
      rainfed: "Rainfed",
      fullIrrigation: "Full Irrigation",
      levelLow: "Low",
      levelMedium: "Medium",
      levelHigh: "High",
      analyzeBtn: "Analyze Site & Get Recommendation"
    }
  },
  te: {
    disease: {
      uploadPromptLong: "AI విశ్లేషణ కోసం మీ పంట, పండు లేదా ఆకు యొక్క ఫోటోను అప్‌లోడ్ చేయండి",
      takePhoto: "ఫోటో తీయండి",
      uploadPhoto: "ఫోటోను అప్‌లోడ్ చేయండి",
      supportedFormats: "మద్దతు ఉన్న ఫార్మాట్‌లు: JPG, PNG, WEBP",
      imagePreview: "చిత్రం ప్రివ్యూ",
      retake: "మళ్ళీ తీయండి",
      chooseAnother: "మరొకటి ఎంచుకోండి",
      remove: "తీసివేయండి",
      analyzePhoto: "ఫోటోను విశ్లేషించండి"
    },
    nextCrop: {
      title: "తదుపరి పంట & లాభ సిఫార్సు",
      subtitle: "మీ మునుపటి పంట, నేల, నీటి లభ్యత, వాతావరణం మరియు ఆశించిన లాభదాయకత ఆధారంగా అత్యంత అనుకూలమైన తదుపరి పంటను కనుగొనండి.",
      previousCrop: "మునుపటి పంట",
      soilType: "నేల రకం",
      waterAvailability: "నీటి లభ్యత",
      currentMonth: "ప్రస్తుత నెల",
      seasonLabel: "సీజన్",
      location: "స్థానం",
      rainfed: "వర్షాధారితం",
      fullIrrigation: "పూర్తి నీటిపారుదల",
      levelLow: "తక్కువ",
      levelMedium: "మధ్యస్థం",
      levelHigh: "ఎక్కువ",
      analyzeBtn: "సైట్‌ను విశ్లేషించండి & సిఫార్సును పొందండి"
    }
  },
  hi: {
    disease: {
      uploadPromptLong: "AI विश्लेषण के लिए अपनी फसल, फल या पत्ते की तस्वीर अपलोड करें",
      takePhoto: "तस्वीर लें",
      uploadPhoto: "तस्वीर अपलोड करें",
      supportedFormats: "समर्थित प्रारूप: JPG, PNG, WEBP",
      imagePreview: "छवि पूर्वावलोकन",
      retake: "फिर से लें",
      chooseAnother: "दूसरा चुनें",
      remove: "हटाएं",
      analyzePhoto: "तस्वीर का विश्लेषण करें"
    },
    nextCrop: {
      title: "अगली फसल और लाभ की सिफारिश",
      subtitle: "अपनी पिछली फसल, मिट्टी, पानी की उपलब्धता, मौसम और अपेक्षित लाभप्रदता के आधार पर सबसे उपयुक्त अगली फसल खोजें।",
      previousCrop: "पिछली फसल",
      soilType: "मिट्टी का प्रकार",
      waterAvailability: "पानी की उपलब्धता",
      currentMonth: "वर्तमान महीना",
      seasonLabel: "मौसम",
      location: "स्थान",
      rainfed: "वर्षा आधारित",
      fullIrrigation: "पूर्ण सिंचाई",
      levelLow: "कम",
      levelMedium: "मध्यम",
      levelHigh: "अधिक",
      analyzeBtn: "साइट का विश्लेषण करें और सिफारिश प्राप्त करें"
    }
  },
  kn: {
    disease: {
      uploadPromptLong: "AI ವಿಶ್ಲೇಷಣೆಗಾಗಿ ನಿಮ್ಮ ಬೆಳೆ, ಹಣ್ಣು ಅಥವಾ ಎಲೆಯ ಫೋಟೋವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
      takePhoto: "ಫೋಟೋ ತೆಗೆದುಕೊಳ್ಳಿ",
      uploadPhoto: "ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
      supportedFormats: "ಬೆಂಬಲಿತ ಸ್ವರೂಪಗಳು: JPG, PNG, WEBP",
      imagePreview: "ಚಿತ್ರ ಪೂರ್ವವೀಕ್ಷಣೆ",
      retake: "ಮತ್ತೆ ತೆಗೆದುಕೊಳ್ಳಿ",
      chooseAnother: "ಇನ್ನೊಂದನ್ನು ಆಯ್ಕೆಮಾಡಿ",
      remove: "ತೆಗೆದುಹಾಕಿ",
      analyzePhoto: "ಫೋಟೋ ವಿಶ್ಲೇಷಿಸಿ"
    },
    nextCrop: {
      title: "ಮುಂದಿನ ಬೆಳೆ ಮತ್ತು ಲಾಭದ ಶಿಫಾರಸು",
      subtitle: "ನಿಮ್ಮ ಹಿಂದಿನ ಬೆಳೆ, ಮಣ್ಣು, ನೀರಿನ ಲಭ್ಯತೆ, ಹವಾಮಾನ ಮತ್ತು ನಿರೀಕ್ಷಿತ ಲಾಭದಾಯಕತೆಯ ಆಧಾರದ ಮೇಲೆ ಸೂಕ್ತವಾದ ಮುಂದಿನ ಬೆಳೆಯನ್ನು ಹುಡುಕಿ.",
      previousCrop: "ಹಿಂದಿನ ಬೆಳೆ",
      soilType: "ಮಣ್ಣಿನ ಪ್ರಕಾರ",
      waterAvailability: "ನೀರಿನ ಲಭ್ಯತೆ",
      currentMonth: "ಪ್ರಸ್ತುತ ತಿಂಗಳು",
      seasonLabel: "ಋತು",
      location: "ಸ್ಥಳ",
      rainfed: "ಮಳೆಯಾಶ್ರಿತ",
      fullIrrigation: "ಪೂರ್ಣ ನೀರಾವರಿ",
      levelLow: "ಕಡಿಮೆ",
      levelMedium: "ಮಧ್ಯಮ",
      levelHigh: "ಹೆಚ್ಚು",
      analyzeBtn: "ಸೈಟ್ ವಿಶ್ಲೇಷಿಸಿ ಮತ್ತು ಶಿಫಾರಸು ಪಡೆಯಿರಿ"
    }
  },
  ta: {
    disease: {
      uploadPromptLong: "AI பகுப்பாய்விற்கு உங்கள் பயிர், பழம் அல்லது இலையின் புகைப்படத்தை பதிவேற்றவும்",
      takePhoto: "புகைப்படம் எடுக்கவும்",
      uploadPhoto: "புகைப்படம் பதிவேற்றவும்",
      supportedFormats: "ஆதரிக்கப்படும் வடிவங்கள்: JPG, PNG, WEBP",
      imagePreview: "பட முன்னோட்டம்",
      retake: "மீண்டும் எடுக்கவும்",
      chooseAnother: "வேறொன்றைத் தேர்ந்தெடுக்கவும்",
      remove: "அகற்று",
      analyzePhoto: "புகைப்படத்தை பகுப்பாய்வு செய்"
    },
    nextCrop: {
      title: "அடுத்த பயிர் மற்றும் லாப பரிந்துரை",
      subtitle: "உங்கள் முந்தைய பயிர், மண், நீர் இருப்பு, வானிலை மற்றும் எதிர்பார்க்கப்படும் லாபத்தின் அடிப்படையில் மிகவும் பொருத்தமான அடுத்த பயிரைக் கண்டறியவும்.",
      previousCrop: "முந்தைய பயிர்",
      soilType: "மண் வகை",
      waterAvailability: "நீர் இருப்பு",
      currentMonth: "தற்போதைய மாதம்",
      seasonLabel: "பருவம்",
      location: "இடம்",
      rainfed: "மானாவாரி",
      fullIrrigation: "முழு பாசனம்",
      levelLow: "குறைவு",
      levelMedium: "நடுத்தரம்",
      levelHigh: "அதிகம்",
      analyzeBtn: "தளத்தை பகுப்பாய்வு செய்து பரிந்துரையைப் பெறவும்"
    }
  },
  mr: {
    disease: {
      uploadPromptLong: "AI विश्लेषणासाठी आपल्या पिकाचा, फळाचा किंवा पानाचा फोटो अपलोड करा",
      takePhoto: "फोटो काढा",
      uploadPhoto: "फोटो अपलोड करा",
      supportedFormats: "समर्थित स्वरूप: JPG, PNG, WEBP",
      imagePreview: "प्रतिमा पूर्वावलोकन",
      retake: "पुन्हा घ्या",
      chooseAnother: "दुसरे निवडा",
      remove: "काढून टाका",
      analyzePhoto: "फोटोचे विश्लेषण करा"
    },
    nextCrop: {
      title: "पुढील पीक आणि नफा शिफारस",
      subtitle: "आपले मागील पीक, माती, पाण्याची उपलब्धता, हवामान आणि अपेक्षित नफ्याच्या आधारे सर्वात योग्य पुढील पीक शोधा.",
      previousCrop: "मागील पीक",
      soilType: "मातीचा प्रकार",
      waterAvailability: "पाण्याची उपलब्धता",
      currentMonth: "सध्याचा महिना",
      seasonLabel: "हंगाम",
      location: "स्थान",
      rainfed: "जिरायती",
      fullIrrigation: "पूर्ण सिंचन",
      levelLow: "कमी",
      levelMedium: "मध्यम",
      levelHigh: "जास्त",
      analyzeBtn: "साइटचे विश्लेषण करा आणि शिफारस मिळवा"
    }
  }
};

const langs = ['en', 'te', 'hi', 'kn', 'ta', 'mr'];

langs.forEach(lang => {
  const filePath = path.join(localesDir, `${lang}.json`);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Merge disease translations
    if (!data.disease) data.disease = {};
    Object.assign(data.disease, translations[lang].disease);
    
    // Merge nextCrop translations
    if (!data.nextCrop) data.nextCrop = {};
    Object.assign(data.nextCrop, translations[lang].nextCrop);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Updated ${lang}.json`);
  }
});
