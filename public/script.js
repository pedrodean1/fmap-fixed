const locations = {
  "Orlando": { lat: 28.5383, lng: -81.3792 },
  "Miami": { lat: 25.7617, lng: -80.1918 },
  "New York": { lat: 40.7128, lng: -74.0060 }
};

let map;

async function init() {
  const city = document.getElementById('city').value;
  const franchise = document.getElementById('franchise').value;
  const center = locations[city];

  map = new google.maps.Map(document.getElementById('map'), {
    center,
    zoom: 13,
  });

  const resp = await fetch(`/api/places?lat=${center.lat}&lng=${center.lng}&franchise=${franchise}`);
  const { existing, rental } = await resp.json();

  const mkExisting = existing.map(p => ({
    ...p,
    marker: new google.maps.Marker({ position: p, map, icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' })
  }));

  rental.forEach(r => {
    const tooClose = mkExisting.some(e =>
      google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(r.lat, r.lng),
        new google.maps.LatLng(e.lat, e.lng)
      ) < 1000
    );
    if (!tooClose) {
      new google.maps.Marker({
        position: r,
        map,
        icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
      });
    }
  });
}

window.onload = init;
