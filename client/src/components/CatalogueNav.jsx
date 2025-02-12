// CatalogueNav.js
import React from "react";

const CatalogueNav = ({ selectedCategory, setSelectedCategory }) => {
  // Add "All" to categories
  const categories = [
    "All",
    "Furniture",
    "Electronics",
    "Flooring",
    "Decor",
    "Kitchen Essentials",
  ];

  const handleCategoryClick = (category) => {
    console.log("Selected Category:", category); // Debugging
    setSelectedCategory(category);
  };

  return (
    <div className="sidebar bg-white flex items-center pt-8 w-full">
      <div className="sidebar-items mt-10 flex gap-4 overflow-x-auto whitespace-nowrap px-4 w-full">
        {categories.map((category) => (
          <button
            key={category}
            className={`text-xl px-8 py-4 rounded-xl flex-shrink-0 transition-all duration-300 ${
              category === selectedCategory
                ? "bg-[#468378] text-white"
                : "bg-[#4683781d] hover:bg-[#468378] hover:text-white"
            }`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CatalogueNav;
