import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icons
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function ClickHandler({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function MapSelector({
  initialZoom = 12,
  height = "60vh",
  onSelect,
}) {
  const [position, setPosition] = useState(null); // start with null
  const [error, setError] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const p = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setPosition(p);
          onSelect?.(p);
        },
        (err) => {
          console.warn("Geolocation error:", err.message);
          setError("Geolocation permission denied or unavailable.");
        },
        { timeout: 10000 }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, [onSelect]);

  if (!position) {
    return (
      <div style={{ height, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {error ? <p>{error}</p> : <p>Loading your location...</p>}
      </div>
    );
  }

  const handleSelect = (pt) => {
    setPosition(pt);
    onSelect?.(pt);
  };

  return (
    <div style={{
      width: "100%",
      height,
      border: "2px solid #ddd",
      borderRadius: "12px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      overflow: "hidden"
    }}>
      <MapContainer
        center={[position.lat, position.lng]}
        zoom={initialZoom}
        style={{ width: "100%", height: "100%" }}
        aria-label="Map for selecting location"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onSelect={handleSelect} />
        <Marker position={[position.lat, position.lng]}>
          <Popup>
            Selected: <b>{position.lat.toFixed(5)}, {position.lng.toFixed(5)}</b>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
