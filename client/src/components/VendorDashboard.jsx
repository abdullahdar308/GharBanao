// client/src/components/VendorDashboard.jsx

import React, { useEffect } from "react";
import VendorDashboardSidebar from "./VendorDashboardSidebar";
import { useNavigate } from "react-router-dom";
import useFetchProducts from "../hooks/useFetchProducts";
import editIcon from "../assets/editIcon.svg";
import deleteIcon from "../assets/deleteIcon.svg";

const VendorDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("vendorToken");
    if (!token) {
      navigate("/vendor/login"); // Redirect if no token
    }
  }, [navigate]);

  const { products, loading, error, fetchProducts } = useFetchProducts(); // Assuming fetchProducts reloads products after deletion
  const handleItemClick = (productId) => {
    navigate(`/vendor/productInfo/${productId}`);
  };

  const handleDelete = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/product/${productId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        alert("Product deleted successfully");
        fetchProducts(); // Refresh the product list after deletion
      } else {
        throw new Error("Failed to delete product");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex max-w-[1920px] m-auto">
      <div>
        <VendorDashboardSidebar />
      </div>
      <div className="flex-grow mr-16 mt-16">
        <div className="flex container bg-[#2C3433] px-12 py-4 rounded-xl">
          <h4 className="w-[40%] text-white text-xl">Product Name</h4>
          <h4 className="w-[25%] text-white text-xl">Category</h4>
          <h4 className="w-[25%] text-white text-xl">Price</h4>
          <h4 className="w-[10%] text-white text-xl">Actions</h4>
        </div>

        {loading && <p>Loading products...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div>
          {products.map((product) => (
            <div
              key={product._id}
              onClick={() => handleItemClick(product._id)}
              className="flex container bg-[#E9EDED] px-12 py-4 items-center rounded-xl cursor-pointer mt-5"
            >
              <h4 className="w-[40%] text-xl">{product.name}</h4>
              <h4 className="w-[25%] text-xl">{product.category}</h4>
              <h4 className="w-[25%] text-xl">PKR {product.price}</h4>
              <h4 className="w-[10%] text-xl flex gap-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/vendor/edit/${product._id}`);
                  }}
                >
                  <img src={editIcon} alt="Edit" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(product._id); // Call handleDelete function
                  }}
                >
                  <img src={deleteIcon} alt="Delete" />
                </button>
              </h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
