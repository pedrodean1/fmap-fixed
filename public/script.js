const center = { lat: 25.7617, lng: -80.1918 }; // Miami
let map;

async function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center,
    zoom: 13,
  });
  loadFranchiseData();
}

async function loadFranchiseData() {
  const franchise = document.getElementById("franchise")?.value || "Starbucks";
  console.log("🔍 Buscando lugares para:", franchise);

  try {
    const url = `/api/places?lat=${center.lat}&lng=${center.lng}&franchise=${franchise}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data.existing || !data.rental) {
      alert("⚠️ No se recibieron datos válidos");
      return;
    }

    data.existing.forEach(p => {
      new google.maps.Marker({
        position: { lat: p.lat, lng: p.lng },
        map,
        title: p.name,
        icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
      });
    });

    data.rental.forEach(p => {
      const isTooClose = data.existing.some(e =>
        google.maps.geometry.spherical.computeDistanceBetween(
          new google.maps.LatLng(e.lat, e.lng),
          new google.maps.LatLng(p.lat, p.lng)
        ) < 500
      );
      if (!isTooClose) {
        new google.maps.Marker({
          position: { lat: p.lat, lng: p.lng },
          map,
          title: p.name,
          icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
        });
      }
    });

  } catch (err) {
    console.error("❌ Error al llamar al backend:", err);
    alert("Error al conectar con el backend.");
  }
}

window.initMap = initMap;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("franchise").addEventListener("change", loadFranchiseData);
});