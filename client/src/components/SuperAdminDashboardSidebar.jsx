import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const SuperAdminDashboardSidebar = () => {
  const navigate = useNavigate();
  const { logoutAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logoutAdmin();
    navigate("/");
  };

  const handleViewVendorsClick = () => {
    navigate("/superadmin/viewVendors");
  };

  const handleAddVendorClick = () => {
    navigate("/superadmin/addVendor");
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative h-screen">
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded-md text-3xl"
        onClick={toggleSidebar}
      >
        {isOpen ? "X" : "☰"}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:relative top-0 left-0 w-80 h-full bg-[#2C3433] transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 flex flex-col p-6 pt-24 text-white z-40`}
      >
        <img className="w-60 mb-20 mx-auto" src="/logo2.svg" alt="Logo" />
        <button onClick={handleViewVendorsClick} className="text-xl mb-7">
          View Vendors
        </button>
        <button onClick={handleAddVendorClick} className="text-xl mb-7">
          Add Vendors
        </button>
        <button className="text-2xl mt-auto" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </div>
  );
};

export default SuperAdminDashboardSidebar;
