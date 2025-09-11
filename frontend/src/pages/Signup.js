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
        setMsg("Signup successful! You can now login.");
      } else {
        setMsg(data.detail || "Error");
      }
    } catch (err) {
      setMsg("Server error");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        <form onSubmit={handleSignup} style={styles.form}>
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
            SIGN UP
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
    backgroundColor: "#013220", // Dark green background
  },
  card: {
    background: "#013220", // Match background for uniformity
    padding: "40px",
    borderRadius: "20px",
    maxWidth: "400px",
    width: "100%",
    textAlign: "center",
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
  },
  title: {
    marginBottom: "40px",
    fontSize: "2.5rem",
    color: "#cbe22b", // Lime green title
    fontWeight: "bold",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    margin: "10px 0",
    padding: "15px",
    borderRadius: "30px",
    border: "1px solid #cbe22b",
    fontSize: "1.1rem",
    outline: "none",
    backgroundColor: "#f1f1f1",
    transition: "0.2s",
  },
  button: {
    marginTop: "25px",
    padding: "15px",
    borderRadius: "30px",
    border: "none",
    fontSize: "1.2rem",
    backgroundColor: "#cbe22b",
    color: "#013220",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "transform 0.2s, background-color 0.3s",
  },
  message: {
    marginTop: "20px",
    fontSize: "1rem",
    color: "#cbe22b",
  },
};
