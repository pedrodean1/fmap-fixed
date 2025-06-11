const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 10000;
const API_KEY = process.env.GOOGLE_API_KEY;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/api/geocode", async (req, res) => {
  const { city } = req.body;
  try {
    const locationRes = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(city)}&key=${API_KEY}`);
    const data = await locationRes.json();
    res.json(data);
  } catch (err) {
    console.error("Geocode error:", err);
    res.status(500).json({ error: "Error fetching geocode" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});