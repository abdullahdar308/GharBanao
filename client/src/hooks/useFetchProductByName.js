// hooks/useFetchProductByName.js
import { useState, useEffect } from "react";

const useFetchProductByName = (productName) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/product/name/${encodeURIComponent(productName)}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (productName) {
      fetchProduct();
    }
  }, [productName]);

  return { product, loading, error };
};

export default useFetchProductByName;
