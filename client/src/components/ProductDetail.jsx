import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";
import Navigation from "./Navigation";
import cartIcon from "../assets/Cart-Assets/cartIcon.svg";

const ProductDetail = () => {
  const { productName } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddToCartMessage, setShowAddToCartMessage] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://gharbanao-87pi.onrender.com/api/product/name/${productName}`
        );
        if (!response.ok) throw new Error("Failed to fetch product details");
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productName]);

  const handleAddToCart = (id, name, price, vendorId, quantity) => {
    dispatch(
      addToCart({
        id,
        name,
        price,
        vendorId, // Now properly included
        quantity,
      })
    );
    setShowAddToCartMessage(true);
    setTimeout(() => setShowAddToCartMessage(false), 1000);
  };

  const goToCart = () => navigate("/cart");

  if (loading) return <p>Loading product details...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <>
      <Navigation />
      <div
        onClick={goToCart}
        className="fixed right-6 sm:right-12 top-32 sm:top-48 p-4 sm:p-5 bg-[#e1eae8] rounded-full cursor-pointer hover:bg-[#d1dddb] z-10"
      >
        <img className="w-6 sm:w-9" src={cartIcon} alt="Cart" />
      </div>

      {showAddToCartMessage && (
        <div className="bg-[#00000065] fixed inset-0 z-10 flex justify-center items-center">
          <div className="bg-green-500 text-white text-lg sm:text-2xl text-center p-3 rounded-md shadow-md">
            <h2>Item added to cart!</h2>
          </div>
        </div>
      )}

      {product && (
        <div className="card flex flex-col lg:flex-row rounded-2xl pt-5 mt-36 sm:mt-32 px-4 sm:px-16 mx-auto max-w-[95%] sm:max-w-[1920px] relative fade-in transition duration-500 ease-in">
          <div className="px-6 sm:px-32 w-full lg:w-1/2 h-[300px] sm:h-[500px] flex justify-center items-center rounded-2xl bg-[#F4F8F7] overflow-hidden">
            <img
              className="max-h-full object-contain"
              src={product.image}
              alt={product.name}
            />
          </div>

          <div className="py-6 sm:py-8 px-4 sm:pl-24 w-full lg:w-1/2 mt-6 sm:mt-12">
            <h3 className="text-3xl sm:text-6xl font-semibold">
              {product.name}
            </h3>
            <h4 className="mt-6 sm:mt-10 text-xl sm:text-2xl font-semibold">
              Category: <span className="font-normal">{product.category}</span>
            </h4>
            <h4 className="mt-4 sm:mt-5 text-xl sm:text-2xl font-semibold mr-4 sm:mr-16">
              Description: <br />
              <span className="mt-2 sm:mt-4 font-normal text-lg sm:text-xl">
                {product.description}
              </span>
            </h4>
            <h4 className="text-2xl sm:text-4xl mt-10 sm:mt-20 mb-8 sm:mb-12 font-semibold">
              PKR {product.price}
            </h4>
            <div className="flex justify-between items-center">
              <button
                className="bg-[#468378] rounded-lg text-white text-lg sm:text-2xl px-6 sm:px-10 py-3 sm:py-4"
                onClick={() =>
                  handleAddToCart(
                    product._id,
                    product.name,
                    product.price,
                    product.vendorId, // Correctly get vendorId from product
                    1
                  )
                }
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetail;
