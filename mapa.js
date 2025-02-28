// Coordenadas iniciales
var centro = [4.570438, -74.143926]; 

// Inicializar el mapa centrado en las coordenadas
var map = L.map("map").setView(centro, 14);

// Agregar capa base
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

// Agregar herramientas de dibujo con Geoman
map.pm.addControls({
    position: 'topleft',
    drawCircle: false, // Ocultar círculo
    drawCircleMarker: false, // Ocultar marcador circular
    editControls: true // Permitir edición
});

// Función para cargar y filtrar los árboles
document.getElementById("arboles").addEventListener("click", function () {
    fetch("https://drive.google.com/uc?export=download&id=1hEJKtYmZYiKAyCAZovhbWnJXPzXduirE")
        .then(response => response.json())
        .then(data => {
            // Remover capa anterior si existe
            if (window.arbolesLayer) {
                map.removeLayer(window.arbolesLayer);
            }

            // Filtrar los árboles dentro de un radio de 3 km
            var arbolesFiltrados = {
                type: "FeatureCollection",
                features: data.features.filter(feature => {
                    var coords = feature.geometry.coordinates;
                    var distancia = turf.distance(turf.point(centro), turf.point([coords[1], coords[0]]), { units: 'kilometers' });
                    return distancia <= 3;
                })
            };

            // Agregar capa GeoJSON al mapa
            window.arbolesLayer = L.geoJSON(arbolesFiltrados, {
                pointToLayer: function (feature, latlng) {
                    return L.circleMarker(latlng, {
                        radius: 6,
                        fillColor: "green",
                        color: "#fff",
                        weight: 1,
                        opacity: 1,
                        fillOpacity: 0.8
                    });
                }
            }).addTo(map);

            map.fitBounds(window.arbolesLayer.getBounds());
        })
        .catch(error => console.error("Error cargando el GeoJSON:", error));
});
