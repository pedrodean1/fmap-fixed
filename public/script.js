let map;
let redMarkers = [], greenMarkers = [], blueMarkers = [];

const requisitos = {
  "Starbucks": {
    distancia: 0.5, tamano: 80, demografia: 10000,
    existentes: [
      { name: "Starbucks Brickell", lat: 25.765391, lng: -80.193296 }
    ]
  }
};

const sugerencias = [
  { lat: 25.768, lng: -80.198 },
  { lat: 25.779, lng: -80.200 },
  { lat: 25.755, lng: -80.230 }
];

const crexiLocales = [
  { name: "Retail Space Downtown", tipo: "Retail", size: 95, lat: 25.7725, lng: -80.1935 },
  { name: "Office Brickell Tower", tipo: "Oficina", size: 160, lat: 25.7643, lng: -80.1901 },
  { name: "Warehouse Doral", tipo: "Industrial", size: 400, lat: 25.8265, lng: -80.3300 }
];

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 25.7617, lng: -80.1918 },
    zoom: 12
  });

  document.getElementById("franchise").addEventListener("change", () => {
    clearMarkers();
    const f = document.getElementById("franchise").value;
    if (!requisitos[f]) return;

    const req = requisitos[f];
    document.getElementById("distancia").innerText = req.distancia;
    document.getElementById("tamano").innerText = req.tamano;
    document.getElementById("demografia").innerText = req.demografia;

    // Mostrar existentes
    req.existentes.forEach(p => {
      const m = new google.maps.Marker({
        position: { lat: p.lat, lng: p.lng },
        map,
        title: p.name,
        icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
      });
      redMarkers.push(m);
    });

    // Mostrar sugerencias
    sugerencias.forEach(p => {
      const m = new google.maps.Marker({
        position: p,
        map,
        title: "Sugerencia",
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 6,
          fillColor: "green",
          fillOpacity: 1,
          strokeWeight: 0
        }
      });
      greenMarkers.push(m);
    });

    // Mostrar locales CREXi (solo Starbucks por ahora)
    if (f === "Starbucks") {
      crexiLocales.forEach(loc => {
        const m = new google.maps.Marker({
          position: { lat: loc.lat, lng: loc.lng },
          map,
          title: loc.name + " (" + loc.tipo + " - " + loc.size + " m²)",
          icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        });
        blueMarkers.push(m);
      });
    }
  });
}

function clearMarkers() {
  [...redMarkers, ...greenMarkers, ...blueMarkers].forEach(m => m.setMap(null));
  redMarkers = []; greenMarkers = []; blueMarkers = [];
}