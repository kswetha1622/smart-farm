const fs = require('fs');

const cropsMap = {
  "Rice": "Rice",
  "Wheat": "Wheat",
  "Maize": "Maize",
  "Cotton": "Cotton",
  "Soybean": "Soybean",
  "Groundnut": "Peanut",
  "Pearl Millet": "Pearl millet",
  "Sorghum": "Commercial sorghum",
  "Chickpea": "Chickpea",
  "Mustard": "Mustard",
  "Pigeon Pea": "Pigeon pea",
  "Cowpea": "Cowpea",
  "Horse Gram": "Macrotyloma uniflorum",
  "Potato": "Potato",
  "Lentil": "Lentil",
  "Barley": "Barley",
  "Safflower": "Safflower",
  "Linseed": "Flax",
  "Mung Bean": "Mung bean",
  "Moth Bean": "Vigna aconitifolia",
  "Cluster Bean": "Guar",
  "Watermelon": "Watermelon",
  "Muskmelon": "Muskmelon",
  "Cucumber": "Cucumber",
  "Tomato": "Tomato",
  "Green Chili": "Chili pepper",
  "Onion": "Onion",
  "Leafy Vegetables": "Leaf vegetable"
};

const delay = ms => new Promise(r => setTimeout(r, ms));

async function getImages() {
  const map = {};
  for(let [dbName, wikiName] of Object.entries(cropsMap)) {
    try {
      const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(wikiName)}&prop=pageimages&format=json&pithumbsize=800`);
      const data = await res.json();
      const pages = data.query.pages;
      const pageId = Object.keys(pages)[0];
      if (pages[pageId].thumbnail) {
        map[dbName] = pages[pageId].thumbnail.source;
      } else {
        map[dbName] = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/600px-No_image_available.svg.png';
      }
    } catch(e) {
      console.log('Error on', dbName);
    }
    await delay(200); // 200ms delay to avoid rate limit
  }
  fs.writeFileSync('wiki_images.json', JSON.stringify(map, null, 2));
  console.log("Done successfully.");
}
getImages();
