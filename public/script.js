const center = { lat: 28.5383, lng: -81.3792 }; // Orlando
let map;

async function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center,
    zoom: 13,
  });

  try {
    const franchise = document.getElementById("franchise")?.value || "Starbucks";
    const res = await fetch(`/api/places?lat=${center.lat}&lng=${center.lng}&franchise=${franchise}`);
    const { existing, rental } = await res.json();

    existing.forEach(p => {
      new google.maps.Marker({
        position: { lat: p.lat, lng: p.lng },
        map,
        title: p.name,
        icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
      });
    });

    rental.forEach(p => {
      const isTooClose = existing.some(e =>
        google.maps.geometry.spherical.computeDistanceBetween(
          new google.maps.LatLng(e.lat, e.lng),
          new google.maps.LatLng(p.lat, p.lng)
        ) < 1000
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
    console.error("Error:", err);
    alert("Error cargando ubicaciones del backend.");
  }
}