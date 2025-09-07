import React, { useState, useRef, useEffect } from "react";
import MapSelector from "./MapSelector";
import { useNavigate } from "react-router-dom";

export default function LandAnalyze() {
  const navigate = useNavigate();
  const [coords, setCoords] = useState(null);
  const [query, setQuery] = useState("");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const timerRef = useRef(null);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const runDummy = () => {
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
      setLogs((prev) => [...prev, steps[i]]);
      i++;
      if (i >= steps.length) {
        clearInterval(timerRef.current);
        setLoading(false);
        setResult({
          title: "Land Analysis Result",
          text:
            `Query: "${query || "N/A"}"\n` +
            `Coordinates: ${coords ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : "Not selected"}\n` +
            "Recommendation: Suitable for controlled development with mitigation.",
        });
      }
    }, 600);
  };

  const handleRun = () => {
    if (!coords) {
      alert("Please select a location on the map.");
      return;
    }
    runDummy();
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>🌍 Land Analysis</h1>
          <div>
            <button style={styles.headerBtn} onClick={() => navigate("/dashboard")}>← Back</button>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        <section style={styles.mapSection}>
          <MapSelector
            initialZoom={14}
            height="100%"
            selected={coords}
            onSelect={setCoords}
          />
        </section>

        <section style={styles.infoSection}>
          <div style={styles.inputGroup}>
            <input
              type="text"
              placeholder="Enter query..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={styles.input}
            />
            <button onClick={handleRun} style={styles.runBtn}>
              {loading ? "Running..." : "Run Analysis"}
            </button>
          </div>

          <div style={styles.resultContainer}>
            <h2 style={styles.sectionTitle}>Result</h2>
            {result ? (
              <pre style={styles.resultText}>
                {result.title}

                {result.text}
              </pre>
            ) : (
              <p style={styles.placeholder}>Run analysis to see results.</p>
            )}
          </div>

          <div style={styles.resultContainer}>
            <h2 style={styles.sectionTitle}>Model Reasoning</h2>
            {logs.length > 0 ? (
              <ul style={styles.logList}>
                {logs.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            ) : (
              <p style={styles.placeholder}>Steps will appear here.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f9fafb",
    color: "#333",
  },
  header: {
    backgroundColor: "#26c6da",
    color: "#fff",
    padding: "12px 20px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  headerContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    margin: 0,
    fontSize: "1.5rem",
  },
  headerBtn: {
    backgroundColor: "#ffffffaa",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  main: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },
  mapSection: {
    flex: 2,
    width: "100%",
  },
  infoSection: {
    flex: 1,
    padding: "15px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    overflowY: "auto",
    backgroundColor: "#ffffff",
    boxShadow: "0 -2px 4px rgba(0,0,0,0.05)",
  },
  inputGroup: {
    display: "flex",
    gap: "10px",
  },
  input: {
    flexGrow: 1,
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    outline: "none",
  },
  runBtn: {
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#26c6da",
    color: "#fff",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  resultContainer: {
    backgroundColor: "#f4f6f8",
    padding: "12px 16px",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    overflowY: "auto",
    maxHeight: "200px",
  },
  sectionTitle: {
    margin: "0 0 8px 0",
    fontSize: "1.2rem",
  },
  resultText: {
    whiteSpace: "pre-wrap",
    fontFamily: "monospace",
    fontSize: "0.95rem",
  },
  placeholder: {
    color: "#777",
    fontStyle: "italic",
  },
  logList: {
    margin: 0,
    paddingLeft: "20px",
    fontSize: "0.95rem",
  },
};
