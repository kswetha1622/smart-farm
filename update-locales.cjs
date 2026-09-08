const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');
const files = ['en.json', 'te.json', 'hi.json', 'kn.json', 'ta.json', 'mr.json'];

const updates = {
  en: {
    advisor: {
      title: "Crop Advisor",
      subtitle: "Tell us about your land and get the best crop recommendations",
      step1Title: "Step 1 — Your Land",
      step2Title: "Step 2 — Divide Your Land",
      step3Title: "Step 3 — Field Conditions",
      step4Title: "Crop Recommendations",
      location: "Location",
      locationPlaceholder: "Location (Village / City)",
      landArea: "Land Area (Acres)",
      landAreaPlaceholder: "e.g. 2.5",
      latitude: "Latitude",
      longitude: "Longitude",
      latPlaceholder: "e.g. 17.1",
      lngPlaceholder: "e.g. 78.4",
      numFieldsQuestion: "How many fields do you want to create?",
      customLabel: "Custom:",
      customPlaceholder: "e.g. 7",
      eachFieldSize: "Enter size of each field (Acres)",
      field: "Field",
      soilType: "Soil Type",
      season: "Season",
      water: "Water / Irrigation Availability",
      autoDetected: "(auto-detected)",
      fromAPI: "(from API data)",
      fetchLiveData: "Fetch Live Field Conditions",
      fetchBtn: "Fetch Live API Data",
      fetching: "Fetching...",
      apiSuccess: "Live data fetched from API",
      apiManual: "Based on manually provided information (API not used)",
      calculating: "Calculating...",
      getRecommendations: "Get Recommendations",
      backToLand: "Back to Land",
      backToFields: "Back to Fields",
      backToConditions: "Back to Conditions",
      changeConditions: "Change Conditions",
      startOver: "Start Over",
      totalLand: "Total Land",
      fields: "Fields",
      soil: "Soil",
      water_label: "Water",
      location_label: "Location",
      recommended: "Recommended",
      suitability: "Suitability",
      repeated: "Repeated",
      noResultsTitle: "No Suitable Crops Found",
      noResultsMsg: "No crops match the selected combination. Try changing the season or soil type.",
      cropRepeatedNote: "Some crops are repeated — fewer unique suitable crops exist than the number of fields.",
      whyCrop: "Why This Crop?",
      cropCare: "Crop Care",
      waterReq: "Water Req.",
      sowing: "Sowing",
      harvest: "Harvest",
      temp: "Temp.",
      fertilizer: "Fertilizer",
      duration: "Duration",
      apiDataBadge: "Based on Live Weather/Soil API Data",
      manualDataBadge: "Based on Manual Selection (API unavailable)",
      steps: ["Land", "Fields", "Conditions", "Results"],
      soilTypes: { loamy: "Loamy Soil", clay: "Clay Soil", sandy: "Sandy Soil", black: "Black Soil", red: "Red Soil", alluvial: "Alluvial Soil" },
      seasons: { kharif: "Kharif (June – October)", rabi: "Rabi (November – March)", zaid: "Zaid (March – June)" },
      irrigationOptions: { available: "Available", partial: "Partially Available", not_available: "Not Available" },
      previousCrop: "Previous Crop",
      irrigation: "Irrigation Availability",
      getRecommendationsBtn: "Get Crop Recommendations",
      splitField: "Split Field",
      field1: "Field 1",
      field2: "Field 2",
      recommendedFor: "Recommended for",
      loading: "Finding best crops for your land...",
      empty: "Enter your field details to get recommendations."
    },
    diseaseNew: {
      resultTitle: "AI Crop Health Analysis", imageType: "Image Type", plantId: "Plant Identification",
      cropType: "Crop Type", scientificName: "Scientific Name", pestDetection: "Pest Detection",
      diseaseDetection: "Disease Detection", possibleConditions: "Possible Conditions", visibleSymptoms: "Visible Symptoms",
      effectsOnCrop: "Effects on Crop", recommendedTreatment: "Recommended Treatment", immediateActions: "Immediate Actions",
      culturalControl: "Cultural Control", biologicalControl: "Biological Control", chemicalControl: "Chemical Control",
      safetyWarning: "Safety Warning", confidence: "Confidence", severity: "Severity", suitabilityScore: "Suitability score"
    },
    weatherNew: {
      locationRequired: "Location Required", locationRequiredMsg: "Unable to detect your current location. Please allow location access and try again.",
      weatherErrorMsg: "Weather information is temporarily unavailable. Please try again."
    },
    commonNew: { locationDetecting: "Detecting your location...", acres: "Acres", back: "Back" }
  },
  te: {
    advisor: {
      title: "పంట సలహాదారు", subtitle: "మీ భూమి గురించి చెప్పండి మరియు ఉత్తమ పంట సిఫార్సులు పొందండి",
      step1Title: "దశ 1 — మీ భూమి", step2Title: "దశ 2 — మీ భూమిని విభజించండి", step3Title: "దశ 3 — క్షేత్ర పరిస్థితులు", step4Title: "పంట సిఫార్సులు",
      location: "ప్రదేశం", locationPlaceholder: "ప్రదేశం (గ్రామం / నగరం)", landArea: "భూమి వైశాల్యం (ఎకరాలు)", landAreaPlaceholder: "ఉదా: 2.5",
      latitude: "అక్షాంశం", longitude: "రేఖాంశం", latPlaceholder: "ఉదా: 17.1", lngPlaceholder: "ఉదా: 78.4",
      numFieldsQuestion: "మీరు ఎన్ని పొలాలను సృష్టించాలనుకుంటున్నారు?", customLabel: "కస్టమ్:", customPlaceholder: "ఉదా: 7",
      eachFieldSize: "ప్రతి పొలం పరిమాణం నమోదు చేయండి (ఎకరాలు)", field: "పొలం", soilType: "నేల రకం", season: "సీజన్",
      water: "నీటి / నీటిపారుదల లభ్యత", autoDetected: "(స్వయంచాలకంగా గుర్తించబడింది)", fromAPI: "(API డేటా నుండి)",
      fetchLiveData: "లైవ్ క్షేత్ర పరిస్థితులను తీసుకురండి", fetchBtn: "లైవ్ API డేటా తీసుకురండి", fetching: "తీసుకువస్తున్నాము...",
      apiSuccess: "API నుండి లైవ్ డేటా తీసుకురాబడింది", apiManual: "మాన్యువల్ సమాచారం ఆధారంగా (API ఉపయోగించబడలేదు)",
      calculating: "లెక్కిస్తున్నాము...", getRecommendations: "సిఫార్సులు పొందండి", backToLand: "భూమికి తిరిగి",
      backToFields: "పొలాలకు తిరిగి", backToConditions: "పరిస్థితులకు తిరిగి", changeConditions: "పరిస్థితులు మార్చండి",
      startOver: "మళ్ళీ ప్రారంభించండి", totalLand: "మొత్తం భూమి", fields: "పొలాలు", soil: "నేల", water_label: "నీరు",
      location_label: "ప్రదేశం", recommended: "సిఫార్సు చేయబడింది", suitability: "అనుకూలత", repeated: "పునరావృతం",
      noResultsTitle: "అనుకూలమైన పంటలు కనుగొనబడలేదు", noResultsMsg: "ఎంచుకున్న కలయికకు పంటలు లేవు. సీజన్ లేదా నేల రకాన్ని మార్చడానికి ప్రయత్నించండి.",
      cropRepeatedNote: "కొన్ని పంటలు పునరావృతమవుతున్నాయి — పొలాల సంఖ్య కంటే తక్కువ అనన్య అనుకూల పంటలు ఉన్నాయి.",
      whyCrop: "ఈ పంట ఎందుకు?", cropCare: "పంట సంరక్షణ", waterReq: "నీటి అవసరం", sowing: "విత్తనం వేయడం", harvest: "కోత",
      temp: "ఉష్ణోగ్రత", fertilizer: "ఎరువు", duration: "వ్యవధి", apiDataBadge: "లైవ్ వాతావరణ/నేల API డేటా ఆధారంగా",
      manualDataBadge: "మాన్యువల్ ఎంపిక ఆధారంగా (API అందుబాటులో లేదు)", steps: ["భూమి", "పొలాలు", "పరిస్థితులు", "ఫలితాలు"],
      soilTypes: { loamy: "బంకమట్టి నేల", clay: "బంకమట్టి", sandy: "ఇసుక నేల", black: "నల్ల నేల", red: "ఎర్ర నేల", alluvial: "అల్లూవియల్ నేల" },
      seasons: { kharif: "ఖరీఫ్ (జూన్ – అక్టోబర్)", rabi: "రబీ (నవంబర్ – మార్చి)", zaid: "జైద్ (మార్చి – జూన్)" },
      irrigationOptions: { available: "అందుబాటులో ఉంది", partial: "పాక్షికంగా అందుబాటులో ఉంది", not_available: "అందుబాటులో లేదు" },
      previousCrop: "మునుపటి పంట", irrigation: "నీటిపారుదల లభ్యత", getRecommendationsBtn: "పంట సిఫార్సులు పొందండి",
      splitField: "పొలం విభజించండి", field1: "పొలం 1", field2: "పొలం 2", recommendedFor: "దీని కోసం సిఫార్సు చేయబడింది",
      loading: "మీ భూమికి ఉత్తమ పంటలు కనుగొంటున్నాము...", empty: "సిఫార్సులు పొందడానికి మీ పొలం వివరాలు నమోదు చేయండి."
    },
    diseaseNew: {
      resultTitle: "AI పంట ఆరోగ్య విశ్లేషణ", imageType: "చిత్రం రకం", plantId: "మొక్క గుర్తింపు", cropType: "పంట రకం",
      scientificName: "శాస్త్రీయ పేరు", pestDetection: "చీడపురుగు గుర్తింపు", diseaseDetection: "వ్యాధి గుర్తింపు",
      possibleConditions: "సాధ్యమైన పరిస్థితులు", visibleSymptoms: "కనిపించే లక్షణాలు", effectsOnCrop: "పంటపై ప్రభావాలు",
      recommendedTreatment: "సిఫార్సు చేయబడిన చికిత్స", immediateActions: "తక్షణ చర్యలు", culturalControl: "సాంస్కృతిక నియంత్రణ",
      biologicalControl: "జీవ నియంత్రణ", chemicalControl: "రసాయన నియంత్రణ", safetyWarning: "భద్రతా హెచ్చరిక",
      confidence: "విశ్వాసం", severity: "తీవ్రత", suitabilityScore: "అనుకూలత స్కోర్"
    },
    weatherNew: {
      locationRequired: "ప్రదేశం అవసరం", locationRequiredMsg: "మీ ప్రస్తుత ప్రదేశం గుర్తించడం సాధ్యం కాలేదు. దయచేసి స్థాన యాక్సెస్ అనుమతించి మళ్ళీ ప్రయత్నించండి.",
      weatherErrorMsg: "వాతావరణ సమాచారం తాత్కాలికంగా అందుబాటులో లేదు. దయచేసి మళ్ళీ ప్రయత్నించండి."
    },
    commonNew: { locationDetecting: "మీ స్థానాన్ని గుర్తిస్తున్నాము...", acres: "ఎకరాలు", back: "వెనుకకు" }
  },
  hi: {
    advisor: {
      title: "फसल सलाहकार", subtitle: "अपनी जमीन के बारे में बताएं और सबसे अच्छी फसल की सिफारिशें पाएं",
      step1Title: "चरण 1 — आपकी जमीन", step2Title: "चरण 2 — अपनी जमीन को बांटें", step3Title: "चरण 3 — खेत की परिस्थितियां", step4Title: "फसल सिफारिशें",
      location: "स्थान", locationPlaceholder: "स्थान (गाँव / शहर)", landArea: "जमीन का क्षेत्रफल (एकड़)", landAreaPlaceholder: "जैसे: 2.5",
      latitude: "अक्षांश", longitude: "देशांतर", latPlaceholder: "जैसे: 17.1", lngPlaceholder: "जैसे: 78.4",
      numFieldsQuestion: "आप कितने खेत बनाना चाहते हैं?", customLabel: "कस्टम:", customPlaceholder: "जैसे: 7",
      eachFieldSize: "प्रत्येक खेत का आकार दर्ज करें (एकड़)", field: "खेत", soilType: "मिट्टी का प्रकार", season: "मौसम",
      water: "जल / सिंचाई उपलब्धता", autoDetected: "(स्वचालित रूप से पता लगाया गया)", fromAPI: "(API डेटा से)",
      fetchLiveData: "लाइव खेत की परिस्थितियां लाएं", fetchBtn: "लाइव API डेटा लाएं", fetching: "लाया जा रहा है...",
      apiSuccess: "API से लाइव डेटा लाया गया", apiManual: "मैन्युअल जानकारी के आधार पर (API उपयोग नहीं हुआ)",
      calculating: "गणना की जा रही है...", getRecommendations: "सिफारिशें प्राप्त करें", backToLand: "जमीन पर वापस",
      backToFields: "खेतों पर वापस", backToConditions: "परिस्थितियों पर वापस", changeConditions: "परिस्थितियां बदलें",
      startOver: "फिर से शुरू करें", totalLand: "कुल जमीन", fields: "खेत", soil: "मिट्टी", water_label: "पानी",
      location_label: "स्थान", recommended: "अनुशंसित", suitability: "उपयुक्तता", repeated: "दोहराया गया",
      noResultsTitle: "उपयुक्त फसलें नहीं मिलीं", noResultsMsg: "चुने गए संयोजन से कोई फसल मेल नहीं खाती। मौसम या मिट्टी का प्रकार बदलने का प्रयास करें।",
      cropRepeatedNote: "कुछ फसलें दोहराई गई हैं — खेतों की संख्या से कम अनन्य उपयुक्त फसलें हैं।",
      whyCrop: "यह फसल क्यों?", cropCare: "फसल देखभाल", waterReq: "जल आवश्यकता", sowing: "बुवाई", harvest: "कटाई",
      temp: "तापमान", fertilizer: "उर्वरक", duration: "अवधि", apiDataBadge: "लाइव मौसम/मिट्टी API डेटा पर आधारित",
      manualDataBadge: "मैन्युअल चयन पर आधारित (API अनुपलब्ध)", steps: ["जमीन", "खेत", "परिस्थितियां", "परिणाम"],
      soilTypes: { loamy: "दोमट मिट्टी", clay: "चिकनी मिट्टी", sandy: "बलुई मिट्टी", black: "काली मिट्टी", red: "लाल मिट्टी", alluvial: "जलोढ़ मिट्टी" },
      seasons: { kharif: "खरीफ (जून – अक्टूबर)", rabi: "रबी (नवंबर – मार्च)", zaid: "जायद (मार्च – जून)" },
      irrigationOptions: { available: "उपलब्ध", partial: "आंशिक रूप से उपलब्ध", not_available: "उपलब्ध नहीं" },
      previousCrop: "पिछली फसल", irrigation: "सिंचाई उपलब्धता", getRecommendationsBtn: "फसल सिफारिशें प्राप्त करें",
      splitField: "खेत विभाजित करें", field1: "खेत 1", field2: "खेत 2", recommendedFor: "के लिए अनुशंसित",
      loading: "आपकी जमीन के लिए सर्वोत्तम फसलें खोज रहे हैं...", empty: "सिफारिशें पाने के लिए अपने खेत का विवरण दर्ज करें।"
    },
    diseaseNew: {
      resultTitle: "AI फसल स्वास्थ्य विश्लेषण", imageType: "चित्र प्रकार", plantId: "पौधे की पहचान", cropType: "फसल प्रकार",
      scientificName: "वैज्ञानिक नाम", pestDetection: "कीट पहचान", diseaseDetection: "रोग पहचान",
      possibleConditions: "संभावित स्थितियां", visibleSymptoms: "दृश्य लक्षण", effectsOnCrop: "फसल पर प्रभाव",
      recommendedTreatment: "अनुशंसित उपचार", immediateActions: "तत्काल कार्रवाई", culturalControl: "सांस्कृतिक नियंत्रण",
      biologicalControl: "जैविक नियंत्रण", chemicalControl: "रासायनिक नियंत्रण", safetyWarning: "सुरक्षा चेतावनी",
      confidence: "विश्वास", severity: "गंभीरता", suitabilityScore: "उपयुक्तता स्कोर"
    },
    weatherNew: {
      locationRequired: "स्थान आवश्यक है", locationRequiredMsg: "आपका वर्तमान स्थान पहचानने में असमर्थ। कृपया स्थान पहुँच की अनुमति दें और पुनः प्रयास करें。",
      weatherErrorMsg: "मौसम जानकारी अस्थायी रूप से उपलब्ध नहीं है। कृपया पुनः प्रयास करें।"
    },
    commonNew: { locationDetecting: "आपके स्थान का पता लगाया जा रहा है...", acres: "एकड़", back: "वापस" }
  },
  kn: {
    advisor: {
      title: "ಬೆಳೆ ಸಲಹೆಗಾರ", subtitle: "ನಿಮ್ಮ ಜಮೀನಿನ ಬಗ್ಗೆ ತಿಳಿಸಿ ಮತ್ತು ಉತ್ತಮ ಬೆಳೆ ಶಿಫಾರಸುಗಳನ್ನು ಪಡೆಯಿರಿ",
      step1Title: "ಹಂತ 1 — ನಿಮ್ಮ ಜಮೀನು", step2Title: "ಹಂತ 2 — ನಿಮ್ಮ ಜಮೀನನ್ನು ವಿಭಜಿಸಿ", step3Title: "ಹಂತ 3 — ಹೊಲದ ಪರಿಸ್ಥಿತಿಗಳು", step4Title: "ಬೆಳೆ ಶಿಫಾರಸುಗಳು",
      location: "ಸ್ಥಳ", locationPlaceholder: "ಸ್ಥಳ (ಗ್ರಾಮ / ನಗರ)", landArea: "ಜಮೀನಿನ ವಿಸ್ತೀರ್ಣ (ಎಕರೆಗಳು)", landAreaPlaceholder: "ಉದಾ: 2.5",
      latitude: "ಅಕ್ಷಾಂಶ", longitude: "ರೇಖಾಂಶ", latPlaceholder: "ಉದಾ: 17.1", lngPlaceholder: "ಉದಾ: 78.4",
      numFieldsQuestion: "ನೀವು ಎಷ್ಟು ಹೊಲಗಳನ್ನು ಮಾಡಲು ಬಯಸುತ್ತೀರಿ?", customLabel: "ಕಸ್ಟಮ್:", customPlaceholder: "ಉದಾ: 7",
      eachFieldSize: "ಪ್ರತಿ ಹೊಲದ ಗಾತ್ರ ನಮೂದಿಸಿ (ಎಕರೆಗಳು)", field: "ಹೊಲ", soilType: "ಮಣ್ಣಿನ ಪ್ರಕಾರ", season: "ಋತು",
      water: "ನೀರು / ನೀರಾವರಿ ಲಭ್ಯತೆ", autoDetected: "(ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಪತ್ತೆಯಾಯಿತು)", fromAPI: "(API ಡೇಟಾದಿಂದ)",
      fetchLiveData: "ಲೈವ್ ಹೊಲದ ಪರಿಸ್ಥಿತಿಗಳನ್ನು ತರಿಸಿ", fetchBtn: "ಲೈವ್ API ಡೇಟಾ ತರಿಸಿ", fetching: "ತರಿಸಲಾಗುತ್ತಿದೆ...",
      apiSuccess: "API ನಿಂದ ಲೈವ್ ಡೇಟಾ ತರಿಸಲಾಗಿದೆ", apiManual: "ಕೈಯಾರೆ ಒದಗಿಸಿದ ಮಾಹಿತಿ ಆಧಾರಿತ (API ಬಳಸಿಲ್ಲ)",
      calculating: "ಲೆಕ್ಕ ಹಾಕಲಾಗುತ್ತಿದೆ...", getRecommendations: "ಶಿಫಾರಸುಗಳನ್ನು ಪಡೆಯಿರಿ", backToLand: "ಜಮೀನಿಗೆ ಹಿಂತಿರುಗಿ",
      backToFields: "ಹೊಲಗಳಿಗೆ ಹಿಂತಿರುಗಿ", backToConditions: "ಪರಿಸ್ಥಿತಿಗಳಿಗೆ ಹಿಂತಿರುಗಿ", changeConditions: "ಪರಿಸ್ಥಿತಿಗಳನ್ನು ಬದಲಿಸಿ",
      startOver: "ಮತ್ತೆ ಪ್ರಾರಂಭಿಸಿ", totalLand: "ಒಟ್ಟು ಜಮೀನು", fields: "ಹೊಲಗಳು", soil: "ಮಣ್ಣು", water_label: "ನೀರು",
      location_label: "ಸ್ಥಳ", recommended: "ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ", suitability: "ಸೂಕ್ತತೆ", repeated: "ಪುನರಾವರ್ತಿತ",
      noResultsTitle: "ಸೂಕ್ತ ಬೆಳೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ", noResultsMsg: "ಆಯ್ಕೆಮಾಡಿದ ಸಂಯೋಜನೆಗೆ ಯಾವ ಬೆಳೆಯೂ ಹೊಂದಿಕೊಳ್ಳುವುದಿಲ್ಲ. ಋತು ಅಥವಾ ಮಣ್ಣಿನ ಪ್ರಕಾರ ಬದಲಿಸಲು ಪ್ರಯತ್ನಿಸಿ.",
      cropRepeatedNote: "ಕೆಲವು ಬೆಳೆಗಳು ಪುನರಾವರ್ತಿತವಾಗಿವೆ — ಹೊಲಗಳ ಸಂಖ್ಯೆಗಿಂತ ಕಡಿಮೆ ಅನನ್ಯ ಸೂಕ್ತ ಬೆಳೆಗಳಿವೆ.",
      whyCrop: "ಈ ಬೆಳೆ ಏಕೆ?", cropCare: "ಬೆಳೆ ಆರೈಕೆ", waterReq: "ನೀರಿನ ಅಗತ್ಯ", sowing: "ಬಿತ್ತನೆ", harvest: "ಕೊಯ್ಲು",
      temp: "ತಾಪಮಾನ", fertilizer: "ಗೊಬ್ಬರ", duration: "ಅವಧಿ", apiDataBadge: "ಲೈವ್ ಹವಾಮಾನ/ಮಣ್ಣು API ಡೇಟಾ ಆಧಾರಿತ",
      manualDataBadge: "ಕೈಯಾರೆ ಆಯ್ಕೆ ಆಧಾರಿತ (API ಲಭ್ಯವಿಲ್ಲ)", steps: ["ಜಮೀನು", "ಹೊಲಗಳು", "ಪರಿಸ್ಥಿತಿಗಳು", "ಫಲಿತಾಂಶಗಳು"],
      soilTypes: { loamy: "ಮೆಕ್ಕಲು ಮಣ್ಣು", clay: "ಜೇಡಿ ಮಣ್ಣು", sandy: "ಮರಳು ಮಣ್ಣು", black: "ಕಪ್ಪು ಮಣ್ಣು", red: "ಕೆಂಪು ಮಣ್ಣು", alluvial: "ಮೆಕ್ಕಲು ಮಣ್ಣು" },
      seasons: { kharif: "ಖರೀಫ್ (ಜೂನ್ – ಅಕ್ಟೋಬರ್)", rabi: "ರಬಿ (ನವೆಂಬರ್ – ಮಾರ್ಚ್)", zaid: "ಜಾಯ್ಡ್ (ಮಾರ್ಚ್ – ಜೂನ್)" },
      irrigationOptions: { available: "ಲಭ್ಯವಿದೆ", partial: "ಭಾಗಶಃ ಲಭ್ಯವಿದೆ", not_available: "ಲಭ್ಯವಿಲ್ಲ" },
      previousCrop: "ಹಿಂದಿನ ಬೆಳೆ", irrigation: "ನೀರಾವರಿ ಲಭ್ಯತೆ", getRecommendationsBtn: "ಬೆಳೆ ಶಿಫಾರಸುಗಳನ್ನು ಪಡೆಯಿರಿ",
      splitField: "ಹೊಲ ವಿಭಜಿಸಿ", field1: "ಹೊಲ 1", field2: "ಹೊಲ 2", recommendedFor: "ಗಾಗಿ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ",
      loading: "ನಿಮ್ಮ ಜಮೀನಿಗೆ ಉತ್ತಮ ಬೆಳೆಗಳನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ...", empty: "ಶಿಫಾರಸುಗಳನ್ನು ಪಡೆಯಲು ನಿಮ್ಮ ಹೊಲದ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ."
    },
    diseaseNew: {
      resultTitle: "AI ಬೆಳೆ ಆರೋಗ್ಯ ವಿಶ್ಲೇಷಣೆ", imageType: "ಚಿತ್ರದ ಪ್ರಕಾರ", plantId: "ಸಸ್ಯದ ಗುರುತಿಸುವಿಕೆ", cropType: "ಬೆಳೆಯ ಪ್ರಕಾರ",
      scientificName: "ವೈಜ್ಞಾನಿಕ ಹೆಸರು", pestDetection: "ಕೀಟಗಳ ಪತ್ತೆ", diseaseDetection: "ರೋಗ ಪತ್ತೆ",
      possibleConditions: "ಸಾಧ್ಯವಿರುವ ಪರಿಸ್ಥಿತಿಗಳು", visibleSymptoms: "ಗೋಚರಿಸುವ ಲಕ್ಷಣಗಳು", effectsOnCrop: "ಬೆಳೆಯ ಮೇಲಿನ ಪರಿಣಾಮಗಳು",
      recommendedTreatment: "ಶಿಫಾರಸು ಮಾಡಲಾದ ಚಿಕಿತ್ಸೆ", immediateActions: "ತಕ್ಷಣದ ಕ್ರಮಗಳು", culturalControl: "ಸಾಂಸ್ಕೃತಿಕ ನಿಯಂತ್ರಣ",
      biologicalControl: "ಜೈವಿಕ ನಿಯಂತ್ರಣ", chemicalControl: "ರಾಸಾಯನಿಕ ನಿಯಂತ್ರಣ", safetyWarning: "ಸುರಕ್ಷತಾ ಎಚ್ಚರಿಕೆ",
      confidence: "ವಿಶ್ವಾಸ", severity: "ತೀವ್ರತೆ", suitabilityScore: "ಸೂಕ್ತತೆಯ ಸ್ಕೋರ್"
    },
    weatherNew: {
      locationRequired: "ಸ್ಥಳದ ಅಗತ್ಯವಿದೆ", locationRequiredMsg: "ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಸ್ಥಳವನ್ನು ಪತ್ತೆಹಚ್ಚಲು ಸಾಧ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಸ್ಥಳ ಪ್ರವೇಶವನ್ನು ಅನುಮತಿಸಿ ಮತ್ತು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
      weatherErrorMsg: "ಹವಾಮಾನ ಮಾಹಿತಿಯು ತಾತ್ಕಾಲಿಕವಾಗಿ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ."
    },
    commonNew: { locationDetecting: "ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಪತ್ತೆ ಹಚ್ಚಲಾಗುತ್ತಿದೆ...", acres: "ಎಕರೆಗಳು", back: "ಹಿಂದಕ್ಕೆ" }
  },
  ta: {
    advisor: {
      title: "பயிர் ஆலோசகர்", subtitle: "உங்கள் நிலம் பற்றி சொல்லுங்கள் மற்றும் சிறந்த பயிர் பரிந்துரைகளைப் பெறுங்கள்",
      step1Title: "படி 1 — உங்கள் நிலம்", step2Title: "படி 2 — உங்கள் நிலத்தை பிரிக்கவும்", step3Title: "படி 3 — வயல் நிலைமைகள்", step4Title: "பயிர் பரிந்துரைகள்",
      location: "இடம்", locationPlaceholder: "இடம் (கிராமம் / நகரம்)", landArea: "நில பரப்பளவு (ஏக்கர்கள்)", landAreaPlaceholder: "எ.கா: 2.5",
      latitude: "அட்சரேகை", longitude: "தீர்க்கரேகை", latPlaceholder: "எ.கா: 17.1", lngPlaceholder: "எ.கா: 78.4",
      numFieldsQuestion: "நீங்கள் எத்தனை வயல்களை உருவாக்க விரும்புகிறீர்கள்?", customLabel: "தனிப்பயன்:", customPlaceholder: "எ.கா: 7",
      eachFieldSize: "ஒவ்வொரு வயலின் அளவை உள்ளிடவும் (ஏக்கர்கள்)", field: "வயல்", soilType: "மண் வகை", season: "பருவம்",
      water: "நீர் / நீர்ப்பாசன கிடைக்கும் தன்மை", autoDetected: "(தானாக கண்டறியப்பட்டது)", fromAPI: "(API தரவிலிருந்து)",
      fetchLiveData: "நேரடி வயல் நிலைமைகளைப் பெறவும்", fetchBtn: "நேரடி API தரவைப் பெறவும்", fetching: "பெறப்படுகிறது...",
      apiSuccess: "API இலிருந்து நேரடி தரவு பெறப்பட்டது", apiManual: "கையேட்டில் வழங்கப்பட்ட தகவலின் அடிப்படையில் (API பயன்படுத்தப்படவில்லை)",
      calculating: "கணக்கிடப்படுகிறது...", getRecommendations: "பரிந்துரைகளைப் பெறவும்", backToLand: "நிலத்திற்கு திரும்பு",
      backToFields: "வயல்களுக்கு திரும்பு", backToConditions: "நிலைமைகளுக்கு திரும்பு", changeConditions: "நிலைமைகளை மாற்றவும்",
      startOver: "மீண்டும் தொடங்கவும்", totalLand: "மொத்த நிலம்", fields: "வயல்கள்", soil: "மண்", water_label: "நீர்",
      location_label: "இடம்", recommended: "பரிந்துரைக்கப்பட்டது", suitability: "பொருத்தம்", repeated: "மீண்டும் வந்தது",
      noResultsTitle: "பொருத்தமான பயிர்கள் கிடைக்கவில்லை", noResultsMsg: "தேர்ந்தெடுத்த கலவைக்கு பயிர்கள் இல்லை. பருவம் அல்லது மண் வகையை மாற்ற முயற்சிக்கவும்.",
      cropRepeatedNote: "சில பயிர்கள் மீண்டும் வருகின்றன — வயல்களின் எண்ணிக்கையை விட குறைவான தனித்துவமான பொருத்தமான பயிர்கள் உள்ளன.",
      whyCrop: "இந்த பயிர் ஏன்?", cropCare: "பயிர் பராமரிப்பு", waterReq: "நீர் தேவை", sowing: "விதைப்பு", harvest: "அறுவடை",
      temp: "வெப்பநிலை", fertilizer: "உரம்", duration: "கால அளவு", apiDataBadge: "நேரடி வானிலை/மண் API தரவின் அடிப்படையில்",
      manualDataBadge: "கைமுறை தேர்வின் அடிப்படையில் (API கிடைக்கவில்லை)", steps: ["நிலம்", "வயல்கள்", "நிலைமைகள்", "முடிவுகள்"],
      soilTypes: { loamy: "வண்டல் மண்", clay: "களிமண்", sandy: "மணல் மண்", black: "கருப்பு மண்", red: "சிவப்பு மண்", alluvial: "வண்டல் மண்" },
      seasons: { kharif: "கரீப் (ஜூன் – அக்டோபர்)", rabi: "ரபி (நவம்பர் – மார்ச்)", zaid: "சைத் (மார்ச் – ஜூன்)" },
      irrigationOptions: { available: "கிடைக்கும்", partial: "பகுதியாக கிடைக்கும்", not_available: "கிடைக்காது" },
      previousCrop: "முந்தைய பயிர்", irrigation: "நீர்ப்பாசன கிடைக்கும் தன்மை", getRecommendationsBtn: "பயிர் பரிந்துரைகளைப் பெறவும்",
      splitField: "வயலை பிரிக்கவும்", field1: "வயல் 1", field2: "வயல் 2", recommendedFor: "க்கு பரிந்துரைக்கப்பட்டது",
      loading: "உங்கள் நிலத்திற்கான சிறந்த பயிர்களைக் கண்டறிகிறோம்...", empty: "பரிந்துரைகளைப் பெற உங்கள் வயலின் விவரங்களை உள்ளிடவும்."
    },
    diseaseNew: {
      resultTitle: "AI பயிர் சுகாதார பகுப்பாய்வு", imageType: "படத்தின் வகை", plantId: "தாவர அடையாளம்", cropType: "பயிர் வகை",
      scientificName: "அறிவியல் பெயர்", pestDetection: "பூச்சி கண்டறிதல்", diseaseDetection: "நோய் கண்டறிதல்",
      possibleConditions: "சாத்தியமான நிலைமைகள்", visibleSymptoms: "தெரியும் அறிகுறிகள்", effectsOnCrop: "பயிரின் மீதான விளைவுகள்",
      recommendedTreatment: "பரிந்துரைக்கப்படும் சிகிச்சை", immediateActions: "உடனடி நடவடிக்கைகள்", culturalControl: "கலாச்சார கட்டுப்பாடு",
      biologicalControl: "உயிரியல் கட்டுப்பாடு", chemicalControl: "இரசாயன கட்டுப்பாடு", safetyWarning: "பாதுகாப்பு எச்சரிக்கை",
      confidence: "நம்பிக்கை", severity: "தீவிரம்", suitabilityScore: "பொருத்தமான மதிப்பெண்"
    },
    weatherNew: {
      locationRequired: "இடம் தேவை", locationRequiredMsg: "உங்கள் தற்போதைய இருப்பிடத்தைக் கண்டறிய முடியவில்லை. இருப்பிட அணுகலை அனுமதித்து மீண்டும் முயற்சிக்கவும்.",
      weatherErrorMsg: "வானிலை தகவல் தற்காலிகமாக கிடைக்கவில்லை. மீண்டும் முயற்சிக்கவும்."
    },
    commonNew: { locationDetecting: "உங்கள் இருப்பிடத்தைக் கண்டறிகிறது...", acres: "ஏக்கர்கள்", back: "பின்" }
  },
  mr: {
    advisor: {
      title: "पीक सल्लागार", subtitle: "आपल्या जमिनीबद्दल सांगा आणि सर्वोत्तम पीक शिफारसी मिळवा",
      step1Title: "पायरी 1 — आपली जमीन", step2Title: "पायरी 2 — आपली जमीन विभाजित करा", step3Title: "पायरी 3 — शेताच्या परिस्थिती", step4Title: "पीक शिफारसी",
      location: "ठिकाण", locationPlaceholder: "ठिकाण (गाव / शहर)", landArea: "जमिनीचे क्षेत्रफळ (एकर)", landAreaPlaceholder: "उदा: 2.5",
      latitude: "अक्षांश", longitude: "रेखांश", latPlaceholder: "उदा: 17.1", lngPlaceholder: "उदा: 78.4",
      numFieldsQuestion: "तुम्हाला किती शेते तयार करायची आहेत?", customLabel: "कस्टम:", customPlaceholder: "उदा: 7",
      eachFieldSize: "प्रत्येक शेताचा आकार प्रविष्ट करा (एकर)", field: "शेत", soilType: "मातीचा प्रकार", season: "हंगाम",
      water: "पाणी / सिंचन उपलब्धता", autoDetected: "(आपोआप ओळखले)", fromAPI: "(API डेटावरून)",
      fetchLiveData: "थेट शेताच्या परिस्थिती आणा", fetchBtn: "थेट API डेटा आणा", fetching: "आणले जात आहे...",
      apiSuccess: "API वरून थेट डेटा आणला", apiManual: "हाताने दिलेल्या माहितीवर आधारित (API वापरले नाही)",
      calculating: "गणना केली जात आहे...", getRecommendations: "शिफारसी मिळवा", backToLand: "जमिनीवर परत",
      backToFields: "शेतांवर परत", backToConditions: "परिस्थितींवर परत", changeConditions: "परिस्थिती बदला",
      startOver: "पुन्हा सुरू करा", totalLand: "एकूण जमीन", fields: "शेते", soil: "माती", water_label: "पाणी",
      location_label: "ठिकाण", recommended: "शिफारस केलेले", suitability: "योग्यता", repeated: "पुनरावृत्ती",
      noResultsTitle: "योग्य पिके आढळली नाहीत", noResultsMsg: "निवडलेल्या संयोजनाशी कोणतेही पीक जुळत नाही. हंगाम किंवा मातीचा प्रकार बदलण्याचा प्रयत्न करा.",
      cropRepeatedNote: "काही पिके पुनरावृत्ती झाली आहेत — शेतांच्या संख्येपेक्षा कमी अद्वितीय योग्य पिके आहेत.",
      whyCrop: "हे पीक का?", cropCare: "पीक काळजी", waterReq: "पाण्याची गरज", sowing: "पेरणी", harvest: "कापणी",
      temp: "तापमान", fertilizer: "खत", duration: "कालावधी", apiDataBadge: "थेट हवामान/माती API डेटावर आधारित",
      manualDataBadge: "हाताने निवडीवर आधारित (API अनुपलब्ध)", steps: ["जमीन", "शेते", "परिस्थिती", "निकाल"],
      soilTypes: { loamy: "चिकणमाती", clay: "मातीचे प्रकार", sandy: "वाळूची माती", black: "काळी माती", red: "लाल माती", alluvial: "गाळाची माती" },
      seasons: { kharif: "खरीप (जून – ऑक्टोबर)", rabi: "रबी (नोव्हेंबर – मार्च)", zaid: "जायद (मार्च – जून)" },
      irrigationOptions: { available: "उपलब्ध", partial: "अंशतः उपलब्ध", not_available: "उपलब्ध नाही" },
      previousCrop: "मागील पीक", irrigation: "सिंचन उपलब्धता", getRecommendationsBtn: "पीक शिफारसी मिळवा",
      splitField: "शेत विभाजित करा", field1: "शेत 1", field2: "शेत 2", recommendedFor: "साठी शिफारस केलेले",
      loading: "आपल्या जमिनीसाठी सर्वोत्तम पिके शोधत आहोत...", empty: "शिफारसी मिळवण्यासाठी आपल्या शेताचे तपशील प्रविष्ट करा."
    },
    diseaseNew: {
      resultTitle: "AI पीक आरोग्य विश्लेषण", imageType: "प्रतिमा प्रकार", plantId: "वनस्पती ओळख", cropType: "पीक प्रकार",
      scientificName: "वैज्ञानिक नाव", pestDetection: "कीटक शोध", diseaseDetection: "रोग शोध",
      possibleConditions: "संभाव्य परिस्थिती", visibleSymptoms: "दृश्यमान लक्षणे", effectsOnCrop: "पिकावरील परिणाम",
      recommendedTreatment: "शिफारस केलेले उपचार", immediateActions: "तात्काळ कारवाई", culturalControl: "सांस्कृतिक नियंत्रण",
      biologicalControl: "जैविक नियंत्रण", chemicalControl: "रासायनिक नियंत्रण", safetyWarning: "सुरक्षा चेतावणी",
      confidence: "आत्मविश्वास", severity: "तीव्रता", suitabilityScore: "योग्यता स्कोअर"
    },
    weatherNew: {
      locationRequired: "स्थान आवश्यक", locationRequiredMsg: "आपले वर्तमान स्थान ओळखण्यात अक्षम. कृपया स्थान प्रवेशाची अनुमती द्या आणि पुन्हा प्रयत्न करा.",
      weatherErrorMsg: "हवामान माहिती तात्पुरती अनुपलब्ध आहे. कृपया पुन्हा प्रयत्न करा."
    },
    commonNew: { locationDetecting: "आपले स्थान ओळखत आहे...", acres: "एकर", back: "मागे" }
  }
};

files.forEach(file => {
  const filePath = path.join(localesDir, file);
  const lang = file.split('.')[0];
  
  if (!fs.existsSync(filePath) || !updates[lang]) return;
  
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // Replace advisor completely
  data.advisor = updates[lang].advisor;
  
  // Merge disease
  data.disease = { ...data.disease, ...updates[lang].diseaseNew };
  
  // Merge weather
  data.weather = { ...data.weather, ...updates[lang].weatherNew };
  
  // Merge common
  data.common = { ...data.common, ...updates[lang].commonNew };
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Updated ${file}`);
});
