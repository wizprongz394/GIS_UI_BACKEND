// MapSelector.js
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

// Set your Mapbox access token here
mapboxgl.accessToken =
  "Ypk.eyJ1IjoiYW1pdHJha3NoYXItY2hha3JhYm9ydHkiLCJhIjoiY21keW96bjluMDQyNTJrcjVtNzBxNzE5NyJ9.H7LQ3sYbd3lRynYROs7E5g"; // 🔑 Replace with your key

export default function MapSelector({ initialZoom = 12, height = "100%", onSelect }) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (!mounted) return;
          const userLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setPosition(userLoc);
          if (onSelect) onSelect(userLoc);
        },
        () => {
          setError("Geolocation permission denied or unavailable.");
        },
        { timeout: 10000 }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
    return () => { mounted = false; };
  }, [onSelect]);

  useEffect(() => {
    if (!mapContainer.current || !position) return;
    if (mapRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [position.lng, position.lat],
      zoom: initialZoom
    });

    markerRef.current = new mapboxgl.Marker({ color: "#26c6da" })
      .setLngLat([position.lng, position.lat])
      .addTo(mapRef.current);

    mapRef.current.on("click", (e) => {
      const lng = e.lngLat.lng;
      const lat = e.lngLat.lat;
      const newPos = { lat, lng };
      setPosition(newPos);
      if (onSelect) onSelect(newPos);
      markerRef.current.setLngLat([lng, lat]);
    });

    return () => {
      mapRef.current.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, [position, initialZoom, onSelect]);

  if (!position) {
    return (
      <div style={{
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "2px solid #ddd",
        borderRadius: "12px",
        background: "#f9fafb"
      }}>
        {error ? <p>{error}</p> : <p>Loading location...</p>}
      </div>
    );
  }

  return (
    <div style={{
      width: "100%",
      height,
      border: "2px solid #ddd",
      borderRadius: "12px",
      overflow: "hidden",
      position: "relative"
    }}>
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
      <div style={{
        position: "absolute",
        bottom: 12,
        right: 16,
        background: "#fff",
        borderRadius: "8px",
        padding: "4px 12px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        fontSize: "0.85rem",
        fontWeight: "bold"
      }}>
        {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
      </div>
    </div>
  );
}
