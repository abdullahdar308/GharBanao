// CatalogueNav.js
import React from "react";

const CatalogueNav = ({ selectedCategory, setSelectedCategory }) => {
  // Add "All" to categories
  const categories = [
    "All",
    "Furniture",
    "Electronics",
    "Wall Art",
    "Decor",
    "Kitchen Essentials",
  ];

  const handleCategoryClick = (category) => {
    console.log("Selected Category:", category); // Debugging
    setSelectedCategory(category);
  };

  return (
    <div className="sidebar bg-white flex items-center pt-8">
      <div className="sidebar-items mt-10 flex items-center gap-7 relative">
        {categories.map((category) => (
          <button
            key={category}
            className={`text-xl px-8 py-4 rounded-xl ${
              category === selectedCategory
                ? "bg-[#468378] text-white" // Selected style
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
