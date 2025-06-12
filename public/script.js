const locations = {
  "Orlando": { lat: 28.5383, lng: -81.3792 }
};

let map;

async function init() {
  const franchise = document.getElementById("franchise").value;
  const center = locations["Orlando"];

  map = new google.maps.Map(document.getElementById("map"), {
    center,
    zoom: 13,
  });

  try {
    const res = await fetch(`/api/places?lat=${center.lat}&lng=${center.lng}&franchise=${franchise}`);
    const data = await res.json();

    data.existing.forEach(place => {
      new google.maps.Marker({
        position: { lat: place.lat, lng: place.lng },
        map,
        title: place.name,
        icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
      });
    });

    data.rental.forEach(place => {
      const isTooClose = data.existing.some(existing =>
        google.maps.geometry.spherical.computeDistanceBetween(
          new google.maps.LatLng(existing.lat, existing.lng),
          new google.maps.LatLng(place.lat, place.lng)
        ) < 1000
      );
      if (!isTooClose) {
        new google.maps.Marker({
          position: { lat: place.lat, lng: place.lng },
          map,
          title: place.name,
          icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
        });
      }
    });

  } catch (err) {
    console.error("Error al cargar datos del backend:", err);
    alert("No se pudieron cargar los datos del mapa.");
  }
}
