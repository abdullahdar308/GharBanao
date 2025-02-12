// Catalogue.js
import React, { useState } from "react";
import Navigation from "./Navigation";
import CatalogueNav from "./CatalogueNav";
import UserProductList from "./UserProductList";
import cartIcon from "../assets/Cart-Assets/cartIcon.svg";
import { useNavigate } from "react-router-dom";

const Catalogue = () => {
  const [selectedCategory, setSelectedCategory] = useState("Furniture");
  const navigate = useNavigate();

  const goToCart = () => {
    navigate("/cart");
  };

  return (
    <div>
      <Navigation />
      <div className="catalogue">
        <div className="catalogue-content max-w-[1920px] mx-auto px-6 sm:px-10 lg:px-16 py-7 mt-12">
          <div className="flex flex-col lg:flex-row justify-between gap-6">
            <div className="text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold">
                Discover Your Dream Home Essentials
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl mt-3 sm:mt-5 text-[#595959]">
                Explore our curated collection and find the perfect pieces for
                your dream home.
              </p>
            </div>
            <div
              onClick={goToCart}
              className="p-4 sm:p-5 bg-[#e1eae8] rounded-full cursor-pointer hover:bg-[#d1dddb] flex items-center justify-center"
            >
              <img className="w-7 sm:w-9" src={cartIcon} alt="Cart" />
            </div>
          </div>
          <CatalogueNav
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
          <UserProductList selectedCategory={selectedCategory} />
        </div>
      </div>
    </div>
  );
};

export default Catalogue;
