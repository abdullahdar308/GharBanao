// hooks/useAddProduct.js
import { useState } from "react";
import { message } from "antd";
import { jwtDecode } from "jwt-decode";

const useAddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addProduct = async (productData) => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("vendorToken");
    const decoded = jwtDecode(token); // Use a JWT decoding library
    const vendorId = decoded.vendorId;

    try {
      const formData = new FormData();
      formData.append("name", productData.name);
      formData.append("category", productData.category);
      formData.append("description", productData.description);
      formData.append("price", productData.price);
      formData.append("vendorId", vendorId);
      //   formData.append("vendorId", productData.vendorId); // Assuming vendorId is passed
      if (productData.image) {
        formData.append("image", productData.image);
      }

      const response = await fetch("http://localhost:3000/api/product/add", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Send token in headers
        },
      });
      // Check if the response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Unexpected response format from server");
      }

      const data = await response.json();
      if (response.status === 201) {
        message.success(data.message);
        return data.product;
      } else {
        throw new Error(data.message || "Failed to add product");
      }
    } catch (error) {
      setError(error.message);
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { addProduct, loading, error };
};

export default useAddProduct;
