// ─── Crop Details Dictionary ──────────────────────────────────────────────
// Each crop has its OWN unique image and specific agricultural information.
// Never share images between crops.
export const cropDetails = {

  "Rice": {
    image: "https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&q=80&w=600",
    fallbackImage: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600",
    description: "Rice (Oryza sativa) is the primary staple food for billions. It requires standing water during the growth period and grows best in fertile, water-retentive soils.",
    waterRequirement: "Very High",
    sowingPeriod: "June – July",
    harvestingPeriod: "October – November",
    temperature: "25°C to 35°C",
    fertilizer: "NPK 100:50:50 kg/ha",
    cropCare: "Maintain 5 cm standing water. Apply nitrogen in 3 split doses. Watch for stem borer and blast disease.",
    growingDuration: "120–150 days"
  },

  "Wheat": {
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600",
    fallbackImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=600",
    description: "Wheat is the major Rabi cereal crop providing essential carbohydrates. It thrives in well-drained, fertile soils with assured irrigation.",
    waterRequirement: "Medium to High",
    sowingPeriod: "November – December",
    harvestingPeriod: "March – April",
    temperature: "10°C to 25°C",
    fertilizer: "NPK 120:60:40 kg/ha",
    cropCare: "Irrigate at Crown Root Initiation, tillering, jointing, and booting stages.",
    growingDuration: "120–150 days"
  },

  "Maize": {
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=600",
    fallbackImage: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&q=80&w=600",
    description: "Maize (Corn) is a highly versatile cereal crop grown for grain, fodder, and industrial uses. It adapts to a wide range of soils.",
    waterRequirement: "Medium",
    sowingPeriod: "June – July (Kharif), Oct–Nov (Rabi)",
    harvestingPeriod: "September – November",
    temperature: "21°C to 27°C",
    fertilizer: "NPK 120:60:40 kg/ha",
    cropCare: "Apply nitrogen in 3 split doses. Provide good drainage. Watch for fall armyworm.",
    growingDuration: "90–110 days"
  },

  "Cotton": {
    image: "https://images.unsplash.com/photo-1593349480506-8433634cdcbe?auto=format&fit=crop&q=80&w=600",
    fallbackImage: "https://images.unsplash.com/photo-1627997096645-12cf2c2f6d2b?auto=format&fit=crop&q=80&w=600",
    description: "Cotton is the most important commercial fibre crop — 'white gold'. Deep-rooted; thrives in black soils with high water-retention capacity.",
    waterRequirement: "Medium to High",
    sowingPeriod: "May – July",
    harvestingPeriod: "November – January",
    temperature: "21°C to 30°C",
    fertilizer: "NPK 120:60:60 kg/ha",
    cropCare: "Monitor for bollworm during flowering. Spray Trichoderma for soil-borne diseases.",
    growingDuration: "150–180 days"
  },

  "Soybean": {
    image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&q=80&w=600",
    fallbackImage: "https://images.unsplash.com/photo-1596704179374-2795f5431872?auto=format&fit=crop&q=80&w=600",
    description: "Soybean is a dual-purpose legume providing high-quality protein and oil. Black soil provides excellent moisture retention for optimum growth.",
    waterRequirement: "Medium",
    sowingPeriod: "Late June – Early July",
    harvestingPeriod: "October",
    temperature: "25°C to 30°C",
    fertilizer: "NPK 20:60:40 kg/ha + Rhizobium inoculant",
    cropCare: "Requires well-drained fields. Susceptible to waterlogging. Seed treatment recommended.",
    growingDuration: "90–120 days"
  },

  "Groundnut": {
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=600",
    fallbackImage: "https://images.unsplash.com/photo-1628189851148-35cb31de75b1?auto=format&fit=crop&q=80&w=600",
    description: "Groundnut (Peanut) is an important oilseed and protein crop. It does best in well-drained sandy-loam soils where its pods can penetrate easily.",
    waterRequirement: "Low to Medium",
    sowingPeriod: "June – July (Kharif), Jan – Feb (Zaid)",
    harvestingPeriod: "100–120 days after sowing",
    temperature: "25°C to 35°C",
    fertilizer: "NPK 20:50:30 kg/ha + Gypsum 200 kg/ha",
    cropCare: "Apply gypsum at pegging stage. Weed control critical in first 45 days.",
    growingDuration: "100–120 days"
  },

  "Pearl Millet": {
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=600",
    fallbackImage: "https://images.unsplash.com/photo-1601648764658-cf37e8c89b70?auto=format&fit=crop&q=80&w=600",
    description: "Pearl Millet (Bajra) is the most drought-tolerant cereal. It thrives in the hottest, driest conditions where no other crop can survive.",
    waterRequirement: "Very Low",
    sowingPeriod: "June – July",
    harvestingPeriod: "September – October",
    temperature: "28°C to 36°C",
    fertilizer: "NPK 40:20:0 kg/ha",
    cropCare: "Thin plants 15 days after sowing. Minimal inputs required. Good for dryland farming.",
    growingDuration: "70–90 days"
  },

  "Sorghum": {
    image: "https://images.unsplash.com/photo-1538474705339-e87de81450e8?auto=format&fit=crop&q=80&w=600",
    fallbackImage: "https://images.unsplash.com/photo-1579737118671-6eb1ebff0707?auto=format&fit=crop&q=80&w=600",
    description: "Sorghum (Jowar) is a versatile dryland cereal used for food, fodder, and bioenergy. It withstands both drought and waterlogging.",
    waterRequirement: "Low",
    sowingPeriod: "June – July (Kharif), Oct–Nov (Rabi)",
    harvestingPeriod: "October – November",
    temperature: "25°C to 32°C",
    fertilizer: "NPK 80:40:40 kg/ha",
    cropCare: "Watch for shoot fly at early stage. Apply carbaryl dust if needed.",
    growingDuration: "100–120 days"
  },

  "Chickpea": {
    image: "https://images.unsplash.com/photo-1615485500834-bc10199bc727?auto=format&fit=crop&q=80&w=600",
    fallbackImage: "https://images.unsplash.com/photo-1589139046647-73eb36a928ba?auto=format&fit=crop&q=80&w=600",
    description: "Chickpea (Gram/Chana) is the most important Rabi pulse in India. It grows on stored soil moisture and contributes to soil nitrogen fixation.",
    waterRequirement: "Low",
    sowingPeriod: "October – November",
    harvestingPeriod: "February – March",
    temperature: "20°C to 25°C",
    fertilizer: "NPK 20:40:20 kg/ha",
    cropCare: "One protective irrigation at pod formation. Monitor for Helicoverpa pod borer.",
    growingDuration: "110–130 days"
  },

  "Mustard": {
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=600",
    fallbackImage: "https://images.unsplash.com/photo-1620894548485-6188e63e2634?auto=format&fit=crop&q=80&w=600",
    description: "Mustard (Sarson) is India's second most important oilseed crop. Its bright yellow flowers are a distinctive sight in Rabi fields.",
    waterRequirement: "Low to Medium",
    sowingPeriod: "October",
    harvestingPeriod: "February – March",
    temperature: "15°C to 25°C",
    fertilizer: "NPK 60:40:40 kg/ha + Sulphur 20 kg/ha",
    cropCare: "Apply sulphur for better oil content. Protect from aphid attacks during flowering.",
    growingDuration: "110–140 days"
  },

  "Pigeon Pea": {
    image: "https://images.unsplash.com/photo-1592659341490-6da0a7eecac2?auto=format&fit=crop&q=80&w=600",
    fallbackImage: "https://images.unsplash.com/photo-1617220379006-b7eb38d7e35a?auto=format&fit=crop&q=80&w=600",
    description: "Pigeon Pea (Tur/Arhar) is a long-duration deep-rooted pulse. Excellent for dryland farming; very well suited for intercropping.",
    waterRequirement: "Low to Medium",
    sowingPeriod: "June – July",
    harvestingPeriod: "December – January",
    temperature: "20°C to 30°C",
    fertilizer: "NPK 20:50:20 kg/ha",
    cropCare: "Intercrop with short-duration cereals. Watch for pod fly at maturity.",
    growingDuration: "150–180 days"
  },

  "Cowpea": {
    image: "https://images.unsplash.com/photo-1622928726504-58fcbd57c7e9?auto=format&fit=crop&q=80&w=600",
    fallbackImage: "https://images.unsplash.com/photo-1599368555239-661f43ebf501?auto=format&fit=crop&q=80&w=600",
    description: "Cowpea (Lobia) is a fast-growing, drought-tolerant legume. It is grown for its edible pods, seeds, and as green manure.",
    waterRequirement: "Low",
    sowingPeriod: "June – July (Kharif), Mar–Apr (Zaid)",
    harvestingPeriod: "60–90 days after sowing",
    temperature: "20°C to 30°C",
    fertilizer: "NPK 20:40:20 kg/ha",
    cropCare: "Avoid waterlogging. Excellent as an intercrop or cover crop.",
    growingDuration: "60–90 days"
  },

  "Horse Gram": {
    image: "https://images.unsplash.com/photo-1634467524884-897d0af5e104?auto=format&fit=crop&q=80&w=600",
    fallbackImage: "https://images.unsplash.com/photo-1610444317188-6bb7513ff5ce?auto=format&fit=crop&q=80&w=600",
    description: "Horse Gram (Kulthi) is one of the hardiest legumes in the world. It grows in poor soils under minimal rainfall — ideal for zero-input farming.",
    waterRequirement: "Very Low",
    sowingPeriod: "August – September",
    harvestingPeriod: "November – December",
    temperature: "20°C to 30°C",
    fertilizer: "NPK 10:20:0 kg/ha",
    cropCare: "Almost no care needed. Excellent nitrogen fixer. Harvest promptly to avoid shattering.",
    growingDuration: "90–100 days"
  },

  "Potato": {
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=600",
    fallbackImage: "https://images.unsplash.com/photo-1596119957789-4cf4e5a3eac9?auto=format&fit=crop&q=80&w=600",
    description: "Potato is a crucial tuber crop requiring loose, well-drained soil for tuber expansion. One of the most productive crops per acre.",
    waterRequirement: "Medium",
    sowingPeriod: "October – November",
    harvestingPeriod: "January – February",
    temperature: "15°C to 20°C",
    fertilizer: "NPK 120:80:100 kg/ha",
    cropCare: "Earth up after 35–40 days. Keep soil moist but not waterlogged. Monitor for late blight.",
    growingDuration: "90–120 days"
  },

  "Tomato": {
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=600",
    fallbackImage: "https://images.unsplash.com/photo-1471194402529-8e0f5a675de6?auto=format&fit=crop&q=80&w=600",
    description: "Tomato is the world's most popular vegetable crop. It grows well in well-drained, fertile soils with moderate irrigation. High market demand.",
    waterRequirement: "Medium to High",
    sowingPeriod: "June–July (Kharif), Oct–Nov (Rabi), Feb–Mar (Zaid)",
    harvestingPeriod: "60–80 days after transplanting",
    temperature: "20°C to 27°C",
    fertilizer: "NPK 100:60:60 kg/ha",
    cropCare: "Stake plants for support. Monitor for leaf curl virus and fruit borer. Regular drip irrigation ideal.",
    growingDuration: "90–120 days (transplant to final harvest)"
  },

  "Green Chili": {
    image: "https://images.unsplash.com/photo-1526346698789-22fd84314424?auto=format&fit=crop&q=80&w=600",
    fallbackImage: "https://images.unsplash.com/photo-1572453800999-e8d2d1589b7c?auto=format&fit=crop&q=80&w=600",
    description: "Green Chili (Capsicum annuum) is a high-value spice and vegetable crop. Adapts well to most soil types; requires warm weather and moderate water.",
    waterRequirement: "Medium",
    sowingPeriod: "Jun–Jul (Kharif), Oct–Nov (Rabi)",
    harvestingPeriod: "60–90 days after transplanting",
    temperature: "20°C to 30°C",
    fertilizer: "NPK 75:50:50 kg/ha",
    cropCare: "Regular irrigation at 7–10 day intervals. Monitor for thrips and mites. Mulching helps retain moisture.",
    growingDuration: "70–100 days"
  },

  "Onion": {
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&q=80&w=600",
    fallbackImage: "https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?auto=format&fit=crop&q=80&w=600",
    description: "Onion is an essential vegetable and spice crop with excellent market demand year-round. Alluvial and loamy soils give the best bulb quality.",
    waterRequirement: "Medium",
    sowingPeriod: "October – November (Rabi)",
    harvestingPeriod: "March – May",
    temperature: "13°C to 24°C",
    fertilizer: "NPK 100:50:50 kg/ha",
    cropCare: "Irrigation every 7–10 days. Stop irrigation 15 days before harvest. Watch for purple blotch disease.",
    growingDuration: "130–150 days"
  },

  "Cucumber": {
    image: "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&q=80&w=600",
    fallbackImage: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=600",
    description: "Cucumber is a fast-growing warm-season vegetable crop. Excellent for Zaid season with abundant water and warm temperatures.",
    waterRequirement: "High",
    sowingPeriod: "February – March",
    harvestingPeriod: "April – May",
    temperature: "20°C to 30°C",
    fertilizer: "NPK 50:25:25 kg/ha",
    cropCare: "Provide trellising/staking for better yield. Harvest when fruits are firm and green.",
    growingDuration: "55–75 days"
  },

  "Leafy Vegetables": {
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600",
    fallbackImage: "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&q=80&w=600",
    description: "Leafy vegetables (Spinach, Fenugreek, Coriander, Amaranth) are quick-growing, highly nutritious, and profitable. Suitable for multiple sowings per season.",
    waterRequirement: "Medium",
    sowingPeriod: "Year-round (season-specific varieties)",
    harvestingPeriod: "25–45 days from sowing",
    temperature: "15°C to 28°C",
    fertilizer: "Organic manure 10 t/ha + NPK 40:20:20 kg/ha",
    cropCare: "Frequent light irrigation. Multiple cuttings possible. Avoid pesticide near harvest.",
    growingDuration: "25–45 days per cutting"
  },

  "Watermelon": {
    image: "https://images.unsplash.com/photo-1563114773-84221bd62daa?auto=format&fit=crop&q=80&w=600",
    fallbackImage: "https://images.unsplash.com/photo-1587049352847-4d4fa71dc725?auto=format&fit=crop&q=80&w=600",
    description: "Watermelon is a popular summer Zaid crop requiring plenty of sunshine and consistent moisture. High demand in summer markets.",
    waterRequirement: "High",
    sowingPeriod: "February – March",
    harvestingPeriod: "May – June",
    temperature: "25°C to 35°C",
    fertilizer: "NPK 100:50:50 kg/ha",
    cropCare: "Frequent irrigation but avoid waterlogging. Protect from fruit fly. Harvest when the tendril nearest the fruit dries.",
    growingDuration: "80–100 days"
  },

  "Muskmelon": {
    image: "https://images.unsplash.com/photo-1563541051-cd4a1d78b7e5?auto=format&fit=crop&q=80&w=600",
    fallbackImage: "https://images.unsplash.com/photo-1574676156093-6a3f4e38fb57?auto=format&fit=crop&q=80&w=600",
    description: "Muskmelon is a sweet, aromatic summer crop. Needs warm weather, well-drained soil, and moderate irrigation to produce quality fruits.",
    waterRequirement: "Medium to High",
    sowingPeriod: "February – March",
    harvestingPeriod: "May – June",
    temperature: "25°C to 30°C",
    fertilizer: "NPK 80:40:40 kg/ha",
    cropCare: "Reduce irrigation as fruit matures. Harvest when the fruit separates easily from the vine.",
    growingDuration: "80–100 days"
  },

  "Barley": {
    image: "https://images.unsplash.com/photo-1559181567-c3190ca9d222?auto=format&fit=crop&q=80&w=600",
    fallbackImage: "https://images.unsplash.com/photo-1532009877282-3340270e0529?auto=format&fit=crop&q=80&w=600",
    description: "Barley is a hardy cereal tolerant to salinity and frost. Requires less water than wheat; widely grown in dry Rabi areas.",
    waterRequirement: "Low to Medium",
    sowingPeriod: "October – November",
    harvestingPeriod: "March – April",
    temperature: "12°C to 22°C",
    fertilizer: "NPK 60:30:20 kg/ha",
    cropCare: "Needs good drainage. Tolerant to drought. Harvest before shattering of grain.",
    growingDuration: "100–120 days"
  },

  "Linseed": {
    image: "https://images.unsplash.com/photo-1591170882558-18d58a8c55db?auto=format&fit=crop&q=80&w=600",
    fallbackImage: "https://images.unsplash.com/photo-1596434468641-477c77cde6c5?auto=format&fit=crop&q=80&w=600",
    description: "Linseed (Flaxseed) is grown for both seed (oil) and fiber. It is a cool-season Rabi crop well-suited to rainfed conditions.",
    waterRequirement: "Low",
    sowingPeriod: "October – November",
    harvestingPeriod: "February – March",
    temperature: "10°C to 25°C",
    fertilizer: "NPK 40:20:20 kg/ha",
    cropCare: "Control weeds early. Avoid excess moisture. Harvest when lower capsules turn brown.",
    growingDuration: "120–140 days"
  },

  "Safflower": {
    image: "https://images.unsplash.com/photo-1502047879435-0816f5c8f855?auto=format&fit=crop&q=80&w=600",
    fallbackImage: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&q=80&w=600",
    description: "Safflower is an extremely drought-tolerant oilseed with deep roots. Excellent for black cotton soils under rainfed Rabi conditions.",
    waterRequirement: "Low",
    sowingPeriod: "October – November",
    harvestingPeriod: "March – April",
    temperature: "15°C to 20°C",
    fertilizer: "NPK 40:20:0 kg/ha",
    cropCare: "Wear gloves during harvest due to spines. Very hardy once established.",
    growingDuration: "110–130 days"
  },

  "Lentil": {
    image: "https://images.unsplash.com/photo-1613158562793-96a77cfc8254?auto=format&fit=crop&q=80&w=600",
    fallbackImage: "https://images.unsplash.com/photo-1627997089163-54ecdfa91b48?auto=format&fit=crop&q=80&w=600",
    description: "Lentil (Masoor) is a nutritious cool-season pulse. It grows on residual soil moisture and contributes to soil health through nitrogen fixation.",
    waterRequirement: "Low",
    sowingPeriod: "October – November",
    harvestingPeriod: "February – March",
    temperature: "15°C to 20°C",
    fertilizer: "NPK 20:40:20 kg/ha",
    cropCare: "Weed control is critical in early stages. Avoid heavy irrigation.",
    growingDuration: "100–120 days"
  },

  "Mung Bean": {
    image: "https://images.unsplash.com/photo-1557844352-761f2565b576?auto=format&fit=crop&q=80&w=600",
    fallbackImage: "https://images.unsplash.com/photo-1596001099180-2a8138971fce?auto=format&fit=crop&q=80&w=600",
    description: "Mung Bean (Green Gram/Moong) is a short-duration pulse that fits well into crop rotations. High in protein and quick to mature.",
    waterRequirement: "Low to Medium",
    sowingPeriod: "March – April (Zaid), June–July (Kharif)",
    harvestingPeriod: "55–75 days after sowing",
    temperature: "25°C to 35°C",
    fertilizer: "NPK 20:40:20 kg/ha",
    cropCare: "Harvest promptly when pods mature to prevent shattering. Monitor for yellow mosaic virus.",
    growingDuration: "60–80 days"
  },

  "Moth Bean": {
    image: "https://images.unsplash.com/photo-1596579863751-bc5dde6e0af4?auto=format&fit=crop&q=80&w=600",
    fallbackImage: "https://images.unsplash.com/photo-1600181516264-3ea807fb4448?auto=format&fit=crop&q=80&w=600",
    description: "Moth Bean (Mat Bean) is highly drought-resistant and thrives in the most arid conditions. Ideal for sandy soils with no reliable rainfall.",
    waterRequirement: "Very Low",
    sowingPeriod: "June – July",
    harvestingPeriod: "September",
    temperature: "25°C to 35°C",
    fertilizer: "NPK 10:20:0 kg/ha",
    cropCare: "Minimal care required. An extremely hardy dryland crop.",
    growingDuration: "70–90 days"
  },

  "Cluster Bean": {
    image: "https://images.unsplash.com/photo-1627738668643-284d2a30b9eb?auto=format&fit=crop&q=80&w=600",
    fallbackImage: "https://images.unsplash.com/photo-1622328113702-86ee6225acab?auto=format&fit=crop&q=80&w=600",
    description: "Cluster Bean (Guar) is grown for tender pods as a vegetable, and its seeds are processed for industrial gum. Deep-rooted and drought tolerant.",
    waterRequirement: "Low",
    sowingPeriod: "July",
    harvestingPeriod: "October",
    temperature: "25°C to 30°C",
    fertilizer: "NPK 20:40:20 kg/ha",
    cropCare: "Do not overwater. Well-drained soil is essential. Good for saline conditions.",
    growingDuration: "90–120 days"
  },

  "Vegetables": {
    image: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&q=80&w=600",
    fallbackImage: "https://images.unsplash.com/photo-1595856728076-74fc225fb913?auto=format&fit=crop&q=80&w=600",
    description: "Mixed seasonal vegetables including Brinjal, Capsicum, Bottle Gourd, and Bitter Gourd. Suitable for diverse soils with regular irrigation.",
    waterRequirement: "High",
    sowingPeriod: "Depends on specific vegetable",
    harvestingPeriod: "60–90 days",
    temperature: "15°C to 30°C",
    fertilizer: "Organic manure 10 t/ha + NPK 60:40:40 kg/ha",
    cropCare: "Frequent light irrigation required. Strict pest and disease management.",
    growingDuration: "60–90 days"
  }
};


