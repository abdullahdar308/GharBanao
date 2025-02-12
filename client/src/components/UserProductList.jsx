import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetchUserProducts from "../hooks/useFetchUserProducts";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";

const UserProductList = ({ selectedCategory }) => {
  const { products, loading, error } = useFetchUserProducts();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showAddToCartMessage, setShowAddToCartMessage] = useState(false);

  const handleAddToCart = (e, id, name, price, vendorId) => {
    e.stopPropagation();
    dispatch(addToCart({ id, name, price, vendorId, quantity: 1 }));
    setShowAddToCartMessage(true);
    setTimeout(() => setShowAddToCartMessage(false), 1000);
  };

  const handleCardClick = (id, name) => {
    navigate(`/catalogue/${name}`);
  };

  // Filter products by selected category
  const filteredProducts = products.filter((product) =>
    selectedCategory === "All"
      ? true // Show all products
      : product.category === selectedCategory
  );

  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      {showAddToCartMessage && (
        <div className="bg-[#00000065] fixed inset-0 z-10 flex justify-center items-center">
          <div className="bg-green-500 text-white text-lg sm:text-2xl text-center p-3 rounded-md shadow-md">
            <h2>Item added to cart!</h2>
          </div>
        </div>
      )}
      <div className="mt-20 px-4 sm:px-8">
        <div className="flex flex-wrap justify-start gap-6 sm:gap-10 lg:gap-10">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              onClick={() => handleCardClick(product._id, product.name)}
              className="card bg-[#F2F6F5] w-full sm:w-[48%] md:w-[31%] rounded-2xl pt-5 mb-10 relative fade-in hover:scale-105 transition duration-500 ease-in cursor-pointer flex flex-col justify-between shadow-md"
            >
              <div className="w-full h-[250px] sm:h-[300px] flex justify-center items-center overflow-hidden">
                <img
                  className="px-5 sm:px-10 h-[200px] sm:h-[250px] object-contain"
                  src={`http://localhost:3000/${product.image}`}
                  alt={product.name}
                />
              </div>

              <div className="bg-[#E6EEEC] rounded-b-2xl py-6 sm:py-8 px-8 sm:px-12 h-auto">
                <h3 className="text-2xl font-semibold">{product.name}</h3>
                <div className="flex justify-between items-center mt-4">
                  <h4 className="text-2xl font-semibold">
                    PKR {product.price}
                  </h4>
                  <button
                    className="bg-[#468378] rounded-lg text-white text-xl px-4 sm:px-8 py-2 sm:py-3 z-20 hover:bg-[#4b9d8e]"
                    onClick={(e) =>
                      handleAddToCart(
                        e,
                        product._id,
                        product.name,
                        product.price,
                        product.vendorId
                      )
                    }
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default UserProductList;
