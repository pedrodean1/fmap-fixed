const center = { lat: 28.5383, lng: -81.3792 }; // Orlando
let map;

async function initMap() {
  console.log("✅ initMap() fue llamado");

  map = new google.maps.Map(document.getElementById("map"), {
    center,
    zoom: 13,
  });

  const franchise = document.getElementById("franchise")?.value || "Starbucks";
  console.log("🔍 Buscando lugares para:", franchise);

  try {
    const url = `/api/places?lat=${center.lat}&lng=${center.lng}&franchise=${franchise}`;
    console.log("🌐 Llamando a:", url);
    const res = await fetch(url);
    const data = await res.json();

    console.log("📦 Respuesta del backend:", data);

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
    console.error("❌ ERROR al llamar al backend:", err);
    alert("Error al conectar con el backend.");
  }
}
