import React, { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.access_token);
        setMessage("✅ Login successful!");
        window.location.href = "/dashboard";
      } else {
        setMessage("❌ " + (data.detail || "Login failed"));
      }
    } catch (error) {
      setMessage("⚠️ Error connecting to server");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
        <p style={styles.message}>{message}</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "80vh",
  },
  card: {
    background: "#fff",
    padding: "40px",
    borderRadius: "15px",
    maxWidth: "400px",
    width: "100%",
    textAlign: "center",
    boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
  },
  title: {
    marginBottom: "20px",
    fontSize: "1.8rem",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    margin: "10px 0",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    fontSize: "1rem",
    outline: "none",
    transition: "0.2s",
  },
  button: {
    marginTop: "15px",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    fontSize: "1rem",
    backgroundColor: "#fbc4ab",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "0.3s",
  },
  message: {
    marginTop: "15px",
    fontSize: "0.9rem",
    color: "#444",
  },
};
