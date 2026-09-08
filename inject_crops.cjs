const fs = require('fs');
const path = require('path');
const localesDir = path.join(__dirname, 'src', 'locales');

const cropTranslations = {
  en: { Cotton: "Cotton", Paddy: "Paddy", Maize: "Maize", "Red Gram": "Red Gram", Groundnut: "Groundnut", Soybean: "Soybean", Tomato: "Tomato", Chilli: "Chilli", Other: "Other" },
  te: { Cotton: "పత్తి", Paddy: "వరి", Maize: "మొక్కజొన్న", "Red Gram": "కంది", Groundnut: "వేరుశనగ", Soybean: "సోయాబీన్", Tomato: "టమాటా", Chilli: "మిరప", Other: "ఇతర" },
  hi: { Cotton: "कपास", Paddy: "धान", Maize: "मक्का", "Red Gram": "अरहर", Groundnut: "मूंगफली", Soybean: "सोयाबीन", Tomato: "टमाटर", Chilli: "मिर्च", Other: "अन्य" },
  kn: { Cotton: "ಹತ್ತಿ", Paddy: "ಭತ್ತ", Maize: "ಮೆಕ್ಕೆಜೋಳ", "Red Gram": "ತೊಗರಿ", Groundnut: "ಕಡಲೆಕಾಯಿ", Soybean: "ಸೋಯಾಬೀನ್", Tomato: "ಟೊಮ್ಯಾಟೊ", Chilli: "ಮೆಣಸಿನಕಾಯಿ", Other: "ಇತರ" },
  ta: { Cotton: "பருத்தி", Paddy: "நெல்", Maize: "மக்காச்சோளம்", "Red Gram": "துவரை", Groundnut: "நிலக்கடலை", Soybean: "சோயாபீன்", Tomato: "தக்காளி", Chilli: "மிளகாய்", Other: "மற்றவை" },
  mr: { Cotton: "कापूस", Paddy: "भात", Maize: "मका", "Red Gram": "तूर", Groundnut: "भुईमूग", Soybean: "सोयाबीन", Tomato: "टोमॅटो", Chilli: "मिरची", Other: "इतर" }
};

const langs = ['en', 'te', 'hi', 'kn', 'ta', 'mr'];

langs.forEach(lang => {
  const filePath = path.join(localesDir, `${lang}.json`);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (!data.crops) data.crops = {};
    Object.assign(data.crops, cropTranslations[lang]);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Updated crops in ${lang}.json`);
  }
});
