// client/src/contexts/AuthContext.js

import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing user authentication data in localStorage
    const storedData = JSON.parse(localStorage.getItem("user_data"));
    if (storedData && storedData.userToken && storedData.user) {
      setToken(storedData.userToken);
      setUserData(storedData.user);
      setIsAuthenticated(true);
    }

    // ✅ Fix: Ensure isAdminAuthenticated is set on reload
    const adminStoredData = JSON.parse(localStorage.getItem("admin_data"));
    if (adminStoredData && adminStoredData.adminToken) {
      setIsAdminAuthenticated(true);
    }
  }, []);

  const login = (newToken, newData) => {
    localStorage.setItem(
      "user_data",
      JSON.stringify({
        userToken: newToken,
        user: {
          id: newData._id, // Add this
          email: newData.email,
          role: newData.role,
        },
      })
    );
    setToken(newToken);
    setUserData(newData);
    setIsAuthenticated(true);
  };

  const loginAdmin = (adminToken, adminData) => {
    localStorage.setItem(
      "admin_data",
      JSON.stringify({ adminToken: adminToken, admin: adminData })
    );
    setIsAdminAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("user_data");
    setToken(null);
    setUserData(null);
    setIsAuthenticated(false);
  };

  const logoutAdmin = () => {
    localStorage.removeItem("admin_data");
    setIsAdminAuthenticated(false);
  };

  // useEffect(() => {
  //   const storedData = JSON.parse(localStorage.getItem("user_data"));
  //   if (storedData?.userToken) {
  //     setToken(storedData.userToken);
  //     setIsAuthenticated(true);

  //     // Refresh token in localStorage if needed
  //     const remainingTime = jwtDecode(storedData.userToken).exp * 1000 - Date.now();
  //     if (remainingTime < 60000) { // If token expires in 1 minute
  //       logout();
  //     }
  //   }
  // }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        userData,
        isAuthenticated,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
