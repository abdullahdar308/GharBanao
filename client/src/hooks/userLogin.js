// client/src/hooks/userLogin.js
import React, { useState } from "react";
import { message } from "antd";
import { useAuth } from "../contexts/AuthContext";

const UserLogin = () => {
  const { login } = useAuth(); // This should handle storing the token and user data in your auth context
  const [error, setError] = useState(null);

  const loginUser = async ({ email, password }) => {
    try {
      setError(null);
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.status === 200) {
        message.success("Login successful!");
        login(data.token, data.user); // Save the token and user info to your auth context
        return data; // Indicate successful login
      } else {
        setError(data.message || "Login failed");
        message.error(data.message || "Login failed");
      }
    } catch (error) {
      setError(error.message);
      message.error(error.message);
    }
  };

  return { error, loginUser };
};

export default UserLogin;
