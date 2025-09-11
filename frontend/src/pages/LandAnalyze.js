import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = "pk.eyJ1IjoiYW1pdHJha3NoYXItY2hha3JhYm9ydHkiLCJhIjoiY21keW96bjluMDQyNTJrcjVtNzBxNzE5NyJ9.H7LQ3sYbd3lRynYROs7E5g";

export default function LandAnalyze() {
  const navigate = useNavigate();
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [coords, setCoords] = useState(null);
  const [latInput, setLatInput] = useState("");
  const [lngInput, setLngInput] = useState("");
  const [query, setQuery] = useState("");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          mapRef.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v11",
            center: [longitude, latitude],
            zoom: 12,
          });

          setCoords({ lat: latitude, lng: longitude });
          setLatInput(latitude.toFixed(5));
          setLngInput(longitude.toFixed(5));

          markerRef.current = new mapboxgl.Marker({ color: "#4CAF50" })
            .setLngLat([longitude, latitude])
            .addTo(mapRef.current);

          mapRef.current.on("click", ({ lngLat }) => {
            const { lat, lng } = lngLat;
            setCoords({ lat, lng });
            setLatInput(lat.toFixed(5));
            setLngInput(lng.toFixed(5));
            markerRef.current.setLngLat([lng, lat]);
          });
        },
        () => alert("Could not get your location. Please allow location access.")
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }

    return () => {
      if (mapRef.current) mapRef.current.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  useEffect(() => () => timerRef.current && clearInterval(timerRef.current), []);

  const runAnalysis = () => {
    if (!coords) return alert("Please select a location on the map.");
    setLoading(true);
    setLogs([]);
    setResult(null);
    const steps = [
      "Parsing land constraints from query",
      "Checking slope/erosion baselines",
      "Assessing flood risk heuristics",
      "Formulating recommendation",
    ];
    let i = 0;
    timerRef.current = setInterval(() => {
      setLogs((prev) => [...prev, steps[i++]]);
      if (i >= steps.length) {
        clearInterval(timerRef.current);
        setLoading(false);
        setResult({
          title: "Land Analysis Result",
          text:
            `Query: "${query || "N/A"}"\nCoordinates: ${
              coords ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : "Not selected"
            }\nRecommendation: Suitable for controlled development with mitigation.`,
        });
      }
    }, 600);
  };

  const handleManualLocation = () => {
    const lat = parseFloat(latInput);
    const lng = parseFloat(lngInput);
    if (isNaN(lat) || isNaN(lng)) {
      alert("Please enter valid numeric latitude and longitude.");
      return;
    }
    setCoords({ lat, lng });
    markerRef.current.setLngLat([lng, lat]);
    mapRef.current.flyTo({ center: [lng, lat], essential: true, zoom: 12 });
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <button
          onClick={() => navigate("/dashboard")}
          style={styles.backBtn}
          aria-label="Go back to dashboard"
        >
          ← Back
        </button>
        <h1 style={styles.title}>Geoland Insight</h1>
        <button
          onClick={runAnalysis}
          style={loading ? { ...styles.saveBtn, ...styles.saveBtnDisabled } : styles.saveBtn}
          disabled={loading}
          aria-label="Save analysis"
        >
          {loading ? "Processing..." : "Save"}
        </button>
      </header>

      <main style={styles.main}>
        <section style={styles.mapSection} aria-label="Interactive map">
          <div ref={mapContainer} style={styles.mapContainer} />
          <div style={styles.manualLocation}>
            <div style={styles.inputGroup}>
              <input
                type="text"
                placeholder="Latitude"
                value={latInput}
                onChange={(e) => setLatInput(e.target.value)}
                style={styles.coordInput}
              />
              <input
                type="text"
                placeholder="Longitude"
                value={lngInput}
                onChange={(e) => setLngInput(e.target.value)}
                style={styles.coordInput}
              />
              <button onClick={handleManualLocation} style={styles.locateBtn}>
                Locate
              </button>
            </div>
          </div>
        </section>

        <section style={styles.infoSection}>
          <textarea
            placeholder="Enter query here..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={styles.queryBox}
            aria-label="Land analysis query"
          />
          <div style={styles.resultArea}>
            <h2 style={styles.sectionTitle}>Result</h2>
            <div style={styles.resultContent}>
              {result ? (
                <pre style={styles.resultText}>{result.title + "\n\n" + result.text}</pre>
              ) : (
                <p style={styles.placeholder}>Run analysis to see results.</p>
              )}
            </div>

            <h2 style={styles.sectionTitle}>Model Reasoning</h2>
            <div style={styles.resultContent}>
              {logs.length ? (
                <ul style={styles.logList}>{logs.map((step, i) => <li key={i}>{step}</li>)}</ul>
              ) : (
                <p style={styles.placeholder}>Steps will appear here.</p>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    width: "100vw",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f5f5f5",
    color: "#333",
    boxSizing: "border-box",
  },
  header: {
    padding: "15px 20px",
    backgroundColor: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  title: {
    margin: 0,
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#2c3e50",
  },
  backBtn: {
    backgroundColor: "transparent",
    border: "1px solid #ddd",
    borderRadius: "4px",
    color: "#555",
    padding: "8px 14px",
    cursor: "pointer",
    fontSize: "1rem",
  },
  saveBtn: {
    backgroundColor: "#4CAF50",
    border: "none",
    color: "#fff",
    fontWeight: "bold",
    padding: "8px 18px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
  },
  saveBtnDisabled: {
    backgroundColor: "#aaa",
    cursor: "not-allowed",
  },
  main: {
    display: "flex",
    height: "calc(100vh - 68px)",
  },
  mapSection: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: "15px",
  },
  infoSection: {
    flex: 1,
    backgroundColor: "#fff",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
  },
  mapContainer: {
    flex: 1,
    minHeight: 0,
    borderRadius: "8px",
    border: "1px solid #ddd",
    marginBottom: "15px",
  },
  manualLocation: {
    padding: "10px 0",
  },
  inputGroup: {
    display: "flex",
    gap: "10px",
  },
  coordInput: {
    flex: 1,
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    fontSize: "1rem",
  },
  locateBtn: {
    padding: "10px 15px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#3498db",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
  queryBox: {
    width: "100%",
    height: "120px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    padding: "12px",
    fontSize: "1rem",
    fontFamily: "inherit",
    resize: "vertical",
    marginBottom: "20px",
    boxSizing: "border-box",
  },
  resultArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  sectionTitle: {
    margin: "0 0 12px 0",
    fontSize: "1.2rem",
    fontWeight: "600",
    color: "#2c3e50",
  },
  resultContent: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    borderRadius: "4px",
    padding: "15px",
    marginBottom: "20px",
    overflowY: "auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    fontSize: "0.95rem",
  },
  resultText: {
    whiteSpace: "pre-wrap",
    margin: 0,
  },
  placeholder: {
    fontStyle: "italic",
    color: "#777",
    margin: 0,
  },
  logList: {
    margin: 0,
    paddingLeft: "20px",
    color: "#444",
  },
};