import { useEffect, useState, useCallback } from "react";

const useFetchProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("vendorToken"); // Get token
      if (!token) throw new Error("No vendor token found");

      const response = await fetch("http://localhost:3000/api/product/list", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Attach token to headers
        },
      });

      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      console.log("Vendor Products:", data);
      setProducts(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, error, fetchProducts };
};

export default useFetchProducts;
