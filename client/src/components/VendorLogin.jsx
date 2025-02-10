import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SignupForm.css";
import "./LoginForm.css";

const VendorLogin = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setErrors({ email: "Invalid email format" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:3000/api/vendor/send-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setOtpSent(true);
      setErrors({});
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setErrors({ otp: "OTP must be 6 digits" });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:3000/api/vendor/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email, // Ensure email is included
            otp: otp, // Key must match backend expectation
          }),
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "OTP verification failed");

      localStorage.setItem("vendorToken", data.token); // Save token
      console.log("Vendor token stored:", data.token);
      // Redirect on success
      navigate("/vendor/dashboard");
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <div className="signup-container login-container">
      <div className="signup-content flex-row-reverse">
        <div className="left-part">
          <form
            onSubmit={otpSent ? handleVerifyOTP : handleSendOTP}
            className="signup-form"
          >
            <h1>Vendor Log in</h1>

            {!otpSent ? (
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your Email"
                />
                {errors.email && <p className="error">{errors.email}</p>}
              </div>
            ) : (
              <div className="form-group">
                <label htmlFor="otp">Enter OTP</label>
                <input
                  type="number"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                />
                {errors.otp && <p className="error">{errors.otp}</p>}
              </div>
            )}

            {errors.general && <p className="error">{errors.general}</p>}

            <button type="submit" className="signup-button" disabled={loading}>
              {loading ? "Processing..." : otpSent ? "Verify OTP" : "Send OTP"}
            </button>

            {/* Rest of your existing JSX */}
          </form>
        </div>
        {/* Right part remains same */}
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
    </div>
  );
};

export default VendorLogin;
