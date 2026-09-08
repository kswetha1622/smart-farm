import fs from 'fs';

const wikiImages = {
  "Rice": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/20201102.Hengnan.Hybrid_rice_Sanyou-1.6.jpg/960px-20201102.Hengnan.Hybrid_rice_Sanyou-1.6.jpg",
  "Wheat": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Vehn%C3%A4pelto_6.jpg/960px-Vehn%C3%A4pelto_6.jpg",
  "Maize": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Zea_mays_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-283.jpg/800px-Zea_mays_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-283.jpg",
  "Cotton": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/CottonPlant.JPG/960px-CottonPlant.JPG",
  "Soybean": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Soybean.USDA.jpg/800px-Soybean.USDA.jpg",
  "Groundnut": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Arachis_hypogaea_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-163.jpg/960px-Arachis_hypogaea_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-163.jpg",
  "Pearl Millet": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Grain_millet%2C_early_grain_fill%2C_Tifton%2C_7-3-02.jpg/960px-Grain_millet%2C_early_grain_fill%2C_Tifton%2C_7-3-02.jpg",
  "Sorghum": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Sorghum.jpg/800px-Sorghum.jpg",
  "Chickpea": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Chickpea_BNC.jpg/960px-Chickpea_BNC.jpg",
  "Mustard": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Mustard_crop.jpg/800px-Mustard_crop.jpg",
  "Pigeon Pea": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Cajanus_cajan.jpg/800px-Cajanus_cajan.jpg",
  "Cowpea": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Lobia.jpg/800px-Lobia.jpg",
  "Horse Gram": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Horse_gram.JPG/800px-Horse_gram.JPG",
  "Potato": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Patates.jpg/960px-Patates.jpg",
  "Lentil": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Lentils_in_bowl.jpg/800px-Lentils_in_bowl.jpg",
  "Barley": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Barley_%28Hordeum_vulgare%29_-_United_States_National_Arboretum_-_24_May_2009.jpg/960px-Barley_%28Hordeum_vulgare%29_-_United_States_National_Arboretum_-_24_May_2009.jpg",
  "Safflower": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Safflower.jpg/800px-Safflower.jpg",
  "Linseed": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/K%C3%B6hler%27s_Medizinal-Pflanzen_in_naturgetreuen_Abbildungen_mit_kurz_erl%C3%A4uterndem_Texte_%28Plate_16%29_BHL303594.jpg/960px-K%C3%B6hler%27s_Medizinal-Pflanzen_in_naturgetreuen_Abbildungen_mit_kurz_erl%C3%A4uterndem_Texte_%28Plate_16%29_BHL303594.jpg",
  "Mung Bean": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Mung_beans.jpg/800px-Mung_beans.jpg",
  "Moth Bean": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Matki.JPG/800px-Matki.JPG",
  "Cluster Bean": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Guar_beans.jpg/800px-Guar_beans.jpg",
  "Watermelon": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Taiwan_2009_Tainan_City_Organic_Farm_Watermelon_FRD_7962.jpg/960px-Taiwan_2009_Tainan_City_Organic_Farm_Watermelon_FRD_7962.jpg",
  "Muskmelon": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Muskmelon.jpg/800px-Muskmelon.jpg",
  "Cucumber": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/ARS_cucumber.jpg/960px-ARS_cucumber.jpg",
  "Tomato": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Tomato_je.jpg/800px-Tomato_je.jpg",
  "Green Chili": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Madame_Jeanette_and_other_chillies.jpg/960px-Madame_Jeanette_and_other_chillies.jpg",
  "Onion": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Onion_on_White.JPG/800px-Onion_on_White.JPG",
  "Leafy Vegetables": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Spinach_leaves.jpg/960px-Spinach_leaves.jpg"
};

const file = 'src/data/cropSuitability.js';
let content = fs.readFileSync(file, 'utf-8');

for (const [name, url] of Object.entries(wikiImages)) {
  const regex = new RegExp(`name:\\s*"${name}",\\s*image:\\s*"[^"]*",\\s*fallbackImage:\\s*"[^"]*"`, 'g');
  content = content.replace(regex, `name: "${name}",\n    image: "${url}",\n    fallbackImage: "${url}"`);
}

fs.writeFileSync(file, content);
console.log('Images updated successfully');
