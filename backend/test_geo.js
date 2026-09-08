const axios = require('axios');
const geoKey = 'ac1dc74fbfd14bd58dd2f205d60d5f4e'; 
const lat = 17.4239; 
const lon = 78.4738;
axios.get('https://api.geoapify.com/v1/geocode/reverse?lat=' + lat + '&lon=' + lon + '&apiKey=' + geoKey)
  .then(r => {
     console.log(JSON.stringify(r.data.features[0].properties, null, 2));
  }).catch(e => console.log(e.message));
