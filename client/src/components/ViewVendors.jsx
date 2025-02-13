// client/src/components/ViewVendors.jsx

import React from "react";
import SuperAdminDashboardSidebar from "./SuperAdminDashboardSidebar";
import { useNavigate } from "react-router-dom";
import useFetchVendors from "../hooks/useFetchVendors";

const ViewVendors = () => {
  const navigate = useNavigate();
  const { vendors, loading, error } = useFetchVendors();

  const handleItemClick = (vendor) => {
    // Pass vendor information if needed to the next route
    navigate("/superadmin/vendorInfo", { state: { vendor } });
  };

  return (
    <div className="flex max-w-[1920px] m-auto">
      <div>
        <SuperAdminDashboardSidebar />
      </div>
      <div className="flex-grow mx-10 sm:mx-16 mt-24 md:mt-16">
        <h1 className="text-3xl font-semibold mb-10">View Vendors List</h1>

        <div className="flex container bg-[#2C3433] px-12 py-4 rounded-xl mb-10">
          <h4 className="w-[45%] text-white text-xl">Vendor Name</h4>
          <h4 className="w-[45%] text-white text-xl">Vendor Email</h4>
        </div>

        {loading && <p>Loading vendors...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div>
          {vendors.map((vendor) => (
            <div
              key={vendor._id}
              onClick={() => handleItemClick(vendor)}
              className="flex container bg-[#E9EDED] px-12 py-4 items-center rounded-xl cursor-pointer mt-5"
            >
              <h4 className="w-[45%] text-xl">{vendor.name}</h4>
              <h4 className="w-[45%] text-xl">{vendor.email}</h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewVendors;
