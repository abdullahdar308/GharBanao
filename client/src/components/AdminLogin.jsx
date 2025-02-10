import React, { useState } from "react";
import { Alert } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
// import "./AdminLogin.css";
import "./SignupForm.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { loginAdmin } = useAuth();
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      if (
        adminEmail === "admin@gharbanao.com" &&
        adminPassword === "admin@2024"
      ) {
        loginAdmin("dummyAdminToken");
        console.log("Admin Logged In");
        navigate("/superadmin/viewVendors");
      } else {
        throw new Error("Invalid admin credentials");
      }
    } catch (error) {
      setError(error.message || "Failed to log in");
    }
  };

  return (
    <div className="signup-container admin-login-container">
      <div className="signup-content">
        <div className="left-part">
          <form onSubmit={handleLogin} className="admin-login-form">
            <h1>Admin Login</h1>
            <div className="form-group">
              <label htmlFor="adminEmail">Email</label>
              <input
                type="email"
                id="adminEmail"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="Enter admin email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="adminPassword">Password</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="adminPassword"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter admin password"
                />
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle-icon"
                />
              </div>
            </div>
            {error && (
              <Alert
                message="Error"
                description={error}
                type="error"
                showIcon
              />
            )}
            <button type="submit" className="signup-button admin-login-button">
              Log In
            </button>
            <p className="copyrights">
              <img src="/copyright-icon.svg" alt="" />
              GharBanao | All Rights Reserved.
            </p>
          </form>
        </div>
        <div className="right-part">
          <div className="right-part-content">
            <img className="logo" src="/logo.png" alt="" />
            <img className="login-pic pic" src="/login-image.png" alt="House" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
