// hooks/useUpdateProduct.js
import { useState } from "react";

const useUpdateProduct = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateProduct = async (id, productData) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("vendorToken"); // Get vendor token

      const response = await fetch(
        `http://localhost:3000/api/product/update/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`, // Include token for authentication
          },
          body: productData, // FormData will be passed here
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateProduct, loading, error };
};

export default useUpdateProduct;
