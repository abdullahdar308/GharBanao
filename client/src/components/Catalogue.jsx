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
        <div className="catalogue-content max-w-[1920px] m-auto px-16 py-7 mt-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-6xl font-semibold">
                Discover Your Dream Home Essentials
              </h1>
              <p className="text-2xl mt-5 text-[#595959]">
                Explore our curated collection and find the perfect pieces for
                your dream home.
              </p>
            </div>
            <div
              onClick={goToCart}
              className="p-5 bg-[#e1eae8] rounded-[50%] cursor-pointer hover:bg-[#d1dddb]"
            >
              <img className="w-9 " src={cartIcon} alt="" />
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
