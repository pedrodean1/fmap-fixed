const express = require('express');
const path = require('path');
const fs = require('fs');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 10000;

// Ruta para servir el HTML con la API Key
app.get('/', (req, res) => {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  const html = fs.readFileSync(path.join(__dirname, 'public/index.html'), 'utf8')
    .replace('API_KEY_PLACEHOLDER', key);
  res.send(html);
});

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para obtener Starbucks y locales en renta
app.get('/api/places', async (req, res) => {
  const { lat, lng } = req.query;
  const googleKey = process.env.GOOGLE_MAPS_API_KEY;
  const baseUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

  try {
    const existing = await fetch(`${baseUrl}?location=${lat},${lng}&radius=3000&type=cafe&keyword=Starbucks&key=${googleKey}`)
      .then(r => r.json());

    const rental = await fetch(`${baseUrl}?location=${lat},${lng}&radius=3000&keyword=retail for lease&key=${googleKey}`)
      .then(r => r.json());

    res.json({
      existing: existing.results.map(p => ({
        name: p.name,
        lat: p.geometry.location.lat,
        lng: p.geometry.location.lng,
        address: p.vicinity
      })),
      rental: rental.results.map(p => ({
        name: p.name,
        lat: p.geometry.location.lat,
        lng: p.geometry.location.lng,
        address: p.vicinity
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching data from Google Places");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
