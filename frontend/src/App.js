// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LandAnalyze from "./pages/LandAnalyze";
import "./App.css";

function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

function MainLayout() {
  const location = useLocation();
  const hideHeader = location.pathname !== "/";

  if (hideHeader) {
    return (
      <div className="container">
        <Routes location={location}>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analyze" element={<LandAnalyze />} /> />
        </Routes>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="main">
        <div className="logo">TEAM MISCHIEF MANAGED</div>
        <div className="title">GeoLand Insight</div>
        <div className="buttons">
          <Link to="/login">
            <button className="button">LOGIN</button>
          </Link>
          <Link to="/signup">
            <button className="button">SIGNUP</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;
