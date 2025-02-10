import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetchProducts from "../hooks/useFetchProducts";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";

const ProductList = ({ selectedCategory }) => {
  const { products, loading, error } = useFetchProducts();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showAddToCartMessage, setShowAddToCartMessage] = useState(false);

  const handleAddToCart = (e, id, name, price) => {
    e.stopPropagation();
    dispatch(addToCart({ id, name, price, quantity: 1 }));
    setShowAddToCartMessage(true);
    setTimeout(() => setShowAddToCartMessage(false), 1000);
  };

  const handleCardClick = (id, name) => {
    navigate(`/catalogue/${name}`);
  };

  // Filter products by selected category
  // Update the filtered products logic
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
        <div className="bg-[#00000065] fixed left-0 top-0 right-0 bottom-0 z-10">
          <div className="fixed top-32 left-[45%] bg-green-500 text-white text-2xl text-center p-3 rounded-md shadow-md">
            <h2>Item added to cart!</h2>
          </div>
        </div>
      )}
      <div className="mt-20">
        <div className="items flex flex-wrap mt-5 justify-start gap-20">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              onClick={() => handleCardClick(product._id, product.name)}
              className="card bg-[#F2F6F5] w-[31%] rounded-2xl pt-5 mb-16 relative fade-in hover:scale-105 transition duration-500 ease-in cursor-pointer flex flex-col justify-between"
            >
              <div className="w-full h-[350px] flex justify-center items-center overflow-hidden">
                <img
                  className="px-10 h-[300px] object-contain"
                  src={`http://localhost:3000/${product.image}`}
                  alt={product.name}
                />
              </div>

              <div className="bg-[#E6EEEC] rounded-b-2xl py-8 px-12 h-[120px]">
                <h3 className="text-2xl font-semibold">{product.name}</h3>
                <div className="flex justify-between items-center">
                  <h4 className="text-2xl font-semibold">
                    PKR {product.price}
                  </h4>
                  <button
                    className="bg-[#468378] rounded-lg text-white text-xl px-8 py-3 z-20 hover:bg-[#4b9d8e]"
                    onClick={(e) =>
                      handleAddToCart(
                        e,
                        product._id,
                        product.name,
                        product.price
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

export default ProductList;
