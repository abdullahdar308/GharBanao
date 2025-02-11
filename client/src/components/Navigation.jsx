import React, { useState, useEffect } from "react";
import { Button, Avatar, message } from "antd";
import { UserOutlined, MenuOutlined } from "@ant-design/icons";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../index.css";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Add a state for logout loading

  const navigate = useNavigate();
  const { userData, logout, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    setIsLoggingOut(true); // Show "Logging out..."
    await logout();
    message.success("You have successfully logged out!"); // Show success message
    setIsLoggingOut(false); // Reset button text
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setIsMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <div className="nav-container">
      <div className="nav">
        <img
          onClick={handleLogoClick}
          className="logo cursor-pointer"
          src="/logo.png"
          alt="Logo"
        />
        <button
          className="hamburger-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <MenuOutlined />
        </button>
        <div className={`nav-menu ${isMenuOpen ? "open" : ""}`}>
          <div className="nav-links">
            <Link to="/" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link to="/Design" onClick={() => setIsMenuOpen(false)}>
              Design
            </Link>
            <Link to="/CostEstimation" onClick={() => setIsMenuOpen(false)}>
              Cost Estimation
            </Link>
            <Link to="/Catalogue" onClick={() => setIsMenuOpen(false)}>
              Visit Catalogue
            </Link>
          </div>
          {isAuthenticated ? (
            <div className="user-profile">
              <Avatar className="avatar" size={40} icon={<UserOutlined />} />
              <button onClick={handleLogout}>Log out</button>
            </div>
          ) : (
            <div className="buttons">
              <Link to="/login">
                <button className="login-btn">Log in</button>
              </Link>
              <Link to="/signup">
                <button className="signup-btn">Sign up</button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
