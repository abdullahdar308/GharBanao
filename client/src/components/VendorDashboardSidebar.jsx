// client/src/components/VendorDashboardSidebar.jsx

import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const VendorDashboardSidebar = () => {
  const navigate = useNavigate();
  const { logoutAdmin, isAdminAuthenticated } = useAuth();

  const handleLogout = async () => {
    localStorage.removeItem("vendorToken"); // Remove token
    navigate("/"); // Redirect to login page after logout
  };

  const handleListingsClick = () => {
    navigate("/vendor/dashboard");
  };
  const handleAddProductClick = () => {
    navigate("/vendor/addProduct");
  };

  const handleOrdersClick = () => {
    navigate("/vendor/orders");
  };

  return (
    <div className="homepage-container max-w-[1920px] m-auto h-screen">
      <div className="homepage-content flex flex-col h-full p-12 box-border">
        <div className="flex flex-col items-center h-full w-80">
          <img className="logo w-60 mb-7" src="/logo.png" alt="" />
          <div className="bg-[#2C3433] rounded-3xl w-80 flex-grow h-full p-16 pt-24 flex flex-col justify-between">
            <div>
              <button
                onClick={handleListingsClick}
                className="bg-none text-white text-xl mb-7"
              >
                View Listings
              </button>
              <button
                onClick={handleAddProductClick}
                className="bg-none text-white text-xl mb-7"
              >
                Add Products
              </button>
              <button
                onClick={handleOrdersClick}
                className="bg-none text-white text-xl mb-7"
              >
                View Orders
              </button>
            </div>
            <div className="flex justify-center">
              <button className="text-2xl text-white" onClick={handleLogout}>
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboardSidebar;
