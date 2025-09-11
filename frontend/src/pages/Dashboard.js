import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleNewChat = () => {
    navigate("/analyze");
  };

  if (!user) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.outerContainer}>
      <div style={styles.container}>
        {/* Left Panel */}
        <aside style={styles.leftPanel}>
          <div style={styles.logo}>GeoLand Insight</div>
          <div style={styles.welcome}>
            <h2 style={styles.welcomeTitle}>Welcome, {user.username}!</h2>
            <p style={styles.welcomeSubtitle}>
              Explore your saved conversations and discover new insights.
            </p>
          </div>
        </aside>

        {/* Right Panel */}
        <main style={styles.rightPanel}>
          <div style={styles.chatCard}>
            <div style={styles.topBar}>
              <input
                type="text"
                placeholder="Search chats..."
                style={styles.searchInput}
              />
              <button
                style={styles.newChatButton}
                onClick={handleNewChat}
              >
                + New Chat
              </button>
            </div>
            <div style={styles.chatList}>
              <p style={styles.noChats}>
                No chats yet. Start by clicking "New Chat".
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

const styles = {
outerContainer: {
    backgroundColor: "#013220",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  container: {
    display: "flex",
    width: "900px",
    maxWidth: "95vw",
    minHeight: "600px",
    background: "#013220",
    borderRadius: "22px",
    overflow: "hidden",
    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
  },
  leftPanel: {
    width: "40%",               // Reduced from 50% to 40%
    backgroundColor: "#013220",
    color: "#cbe22b",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "38px 18px",
    textAlign: "center",
  },
  rightPanel: {
    width: "60%",               // Increased from 50% to 60%
    backgroundColor: "#e8eee2",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "36px 24px",      // More padding to balance visual density
  },
  logo: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "22px",
    letterSpacing: "1px",
  },
  welcome: {
    maxWidth: "220px",
  },
  welcomeTitle: {
    margin: "10px 0 18px 0",
    fontWeight: "bold",
    fontSize: "1.25rem",
    color: "#cbe22b",
  },
  welcomeSubtitle: {
    fontSize: "1rem",
    color: "#e0ebaf",
  },
  chatCard: {
    width: "100%",
    maxWidth: "480px",
    backgroundColor: "#fff",
    borderRadius: "18px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
    padding: "28px 24px",
    display: "flex",
    flexDirection: "column",
    minHeight: "330px",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "22px",
    gap: "10px",
  },
  searchInput: {
    flex: 1,
    padding: "10px 15px",
    borderRadius: "22px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    outline: "none",
    transition: "border-color 0.2s",
    background: "#f7f7fa",
  },
  newChatButton: {
    padding: "10px 22px",
    borderRadius: "22px",
    border: "none",
    backgroundColor: "#013220",
    color: "#cbe22b",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "background 0.2s, color 0.2s",
  },
  chatList: {
    flex: 1,
    minHeight: "180px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  noChats: {
    textAlign: "center",
    color: "#888",
    fontSize: "1.09rem",
    margin: "0",
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    fontSize: "1.2rem",
    color: "#333",
  },
};

export default Dashboard;
