import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Alert, message } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./SignupForm.css";

import UserSignup from "../hooks/userSignup";

const SignupForm = () => {
  const navigate = useNavigate();
  const { error, registerUser } = UserSignup();
  const [name, setName] = useState(""); // Manage form input fields with useState
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [loading, setLoading] = useState(false); // New state for loading

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (loading) return; // Prevent multiple submissions

    const newErrors = {};

    // Validate form fields
    if (!name) {
      newErrors.name = "Full Name is required";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Email is not valid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter";
    } else if (!/[0-9]/.test(password)) {
      newErrors.password =
        "Password must contain at least one numeric character";
    }

    if (!repeatPassword) {
      newErrors.repeatPassword = "Please repeat your password";
    } else if (password !== repeatPassword) {
      newErrors.repeatPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true); // Start loading

    registerUser({ name, email, password })
      .then((res) => {
        if (res) {
          message.success("Registration successful!");
          navigate("/"); // Redirect after successful signup
        }
      })
      .catch((err) => {
        message.error(err.message || "Registration failed!");
      })
      .finally(() => {
        setLoading(false); // Stop loading after request is complete
      });
  };

  const handleInputChange = (field, value, setter) => {
    // Update input field values
    setter(value);
    setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <div className="signup-container">
      <div className="signup-content">
        <div className="left-part">
          <form onSubmit={handleSubmit} className="signup-form">
            <h1>Create your Account</h1>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) =>
                  handleInputChange("name", e.target.value, setName)
                }
                placeholder="Enter your Name"
              />
              {errors.name && <p className="error">{errors.name}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) =>
                  handleInputChange("email", e.target.value, setEmail)
                }
                placeholder="Enter your Email"
              />
              {errors.email && <p className="error">{errors.email}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value, setPassword)
                  }
                  placeholder="Password"
                />
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle-icon"
                />
              </div>
              {errors.password && <p className="error">{errors.password}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="repeatPassword">Repeat Password</label>
              <div className="password-input-container">
                <input
                  type={showRepeatPassword ? "text" : "password"}
                  id="repeatPassword"
                  value={repeatPassword}
                  onChange={(e) =>
                    handleInputChange(
                      "repeatPassword",
                      e.target.value,
                      setRepeatPassword
                    )
                  }
                  placeholder="Repeat Password"
                />
                <FontAwesomeIcon
                  icon={showRepeatPassword ? faEyeSlash : faEye}
                  onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                  className="password-toggle-icon"
                />
              </div>
              {errors.repeatPassword && (
                <p className="error">{errors.repeatPassword}</p>
              )}
            </div>
            {error && (
              <Alert
                message="Error"
                description={error} // Assuming your error state contains a string message
                type="error"
                showIcon
                closable
                className="alert"
              />
            )}
            <button type="submit" className="signup-button" disabled={loading}>
              {loading ? "Signing up..." : "Sign up"}
            </button>
            <p>
              Already have an Account? <Link to="/login">Log in</Link>
            </p>
            <p className="copyrights">
              <img src="/copyright-icon.svg" alt="" />
              GharBanao | All Rights Reserved.
            </p>
          </form>
        </div>
        <div className="right-part">
          <div className="right-part-content">
            <img
              onClick={handleLogoClick}
              className="logo cursor-pointer"
              src="/logo.png"
              alt=""
            />
            <p>
              Ready to begin your home design journey? Sign up now and unlock
              exclusive features!
            </p>
            <img className="pic" src="/signup-image.png" alt="House" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
