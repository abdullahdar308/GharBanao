import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardSidebar from "./VendorDashboardSidebar";
import useFetchProduct from "../hooks/useFetchProduct";
import productPlaceholder from "../assets/itemPic.png";

const ProductInfo = () => {
  const { id: productId } = useParams(); // Extract productId from URL
  const { product, loading, error } = useFetchProduct(productId);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("vendorToken");
    if (!token) {
      navigate("/vendor/login"); // Redirect if no token
    }
  }, [navigate]);

  const handleEdit = () => {
    navigate(`/vendor/edit/${productId}`); // Navigate to EditProductInfo page with product ID
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `https://gharbanao-87pi.onrender.com/api/product/${productId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        alert("Product deleted successfully");
        navigate("/vendor/dashboard"); // Redirect to listings after delete
      } else {
        throw new Error("Failed to delete product");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex max-w-[1920px] m-auto">
      <div>
        <DashboardSidebar />
      </div>
      <div>
        <div className="card flex rounded-2xl pt-5 mt-16 px-16 m-auto max-w-[1920px] relative fade-in transition duration-500 ease-in">
          <div className="px-32 w-1/2 h-[500px] flex justify-center items-center rounded-2xl bg-[#F4F8F7] overflow-hidden">
            <img
              className="max-h-full object-contain"
              src={product?.image}
              alt={product?.name || "Product"}
            />
          </div>
          <div className="py-8 pl-24 w-1/2 mt-12">
            <h3 className="text-6xl font-semibold">{product?.name}</h3>
            <h4 className="mt-10 text-2xl font-semibold">
              Category: <span className="font-normal">{product?.category}</span>
            </h4>

            <h4 className="mt-5 text-2xl font-semibold">
              Vendor:{" "}
              <span className="font-normal">
                {product?.vendor || "Unknown"}
              </span>
            </h4>
            <h4 className="mt-5 text-2xl font-semibold mr-16">
              Description:
              <br />
              <span className="mt-4 font-normal text-xl">
                {product?.description}
              </span>
            </h4>
            <h4 className="text-4xl mt-20 mb-12 font-semibold">
              PKR {product?.price}
            </h4>
            <div className="flex items-center">
              <button
                className="bg-[#468378] rounded-xl text-white text-2xl px-10 py-4 mr-6"
                onClick={handleEdit}
              >
                Edit Details
              </button>
              <button
                className="bg-[#2C3433] rounded-xl text-white text-2xl px-10 py-4"
                onClick={handleDelete}
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
