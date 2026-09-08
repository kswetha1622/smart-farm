const fs = require('fs');
const path = require('path');
const localesDir = path.join(__dirname, 'src', 'locales');

const injectData = {
  en: {
    recommendedCrops: "Recommended Crops",
    topRecommended: "TOP RECOMMENDED CROP",
    rank: "Rank",
    suitabilityScore: "Suitability Score",
    whyRecommended: "Why Recommended:",
    reasons: {
      soil: "Suitable for {{soil}}",
      water: "Compatible with available water",
      season: "Suitable for {{season}} season",
      climate: "Suitable climate conditions"
    },
    rotation: {
      suitable: "Suitable",
      notRecommended: "Not Recommended (Monocropping increases pest risk and soil depletion)",
      highlyRecommended: "Highly Recommended (Good for nitrogen fixing and soil health)"
    },
    weatherRisk: "Weather Risk",
    riskLevels: {
      Low: "Low",
      Medium: "Medium",
      High: "High"
    },
    economics: "Economics (per acre)",
    estCost: "Est. Cost",
    estRevenue: "Est. Revenue",
    estProfit: "Est. Profit",
    duration: "Duration"
  },
  te: {
    recommendedCrops: "సిఫార్సు చేయబడిన పంటలు",
    topRecommended: "అగ్ర సిఫార్సు పంట",
    rank: "స్థానం",
    suitabilityScore: "అనుకూలత స్కోరు",
    whyRecommended: "ఎందుకు సిఫార్సు చేయబడింది:",
    reasons: {
      soil: "{{soil}} నేలకు అనుకూలం",
      water: "అందుబాటులో ఉన్న నీటితో అనుకూలంగా ఉంటుంది",
      season: "{{season}} సీజన్‌కు అనుకూలం",
      climate: "అనుకూలమైన వాతావరణ పరిస్థితులు"
    },
    rotation: {
      suitable: "అనుకూలం",
      notRecommended: "సిఫార్సు చేయబడదు (ఒకే పంట వేయడం వల్ల చీడపీడలు పెరిగి నేల సారం తగ్గుతుంది)",
      highlyRecommended: "అధికంగా సిఫార్సు చేయబడింది (నత్రజని స్థిరీకరణ మరియు నేల ఆరోగ్యానికి మంచిది)"
    },
    weatherRisk: "వాతావరణ ప్రమాదం",
    riskLevels: {
      Low: "తక్కువ",
      Medium: "మధ్యస్థం",
      High: "ఎక్కువ"
    },
    economics: "ఆర్థిక లాభాలు (ఎకరాకు)",
    estCost: "అంచనా వ్యయం",
    estRevenue: "అంచనా ఆదాయం",
    estProfit: "అంచనా లాభం",
    duration: "సమయం"
  },
  hi: {
    recommendedCrops: "अनुशंसित फसलें",
    topRecommended: "शीर्ष अनुशंसित फसल",
    rank: "रैंक",
    suitabilityScore: "उपयुक्तता स्कोर",
    whyRecommended: "अनुशंसित क्यों:",
    reasons: {
      soil: "{{soil}} मिट्टी के लिए उपयुक्त",
      water: "उपलब्ध पानी के अनुकूल",
      season: "{{season}} मौसम के लिए उपयुक्त",
      climate: "अनुकूल जलवायु परिस्थितियाँ"
    },
    rotation: {
      suitable: "उपयुक्त",
      notRecommended: "अनुशंसित नहीं (एक ही फसल उगाने से कीटों का खतरा बढ़ता है और मिट्टी की उर्वरता कम होती है)",
      highlyRecommended: "अत्यधिक अनुशंसित (नाइट्रोजन स्थिरीकरण और मिट्टी के स्वास्थ्य के लिए अच्छा)"
    },
    weatherRisk: "मौसम जोखिम",
    riskLevels: {
      Low: "कम",
      Medium: "मध्यम",
      High: "उच्च"
    },
    economics: "अर्थशास्त्र (प्रति एकड़)",
    estCost: "अनुमानित लागत",
    estRevenue: "अनुमानित राजस्व",
    estProfit: "अनुमानित लाभ",
    duration: "अवधि"
  },
  kn: {
    recommendedCrops: "ಶಿಫಾರಸು ಮಾಡಿದ ಬೆಳೆಗಳು",
    topRecommended: "ಉನ್ನತ ಶಿಫಾರಸು ಬೆಳೆ",
    rank: "ಶ್ರೇಣಿ",
    suitabilityScore: "ಸೂಕ್ತತೆಯ ಅಂಕ",
    whyRecommended: "ಏಕೆ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ:",
    reasons: {
      soil: "{{soil}} ಮಣ್ಣಿಗೆ ಸೂಕ್ತವಾಗಿದೆ",
      water: "ಲಭ್ಯವಿರುವ ನೀರಿನೊಂದಿಗೆ ಹೊಂದಿಕೊಳ್ಳುತ್ತದೆ",
      season: "{{season}} ಋತುವಿಗೆ ಸೂಕ್ತವಾಗಿದೆ",
      climate: "ಸೂಕ್ತ ಹವಾಮಾನ ಪರಿಸ್ಥಿತಿಗಳು"
    },
    rotation: {
      suitable: "ಸೂಕ್ತವಾಗಿದೆ",
      notRecommended: "ಶಿಫಾರಸು ಮಾಡಲಾಗಿಲ್ಲ (ಏಕಬೆಳೆ ಪದ್ಧತಿಯು ಕೀಟಗಳ ಅಪಾಯವನ್ನು ಹೆಚ್ಚಿಸುತ್ತದೆ ಮತ್ತು ಮಣ್ಣಿನ ಫಲವತ್ತತೆಯನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ)",
      highlyRecommended: "ಹೆಚ್ಚು ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ (ಸಾರಜನಕ ಸ್ಥಿರೀಕರಣ ಮತ್ತು ಮಣ್ಣಿನ ಆರೋಗ್ಯಕ್ಕೆ ಒಳ್ಳೆಯದು)"
    },
    weatherRisk: "ಹವಾಮಾನ ಅಪಾಯ",
    riskLevels: {
      Low: "ಕಡಿಮೆ",
      Medium: "ಮಧ್ಯಮ",
      High: "ಹೆಚ್ಚು"
    },
    economics: "ಆರ್ಥಿಕತೆ (ಪ್ರತಿ ಎಕರೆಗೆ)",
    estCost: "ಅಂದಾಜು ವೆಚ್ಚ",
    estRevenue: "ಅಂದಾಜು ಆದಾಯ",
    estProfit: "ಅಂದಾಜು ಲಾಭ",
    duration: "ಅವಧಿ"
  },
  ta: {
    recommendedCrops: "பரிந்துரைக்கப்பட்ட பயிர்கள்",
    topRecommended: "சிறந்த பரிந்துரைக்கப்பட்ட பயிர்",
    rank: "தரவரிசை",
    suitabilityScore: "பொருத்தமான மதிப்பெண்",
    whyRecommended: "ஏன் பரிந்துரைக்கப்படுகிறது:",
    reasons: {
      soil: "{{soil}} மண்ணுக்கு ஏற்றது",
      water: "கிடைக்கக்கூடிய நீருடன் இணக்கமானது",
      season: "{{season}} பருவத்திற்கு ஏற்றது",
      climate: "ஏற்ற வானிலை நிலைமைகள்"
    },
    rotation: {
      suitable: "பொருத்தமானது",
      notRecommended: "பரிந்துரைக்கப்படவில்லை (ஒரே பயிரை வளர்ப்பது பூச்சி அபாயத்தை அதிகரிக்கிறது மற்றும் மண் வளத்தை குறைக்கிறது)",
      highlyRecommended: "மிகவும் பரிந்துரைக்கப்படுகிறது (நைட்ரஜன் நிலைப்படுத்தல் மற்றும் மண் ஆரோக்கியத்திற்கு நல்லது)"
    },
    weatherRisk: "வானிலை ஆபத்து",
    riskLevels: {
      Low: "குறைவு",
      Medium: "நடுத்தரம்",
      High: "அதிகம்"
    },
    economics: "பொருளாதாரம் (ஏக்கருக்கு)",
    estCost: "மதிப்பிடப்பட்ட செலவு",
    estRevenue: "மதிப்பிடப்பட்ட வருவாய்",
    estProfit: "மதிப்பிடப்பட்ட லாபம்",
    duration: "கால அளவு"
  },
  mr: {
    recommendedCrops: "शिफारस केलेली पिके",
    topRecommended: "शीर्ष शिफारस केलेले पीक",
    rank: "रँक",
    suitabilityScore: "योग्यता स्कोअर",
    whyRecommended: "का शिफारस केली:",
    reasons: {
      soil: "{{soil}} मातीसाठी योग्य",
      water: "उपलब्ध पाण्याशी सुसंगत",
      season: "{{season}} हंगामासाठी योग्य",
      climate: "योग्य हवामान परिस्थिती"
    },
    rotation: {
      suitable: "योग्य",
      notRecommended: "शिफारस केलेली नाही (एकच पीक घेतल्याने कीटकांचा धोका वाढतो आणि मातीची सुपीकता कमी होते)",
      highlyRecommended: "अत्यंत शिफारस केली (नायट्रोजन स्थिरीकरण आणि मातीच्या आरोग्यासाठी चांगले)"
    },
    weatherRisk: "हवामान धोका",
    riskLevels: {
      Low: "कमी",
      Medium: "मध्यम",
      High: "जास्त"
    },
    economics: "अर्थशास्त्र (प्रति एकर)",
    estCost: "अंदाजित खर्च",
    estRevenue: "अंदाजित महसूल",
    estProfit: "अंदाजित नफा",
    duration: "कालावधी"
  }
};

const langs = ['en', 'te', 'hi', 'kn', 'ta', 'mr'];

langs.forEach(lang => {
  const filePath = path.join(localesDir, `${lang}.json`);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (!data.nextCrop) data.nextCrop = {};
    Object.assign(data.nextCrop, injectData[lang]);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Updated nextCrop in ${lang}.json`);
  }
});
