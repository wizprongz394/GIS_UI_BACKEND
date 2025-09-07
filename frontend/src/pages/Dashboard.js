import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [loadingLand, setLoadingLand] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetch("http://127.0.0.1:8000/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setUser(data.username))
      .catch(() => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      });

    // Simulated data loads (later replaced by API calls)
    setTimeout(() => setLoadingWeather(false), 1200);
    setTimeout(() => setLoadingLand(false), 1500);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome, {user} 👋</h2>
        <p style={styles.subtitle}>Your personalized GIS + AI dashboard</p>

        {/* Feature cards row */}
        <div style={styles.featuresRow}>
          {/* Weather Data Section */}
          <div style={styles.featureCard}>
            <h3 style={styles.sectionTitle}>🌦 Weather Data</h3>
            {loadingWeather ? (
              <p style={styles.loading}>Fetching latest weather...</p>
            ) : (
              <>
                <p style={styles.sectionText}>
                  Current preview: <b>25°C</b>, partly cloudy with light winds.
                </p>
                <span style={styles.badge}>Live</span>
                <p style={styles.meta}>Updated: just now</p>
                <button
                  style={styles.linkBtn}
                  onClick={() => (window.location.href = "/analyze/weather")}
                >
                  Analyze →
                </button>
              </>
            )}
          </div>

          {/* Land Data Section */}
          <div style={styles.featureCard}>
            <h3 style={styles.sectionTitle}>🌍 Land Data</h3>
            {loadingLand ? (
              <p style={styles.loading}>Loading land analysis...</p>
            ) : (
              <>
                <p style={styles.sectionText}>
                  Quick insight: <b>Area stable</b>, low flood risk (demo data).
                </p>
                <span style={{ ...styles.badge, background: "#caffbf" }}>
                  Ready
                </span>
                <p style={styles.meta}>Updated: just now</p>
                <button
                  style={styles.linkBtn}
                  onClick={() => (window.location.href = "/analyze/land")}
                >
                  Analyze →
                </button>
              </>
            )}
          </div>
        </div>

        <button onClick={handleLogout} style={styles.logoutBtn}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "90vh",
    backgroundColor: "#fef6e4",
    padding: "20px",
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "15px",
    width: "90%",
    maxWidth: "1000px",
    textAlign: "center",
    boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "10px",
    color: "#333",
  },
  subtitle: {
    color: "#555",
    marginBottom: "30px",
  },
  featuresRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "30px",
  },
  featureCard: {
    background: "#fafafa",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    textAlign: "center",
    transition: "transform 0.25s ease",
  },
  featureCardHover: {
    transform: "scale(1.02)",
  },
  sectionTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    marginBottom: "10px",
    color: "#333",
  },
  sectionText: {
    color: "#555",
    marginBottom: "10px",
  },
  badge: {
    display: "inline-block",
    marginTop: "10px",
    padding: "5px 12px",
    background: "#ffd6a5",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: "bold",
    color: "#333",
  },
  meta: {
    fontSize: "0.75rem",
    color: "#888",
    marginTop: "8px",
  },
  loading: {
    color: "#999",
    fontStyle: "italic",
  },
  linkBtn: {
    marginTop: "12px",
    padding: "10px 16px",
    borderRadius: 10,
    border: "1px solid #ddd",
    background: "#fff",
    cursor: "pointer",
    fontWeight: 600,
    transition: "0.3s",
  },
  logoutBtn: {
    marginTop: "10px",
    padding: "12px 24px",
    border: "none",
    borderRadius: "10px",
    background: "#f28482",
    color: "white",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s",
  },
};
