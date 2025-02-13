import React, { useState } from "react";
import SuperAdminDashboardSidebar from "./SuperAdminDashboardSidebar";
import useAddVendor from "../hooks/useAddVendor";

const AddVendor = () => {
  const { addVendor, loading, error } = useAddVendor();
  const [vendorName, setVendorName] = useState("");
  const [vendorEmail, setVendorEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const vendorData = {
      name: vendorName,
      email: vendorEmail,
    };

    const result = await addVendor(vendorData);
    if (result) {
      // Reset form on success
      setVendorName("");
      setVendorEmail("");
    }
  };

  return (
    <div className="flex">
      <div>
        <SuperAdminDashboardSidebar />
      </div>
      <div className="mt-20 md:mt-12 px-12 sm:px-16 p-16 w-full">
        <h1 className="text-3xl font-semibold">Add Vendor</h1>
        <form onSubmit={handleSubmit}>
          <div className="mt-12 flex flex-col mb-10">
            <label className="text-xl font-medium mb-4">Vendor Name</label>
            <input
              className="bg-[#E9EDED] text-xl px-7 py-3 outline-none rounded-lg w-full max-w-[500px]"
              type="text"
              placeholder="Enter Vendor Name"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
            />
          </div>
          <div className="mt-12 flex flex-col mb-10">
            <label className="text-xl font-medium mb-4">Vendor Email</label>
            <input
              className="bg-[#E9EDED] text-xl px-7 py-3 outline-none rounded-lg w-full max-w-[500px]"
              type="email"
              placeholder="Enter Vendor Email"
              value={vendorEmail}
              onChange={(e) => setVendorEmail(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className="bg-[#468378] text-white text-xl px-7 py-4 rounded-xl mt-4"
            disabled={loading}
          >
            {loading ? "Adding Vendor..." : "Add Vendor"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddVendor;
