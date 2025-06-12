const express = require('express');
const path = require('path');
const fs = require('fs');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  const key = process.env.GOOGLE_MAPS_API_KEY || '';
  const html = fs.readFileSync(path.join(__dirname, 'public/index.html'), 'utf8')
    .replace('API_KEY_PLACEHOLDER', key);
  res.send(html);
});

app.get('/api/places', async (req, res) => {
  const { lat, lng, franchise } = req.query;
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const endpoint = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

  try {
    const [existingRaw, rentalRaw] = await Promise.all([
      fetch(`${endpoint}?location=${lat},${lng}&radius=3000&type=cafe&keyword=${franchise}&key=${apiKey}`).then(r => r.json()),
      fetch(`${endpoint}?location=${lat},${lng}&radius=3000&keyword=retail for lease&key=${apiKey}`).then(r => r.json())
    ]);

    const existing = (existingRaw.results || []).map(p => ({
      name: p.name,
      lat: p.geometry.location.lat,
      lng: p.geometry.location.lng
    }));

    const rental = (rentalRaw.results || []).map(p => ({
      name: p.name,
      lat: p.geometry.location.lat,
      lng: p.geometry.location.lng
    }));

    res.json({ existing, rental });

  } catch (e) {
    console.error("Error en /api/places", e);
    res.status(500).send({ error: "Error fetching places" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en el puerto ${PORT}`);
});
