// client/src/components/LoginForm.jsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
// import "./SignupForm.css";
// import "./LoginForm.css";
import { Modal, Input, Steps } from "antd";
const { Step } = Steps;
import { message } from "antd";

import UserLogin from "../hooks/userLogin"; // Import the UserLogin hook

const LoginForm = () => {
  const { error, loginUser } = UserLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetOTP, setResetOTP] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [resetErrors, setResetErrors] = useState({});
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false); // Add loading state

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Email is not valid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({}); // Clear errors if validation passes

    setIsLoggingIn(true); // Start loading state

    // Attempt to log in the user
    const success = await loginUser({ email, password });
    setIsLoggingIn(false); // Stop loading state

    if (success) {
      navigate("/"); // Redirect to the homepage on successful login
    }
  };

  const handleInputChange = (field, value, setter) => {
    setter(value);
    setErrors((prevErrors) => ({ ...prevErrors, [field]: "" })); // Clear error for the field on change
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  // Add these methods
  const handleResetPasswordClick = () => {
    setShowResetModal(true);
    setCurrentStep(0);
  };

  const validatePassword = (password) => {
    const errors = [];
    if (!password) {
      errors.push("New password is required");
      return errors;
    }
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one numeric character");
    }
    return errors;
  };

  const handleSendOTP = async () => {
    if (!resetEmail) {
      setResetErrors({ email: "Email is required" });
      return;
    }

    setIsSendingOTP(true); // Start loading state

    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: resetEmail }),
        }
      );

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(
          data.message === "Failed to send OTP"
            ? "User not found"
            : data.message
        );
      }

      setCurrentStep(1);
      setResetErrors({});
    } catch (error) {
      setResetErrors({ general: error.message });
      alert(error.message);
    } finally {
      setIsSendingOTP(false); // Stop loading state after request completes
    }
  };

  // const handleVerifyOTP = async () => {
  //   if (!resetOTP) {
  //     setResetErrors({ otp: "OTP is required" });
  //     return;
  //   }

  //   setIsVerifyingOTP(true); // Start loading state

  //   try {
  //     const response = await fetch(
  //       "http://localhost:3000/api/auth/verify-reset-otp",
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ email: resetEmail, otp: resetOTP }),
  //       }
  //     );

  //     const data = await response.json();
  //     if (!response.ok) throw new Error(data.message);

  //     setResetToken(data.resetToken);
  //     setCurrentStep(2);
  //     setResetErrors({});
  //     // setResetOTP("");
  //   } catch (error) {
  //     setResetErrors({ otp: error.message });
  //   } finally {
  //     setIsVerifyingOTP(false); // Stop loading state after request completes
  //   }
  // };

  const handleVerifyOTP = async () => {
    if (!resetOTP) {
      setResetErrors({ otp: "OTP is required" });
      return;
    }

    setIsVerifyingOTP(true);

    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/verify-reset-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: resetEmail, otp: resetOTP }),
        }
      );

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong"); // Use backend error message
      }

      setResetToken(data.resetToken);
      setCurrentStep(2);
      setResetErrors({});
    } catch (error) {
      setResetErrors({ otp: "Something went wrong. Please try again." });
      alert(error.message);
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const handlePasswordReset = async () => {
    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      setResetErrors({ password: passwordErrors });
      return;
    }

    setIsResettingPassword(true);

    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            resetToken,
            newPassword,
          }),
        }
      );

      if (!response.ok) throw new Error("Password reset failed");

      message.success("Password reset successfully!");
      setShowResetModal(false);
      setResetErrors({});
      setResetEmail("");
      setResetOTP("");
      setNewPassword("");
    } catch (error) {
      setResetErrors({ general: error.message });
    } finally {
      setIsResettingPassword(false);
    }
  };

  return (
    <div className="signup-container login-container">
      <div className="signup-content">
        <div className="left-part">
          <form onSubmit={handleLogin} className="signup-form">
            <h1>Log in to Your Account</h1>
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
                  placeholder="Enter your Password"
                />
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle-icon"
                />
              </div>
              {errors.password && <p className="error">{errors.password}</p>}
            </div>
            {/* Add the "Forgot Password" link below the password input */}
            <p className="forgot">
              <a
                onClick={handleResetPasswordClick}
                style={{ cursor: "pointer" }}
                className="text-left"
              >
                Forgot Password?
              </a>
            </p>
            {error && (
              <Alert
                message="Error"
                description={error}
                type="error"
                showIcon
                closable
                className="alert"
              />
            )}
            <button
              type="submit"
              className="signup-button"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "Logging in..." : "Log in"}
            </button>
            <p>
              Don't have an Account? <Link to="/signup">Sign up</Link>
            </p>
            <hr className="mt-5 mb-3" />
            <h3 className="text-center">or</h3>
            <hr className="mt-3 mb-5" />
            <p>
              Log in as Vendor? <Link to="/vendor/login">Vendor Log in</Link>
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
              alt="GharBanao Logo"
            />
            <p>Welcome back! Let’s continue building your dream home.</p>
            <img className="login-pic pic" src="/login-image.png" alt="House" />
          </div>
        </div>
      </div>
      {/* Add the modal at the bottom of the return statement */}
      <Modal
        title={
          <h2 className="text-3xl mb-16 text-center font-semibold text-gray-800">
            Reset Password
          </h2>
        }
        open={showResetModal}
        onCancel={() => {
          setShowResetModal(false);
          setResetEmail(""); // Clear email
          setResetOTP(""); // Clear OTP
          setNewPassword(""); // Clear password
          setResetErrors({}); // Clear errors
          setCurrentStep(0); // Reset to first step
        }}
        footer={null}
        centered
        className="p-6 rounded-xl shadow-xl"
      >
        <Steps current={currentStep} className="mb-12">
          <Step title="Enter Email" />
          <Step title="Verify OTP" />
          <Step title="New Password" />
        </Steps>

        {currentStep === 0 && (
          <div className="space-y-4">
            <Input
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="p-2 mb-6 border rounded-md w-full bg-[#46837814]"
            />
            <button
              onClick={handleSendOTP}
              className="w-full bg-[#468378] hover:bg-[#4b9d8e] text-white text-2xl font-medium py-4 rounded-lg transition-all"
              disabled={isSendingOTP}
            >
              {isSendingOTP ? "Sending OTP..." : "Send OTP"}
            </button>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-4">
            <Input
              placeholder="Enter OTP"
              value={resetOTP}
              onChange={(e) => setResetOTP(e.target.value)}
              className="p-2 mb-6 border rounded-md w-full bg-[#46837814]"
            />
            <button
              onClick={handleVerifyOTP}
              className="w-full bg-[#468378] hover:bg-[#4b9d8e] text-white text-2xl font-medium py-4 rounded-lg transition-all"
              disabled={isVerifyingOTP}
            >
              {isVerifyingOTP ? "Verifying OTP..." : "Verify OTP"}
            </button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <Input.Password
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setResetErrors((prev) => ({ ...prev, password: undefined }));
              }}
              className="p-2 mb-6 border rounded-md w-full bg-[#46837814]"
            />
            {/* Password validation errors */}
            {resetErrors.password && (
              <div className="text-red-500 text-base mb-4">
                {resetErrors.password.map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            )}
            <button
              onClick={handlePasswordReset}
              className="w-full bg-[#468378] hover:bg-[#4b9d8e] text-white text-2xl font-medium py-4 rounded-lg transition-all"
              disabled={isResettingPassword}
            >
              {isResettingPassword ? "Resetting Password..." : "Reset Password"}
            </button>
          </div>
        )}

        {/* {resetErrors.general && (
          <p className="text-red-500 text-sm mt-2">{resetErrors.general}</p>
        )} */}
      </Modal>
    </div>
  );
};

export default LoginForm;
