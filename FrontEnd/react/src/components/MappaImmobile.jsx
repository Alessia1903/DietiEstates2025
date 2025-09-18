// FrontEnd/react/src/components/MappaImmobile.jsx
import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";


const MappaImmobile = ({ indirizzo, citta, comune, onClose }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Costruisci la query di ricerca con indirizzo completo (incluso numero civico se presente)
    const query = encodeURIComponent(`${indirizzo}, ${comune}, ${citta}, Italia`);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          // Crea la mappa
          if (L && mapRef.current) {
            // Rimuovi eventuale mappa precedente
            if (mapRef.current._leaflet_id) {
              mapRef.current._leaflet_id = null;
              mapRef.current.innerHTML = "";
            }
            const map = L.map(mapRef.current).setView([lat, lon], 16);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);
            L.marker([lat, lon]).addTo(map);
          }
        } else if (mapRef.current) {
          mapRef.current.innerHTML = "<div style='color:red'>Indirizzo non trovato</div>";
        }
      });
  }, [indirizzo, citta, comune]);

  return (
    <div style={{ width: "100%", height: "400px", position: "relative" }}>
      <div ref={mapRef} style={{ width: "100%", height: "100%", borderRadius: "10px" }} />
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 1000,
          background: "#fff",
          border: "1px solid #ccc",
          borderRadius: "6px",
          padding: "6px 12px",
          cursor: "pointer"
        }}
      >
        Chiudi
      </button>
    </div>
  );
};

export default MappaImmobile;
