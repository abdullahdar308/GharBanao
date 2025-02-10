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
        className="absolute right-24 top-48 p-5 bg-[#e1eae8] rounded-[50%] cursor-pointer hover:bg-[#d1dddb] z-10"
      >
        <img className="w-9" src={cartIcon} alt="Cart" />
      </div>

      {showAddToCartMessage && (
        <div className="bg-[#00000065] fixed left-0 top-0 right-0 bottom-0 z-10">
          <div className="fixed top-32 left-[45%] bg-green-500 text-white text-2xl text-center p-3 rounded-md shadow-md">
            <h2>Item added to cart!</h2>
          </div>
        </div>
      )}

      {product && (
        <div className="card flex rounded-2xl pt-5 mt-16 px-16 m-auto max-w-[1920px] relative fade-in transition duration-500 ease-in">
          <div className="px-32 w-1/2 h-[500px] flex justify-center items-center rounded-2xl bg-[#F4F8F7] overflow-hidden">
            <img
              className="max-h-full object-contain"
              src={`https://gharbanao-87pi.onrender.com/${product.image}`}
              alt={product.name}
            />
          </div>

          <div className="py-8 pl-24 w-1/2 mt-12">
            <h3 className="text-6xl font-semibold">{product.name}</h3>
            <h4 className="mt-10 text-2xl font-semibold">
              Category: <span className="font-normal">{product.category}</span>
            </h4>
            <h4 className="mt-5 text-2xl font-semibold mr-16">
              Description: <br />
              <span className="mt-4 font-normal text-xl">
                {product.description}
              </span>
            </h4>
            <h4 className="text-4xl mt-20 mb-12 font-semibold">
              PKR {product.price}
            </h4>
            <div className="flex justify-between items-center">
              <button
                className="bg-[#468378] rounded-lg text-white text-2xl px-10 py-4"
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
