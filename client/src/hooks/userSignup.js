import React, { useState } from "react";
import { message } from "antd";
import { useAuth } from "../contexts/AuthContext";

const UserSignup = () => {
  const { login } = useAuth(); // Destructures the login function
  const [error, setError] = useState(null);

  const registerUser = async ({ name, email, password }) => {
    try {
      setError(null);
      const res = await fetch("http://localhost:3000/api/auth/signup", {
        // Sends a POST request to the signup server endpoint (authRoute.js)
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (res.status === 201) {
        message.success(data.message);
        login(data.token, data.user); // Log in the user after successful signup
        return data; // Return data to indicate success
      } else if (res.status === 400) {
        setError("User already exists for this email!");
        message.error("User already exists for this email!");
      } else {
        setError("Registration failed");
        message.error("Registration failed");
      }
    } catch (error) {
      setError(error.message);
      message.error(error.message);
    }
  };

  return { error, registerUser };
};

export default UserSignup;
