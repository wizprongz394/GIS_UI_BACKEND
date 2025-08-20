// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";


function App() {
  return (
    <Router>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.logo}>🌍 GIS Langchain</h1>
          <nav style={styles.nav}>
            <Link to="/signup" style={styles.navLink}>
              Signup
            </Link>
            <Link to="/login" style={styles.navLink}>
              Login
            </Link>
          </nav>
        </header>

        <main style={styles.main}>
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#fef6e4",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    backgroundColor: "#8eecf5",
    padding: "15px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  logo: {
    fontSize: "1.5rem",
    margin: 0,
    color: "#333",
  },
  nav: {
    display: "flex",
    gap: "15px",
  },
  navLink: {
    textDecoration: "none",
    fontWeight: "500",
    color: "#333",
    backgroundColor: "#fff",
    padding: "8px 16px",
    borderRadius: "20px",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  main: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
  },
};

export default App;
