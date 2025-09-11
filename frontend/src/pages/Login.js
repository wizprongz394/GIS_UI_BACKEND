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
      console.log("Login response:", data); // ✅ Debugging line

      if (response.ok) {
        // Store both username and token
        localStorage.setItem("user", JSON.stringify({ username: username, token: data.access_token }));
        setMessage("Login successful!");
        window.location.href = "/dashboard";
      } else {
        setMessage(data.detail || "Login failed");
      }
    } catch (error) {
      setMessage("Error connecting to server");
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
            LOGIN
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
    backgroundColor: "#013220",
  },
  card: {
    background: "#013220",
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
    color: "#cbe22b",
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
