import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import deleteIcon from "../assets/deleteIcon.svg";
import SuperAdminDashboardSidebar from "./SuperAdminDashboardSidebar";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex max-w-[1920px] m-auto">
      <div className="">
        <SuperAdminDashboardSidebar />
      </div>
      <div className="flex-grow mx-10 sm:mx-16 mt-24 md:mt-16">
        <div className="flex container bg-[#2C3433] px-12 py-4 rounded-xl">
          {/* <h4 className="w-[16%] text-white text-xl">Picture</h4> */}
          <h4 className="w-[40%] text-white text-xl">Product Name</h4>
          <h4 className="w-[25%] text-white text-xl">Category</h4>
          <h4 className="w-[25%] text-white text-xl">Price</h4>
          <h4 className="w-[10%] text-white text-xl">Actions</h4>
        </div>
        <h2 className="text-3xl font-semibold mt-12 mb-7">Furniture</h2>
        <div>
          <div className="flex container bg-[#E9EDED] px-12 py-4 items-center rounded-xl cursor-pointer">
            {/* <h4 className="w-[16%] text-xl">Picture</h4> */}
            <h4 className="w-[40%] text-xl">ComfortRest Bed</h4>
            <h4 className="w-[25%] text-xl">Furniture</h4>
            <h4 className="w-[25%] text-xl">PKR. 95000</h4>
            <h4 className="w-[10%] text-xl">
              <button className="ml-4">
                <img src={deleteIcon} alt="" />
              </button>
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
