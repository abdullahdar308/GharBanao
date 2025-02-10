import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const SuperAdminDashboardSidebar = () => {
  const navigate = useNavigate();
  const { logoutAdmin } = useAuth(); // Assuming you have a logout function in your auth context

  const handleLogout = async () => {
    await logoutAdmin(); // Call the logout function
    navigate("/"); // Redirect to homepage after logout
  };

  const handleViewVendorsClick = () => {
    navigate("/superadmin/viewVendors");
  };

  const handleAddVendorClick = () => {
    navigate("/superadmin/addVendor");
  };

  return (
    <div className="homepage-container max-w-[1920px] m-auto h-screen">
      <div className="homepage-content flex flex-col h-full p-12 box-border">
        <div className="flex flex-col items-center h-full w-80">
          <img className="logo w-60 mb-7" src="/logo.png" alt="" />
          <div className="bg-[#2C3433] rounded-3xl w-80 flex-grow h-full p-16 pt-24 flex flex-col justify-between">
            <div>
              <button
                onClick={handleViewVendorsClick}
                className="bg-none text-white text-xl mb-7"
              >
                View Vendors
              </button>
              <button
                onClick={handleAddVendorClick}
                className="bg-none text-white text-xl mb-7"
              >
                Add Vendors
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

export default SuperAdminDashboardSidebar;
