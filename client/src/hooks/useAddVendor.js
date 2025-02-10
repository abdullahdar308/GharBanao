// hooks/useAddVendor.js
import { useState } from "react";
import { message } from "antd";

const useAddVendor = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addVendor = async (vendorData) => {
    setLoading(true);
    setError(null);

    try {
        const response = await fetch("http://localhost:3000/api/vendor/add", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
             
            },
            body: JSON.stringify(vendorData),
          });
           // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Unexpected response from server");
    }
          

      const data = await response.json();

      if (response.status === 201) {
        message.success(data.message);
        return data.vendor;
      } else {
        throw new Error(data.message || "Failed to add vendor");
      }
    } catch (error) {
      setError(error.message);
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { addVendor, loading, error };
};

export default useAddVendor;
