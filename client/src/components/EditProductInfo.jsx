import React, { useState, useEffect } from "react";
import DashboardSidebar from "./VendorDashboardSidebar";
import useUpdateProduct from "../hooks/useUpdateProduct";
import { useNavigate, useParams } from "react-router-dom";

const EditProductInfo = () => {
  const { updateProduct, loading, error } = useUpdateProduct();
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("vendorToken");
    if (!token) {
      navigate("/vendor/login"); // Redirect if no token
    }
  }, [navigate]);

  const { id } = useParams(); // Get product ID from URL parameters

  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("Furniture");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);

  // Fetch existing product details
  useEffect(() => {
    const fetchProduct = async () => {
      const response = await fetch(
        `https://gharbanao-87pi.onrender.com/api/product/${id}`
      );
      const data = await response.json();
      if (response.ok) {
        setProductName(data.name);
        setCategory(data.category);
        setDescription(data.description);
        setPrice(data.price);
      }
    };
    fetchProduct();
  }, [id]);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Use FormData to handle file uploads
    const formData = new FormData();
    formData.append("name", productName);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("price", price);
    if (image) formData.append("image", image); // Only add image if a new one is selected

    const result = await updateProduct(id, formData); // Call updateProduct with formData
    if (result) {
      navigate("/vendor/dashboard"); // Redirect after successful update
    }
  };

  return (
    <div className="flex max-w-[1920px] m-auto">
      <div>
        <DashboardSidebar />
      </div>
      <div className="p-12 w-full lg:mt-0 mt-20">
        <h2 className="text-3xl font-semibold">Edit Product Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="mt-12 flex flex-col mb-10">
            <label className="text-xl font-medium mb-4">Product Name</label>
            <input
              className="bg-[#E9EDED] text-xl px-7 py-3 outline-none rounded-lg w-full max-w-[500px]"
              type="text"
              placeholder="Enter Product Name"
              value={productName}
              readOnly // Make this field read-only
            />
          </div>
          <div className="mt-12 flex flex-col mb-10">
            <label className="text-xl font-medium mb-4">Product Category</label>
            <input
              className="bg-[#E9EDED] text-xl px-7 py-3 outline-none rounded-lg w-full max-w-[500px]"
              type="text"
              value={category}
              readOnly // Make this field read-only
            />
          </div>
          <div className="mt-12 flex flex-col mb-10">
            <label className="text-xl font-medium mb-4">
              Product Description
            </label>
            <textarea
              placeholder="Enter Product Description"
              className="bg-[#E9EDED] text-xl px-7 py-3 outline-none rounded-lg w-full max-w-[500px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="mt-12 flex flex-col mb-10">
            <label className="text-xl font-medium mb-4">Product Price</label>
            <input
              className="bg-[#E9EDED] text-xl px-7 py-3 outline-none rounded-lg w-full max-w-[500px]"
              type="number"
              placeholder="Enter Product Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min="0"
            />
          </div>
          <div className="mt-12 flex flex-col mb-10">
            <label className="text-xl font-medium mb-4">Product Picture</label>
            <input
              className="bg-[#E9EDED] text-xl px-7 py-3 outline-none rounded-lg w-full max-w-[500px]"
              type="file"
              onChange={handleFileChange}
              required
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className="bg-[#468378] text-white text-xl px-7 py-4 rounded-xl mt-4"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProductInfo;
