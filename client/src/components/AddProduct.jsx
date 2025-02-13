import React, { useState, useEffect } from "react";
import sidePic from "../assets/sidePic.png";
import DashboardSidebar from "./VendorDashboardSidebar";
import useAddProduct from "../hooks/useAddProduct";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const { addProduct, loading, error } = useAddProduct();
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("Furniture");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("vendorToken");
    if (!token) {
      navigate("/vendor/login"); // Redirect if no token
    }
  }, [navigate]);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      name: productName,
      category,
      description,
      price,
      image,
    };

    await addProduct(productData);

    // Reset form if successful
    setProductName("");
    setCategory("Furniture");
    setDescription("");
    setPrice("");
    setImage(null);
  };

  return (
    <div className="flex max-w-[1920px] m-auto">
      <div>
        <DashboardSidebar />
      </div>
      <div className="p-12 flex flex-col lg:flex-row w-full lg:mt-0 mt-20">
        <div className="w-full lg:w-1/2">
          <h2 className="text-3xl font-semibold">Add New Product Details</h2>
          <form onSubmit={handleSubmit}>
            <div className="mt-12 flex flex-col mb-10">
              <label className="text-xl font-medium mb-4">Product Name</label>
              <input
                className="bg-[#E9EDED] text-xl px-7 py-3 outline-none rounded-lg w-full max-w-[500px]"
                type="text"
                placeholder="Enter Product Name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </div>
            <div className="mt-12 flex flex-col mb-10">
              <label className="text-xl font-medium mb-4">
                Product Category
              </label>
              <select
                className="bg-[#E9EDED] text-xl px-7 py-3 outline-none rounded-lg w-full max-w-[500px]"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Furniture">Furniture</option>
                <option value="Electronics">Electronics</option>
                <option value="Flooring">Flooring</option>
                <option value="Decor">Decor</option>
                <option value="Kitchen Essentials">Kitchen Essentials</option>
              </select>
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
                min="0"
                required
              />
            </div>
            <div className="mt-12 flex flex-col mb-10">
              <label className="text-xl font-medium mb-4">
                Product Picture
              </label>
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
              {loading ? "Adding Product..." : "Add Product"}
            </button>
          </form>
        </div>
        <div className="hidden lg:flex justify-center items-center w-1/2">
          <img className="w-full" src={sidePic} alt="" />
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
