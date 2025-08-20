import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState(null);

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
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome, {user} 🎉</h2>
        <p style={styles.subtitle}>Your personalized GIS + AI dashboard</p>

        {/* Features Section */}
        <div style={styles.featuresRow}>
          <div style={styles.featureCard}>
            <h3>🗺️ GIS Data</h3>
            <p>Integration with spatial datasets.</p>
            <span style={styles.badge}>Coming Soon</span>
          </div>
          <div style={styles.featureCard}>
            <h3>🤖 AI Queries</h3>
            <p>Ask questions and get insights powered by AI.</p>
            <span style={styles.badge}>Coming Soon</span>
          </div>
          <div style={styles.featureCard}>
            <h3>📍 Interactive Maps</h3>
            <p>Visualize and explore geospatial data.</p>
            <span style={styles.badge}>Coming Soon</span>
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
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "30px",
  },
  featureCard: {
    flex: "1",
    minWidth: "250px",
    background: "#fafafa",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    textAlign: "center",
    transition: "transform 0.3s ease",
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
