import React, { useEffect, useState } from "react";
import VendorDashboardSidebar from "./VendorDashboardSidebar";
import { useNavigate } from "react-router-dom";
import useFetchProducts from "../hooks/useFetchProducts";
import editIcon from "../assets/editIcon.svg";
import deleteIcon from "../assets/deleteIcon.svg";

const VendorDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("vendorToken");
    if (!token) {
      navigate("/vendor/login"); // Redirect if no token
    }
  }, [navigate]);

  const { products, loading, error, fetchProducts } = useFetchProducts();

  const handleItemClick = (productId) => {
    navigate(`/vendor/productInfo/${productId}`);
  };

  const handleDelete = async (productId) => {
    try {
      const response = await fetch(
        `https://gharbanao-87pi.onrender.com/api/product/${productId}`,
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
      {/* Sidebar - Stays the same for larger screens, collapsible for mobile */}
      <VendorDashboardSidebar />

      {/* Main content */}
      <div className="flex-grow px-4 md:px-16 mt-28 md:mt-16">
        {/* Mobile Toggle Button */}
        {/* <button
          className="md:hidden bg-[#2C3433] text-white px-4 py-2 rounded-md mb-4"
          onClick={() => setSidebarOpen(true)}
        >
          ☰ Menu
        </button> */}

        <div className="flex bg-[#2C3433] px-6 py-4 rounded-xl text-white text-sm md:text-xl">
          <h4 className="w-[40%]">Product Name</h4>
          <h4 className="w-[25%]">Category</h4>
          <h4 className="w-[25%]">Price</h4>
          <h4 className="w-[10%]">Actions</h4>
        </div>

        {loading && <p>Loading products...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div>
          {products.map((product) => (
            <div
              key={product._id}
              onClick={() => handleItemClick(product._id)}
              className="flex flex-wrap md:flex-nowrap bg-[#E9EDED] px-6 py-4 items-center rounded-xl cursor-pointer mt-5"
            >
              <h4 className="w-[40%] text-sm md:text-xl">{product.name}</h4>
              <h4 className="w-[25%] text-sm md:text-xl">{product.category}</h4>
              <h4 className="w-[25%] text-sm md:text-xl">
                PKR {product.price}
              </h4>
              <div className="w-[10%] flex gap-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/vendor/edit/${product._id}`);
                  }}
                >
                  <img src={editIcon} alt="Edit" className="w-6 md:w-8" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(product._id);
                  }}
                >
                  <img src={deleteIcon} alt="Delete" className="w-6 md:w-8" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
