import React, { useState } from "react";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://127.0.0.1:8000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg("✅ Signup successful! You can now login.");
      } else {
        setMsg("❌ " + (data.detail || "Error"));
      }
    } catch (err) {
      setMsg("⚠️ Server error");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        <form onSubmit={handleSignup} style={styles.form}>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Sign up
          </button>
        </form>
        <p style={styles.message}>{msg}</p>
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
    backgroundColor: "#8eecf5",
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
