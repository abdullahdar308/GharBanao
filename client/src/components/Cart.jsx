// client/src/components/Cart.jsx

import React, { useState } from "react";
import deleteIcon from "../assets/Cart-Assets/deleteIcon.svg";
import crossIcon from "../assets/Cart-Assets/crossIcon.svg";
import { useSelector, useDispatch } from "react-redux";
import {
  updateQuantity,
  deleteFromCart,
  emptyCart,
  updateHistory,
} from "../features/cart/cartSlice";
import Navigation from "./Navigation";

const Cart = () => {
  const [isMemberChecked, setIsMemberChecked] = useState(false);
  const [isDayEventChecked, setIsDayEventChecked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [order, setOrder] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [userName, setUserName] = useState("");
  const [userMobileNumber, setUserMobileNumber] = useState("");
  const [userAddress, setUserAddress] = useState("");

  const handleMemberChange = () => {
    setIsMemberChecked(!isMemberChecked);
  };

  const handleDayEventChanged = () => {
    setIsDayEventChecked(!isDayEventChecked);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    selectCartTab();
  };

  const cartItems = useSelector((state) => state.cart.cartItems);
  const orderItems = useSelector((state) => state.cart.orderItems);
  const history = useSelector((state) => state.cart.history);
  const dispatch = useDispatch();

  const handleQuantityChange = (quantity, id) => {
    quantity = Math.max(quantity, 1);
    dispatch(updateQuantity({ id, quantity }));
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const calculateTotal = () => {
    let totalPrice = calculateTotalPrice();
    let memberDiscount = isMemberChecked ? totalPrice * 0.1 : 0;
    let dayTimeDiscount = isDayEventChecked ? totalPrice * 0.2 : 0;

    return totalPrice - memberDiscount - dayTimeDiscount;
  };

  const [isCartSelected, setisCartSelected] = useState(true);
  const [isCheckOutSelected, setisCheckOutSelected] = useState(false);
  const [isHistorySelected, setIsHistorySelected] = useState(false);

  const selectCartTab = () => {
    setisCartSelected(true);
    setisCheckOutSelected(false);
    setIsHistorySelected(false);
  };
  const selectCheckoutTab = () => {
    if (cartItems.length > 0) {
      setisCartSelected(false);
      setisCheckOutSelected(true);
      setIsHistorySelected(false);
    }
  };
  const selectHistoryTab = () => {
    setisCartSelected(false);
    setisCheckOutSelected(false);
    setIsHistorySelected(true);
  };

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      selectCheckoutTab();
    }
  };

  const handleCheckoutBack = () => {
    selectCartTab();
  };

  const handleGoToPlaceOrder = () => {
    selectCartTab();
  };

  const handleCompleteOrder = async (e) => {
    e.preventDefault();

    if (paymentMethod === "cod" && cartItems.length > 0) {
      try {
        // Prepare order data
        const orderData = {
          user: {
            name: userName,
            mobileNumber: userMobileNumber,
            address: userAddress,
          },
          items: cartItems.map((item) => ({
            productId: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            vendorId: item.vendorId, // Make sure cart items have vendorId
          })),
          total: calculateTotalPrice(),
          discount:
            (isMemberChecked ? calculateTotalPrice() * 0.1 : 0) +
            (isDayEventChecked ? calculateTotalPrice() * 0.2 : 0),
          paymentMethod: "cod",
        };

        // Save to backend
        const response = await fetch("http://localhost:3000/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to create order");
        }

        // Update local history
        dispatch(
          updateHistory({
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            items: [...cartItems],
            total: calculateTotalPrice(),
            discount: orderData.discount,
          })
        );

        // Clear cart and show modal
        setOrder([...cartItems]);
        setIsModalOpen(true);
        dispatch(emptyCart());
        setUserName("");
        setUserMobileNumber("");
        setUserAddress("");
      } catch (error) {
        console.error("Checkout error:", error);
        alert(`Checkout failed: ${error.message}`);
      }
    }
  };

  let orderPrice = 0;
  order.map((item) => (orderPrice = orderPrice + item.price * item.quantity));
  let orderDiscount1 = isMemberChecked ? orderPrice * 0.1 : 0;
  let orderDiscount2 = isDayEventChecked ? orderPrice * 0.2 : 0;

  const today = new Date();

  const options = {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const formattedDate = today.toLocaleDateString("en-US", options);

  const handleItemClick = (id, name) => {
    dispatch(setSelectedtItem(id));
    navigate(`/catalogue/${name}`);
  };

  return (
    <>
      <Navigation />
      <div className="flex justify-center w-full">
        <div className="w-full md:px-0 px-16 md:w-2/5 mb-5 mt-10 ml-3 flex flex-col min-h-[95vh] ">
          <div className="top flex justify-between pl-10 pr-10 mb-5">
            <button
              onClick={selectCartTab}
              className={`flex items-center gap-2 pt-2 pb-2 pl-5 pr-5 rounded-lg text-sm ${
                isCartSelected ? "bg-white" : ""
              }`}
            >
              <h2
                className={
                  isCartSelected
                    ? " font-medium text-2xl bg-[#468378] text-white px-10 py-4 rounded-xl fade-in"
                    : "font-medium text-2xl bg-[#F4F8F7] px-10 py-4 rounded-xl "
                }
              >
                Cart
              </h2>
            </button>
            <button
              onClick={selectCheckoutTab}
              className={`flex items-center gap-2 pt-2 pb-2 pl-5 pr-5 rounded-lg text-sm ${
                isCheckOutSelected ? "bg-white" : ""
              }`}
            >
              <h2
                className={
                  isCheckOutSelected
                    ? " font-medium text-2xl bg-[#468378] text-white px-10 py-4 rounded-xl fade-in"
                    : "font-medium text-2xl bg-[#F4F8F7] px-10 py-4 rounded-xl "
                }
              >
                Check out
              </h2>
            </button>

            <button
              onClick={selectHistoryTab}
              className={`flex items-center gap-2 pt-2 pb-2 pl-5 pr-5 rounded-lg text-sm ${
                isHistorySelected ? "bg-white" : ""
              }`}
            >
              <h2
                className={
                  isHistorySelected
                    ? " font-medium text-2xl bg-[#468378] text-white px-10 py-4 rounded-xl fade-in"
                    : "font-medium text-2xl bg-[#F4F8F7] px-10 py-4 rounded-xl "
                }
              >
                History
              </h2>
            </button>
          </div>
          {isCartSelected && (
            <>
              <div className="flex flex-col flex-1 overflow-hidden fade-in">
                <div className="cart-top text-white rounded-tr-lg rounded-tl-lg pt-3 pb-3 pl-7 pr-7">
                  <h2 className="text-lg font-semibold">New Order</h2>
                  <p className="text-sm text-white">{formattedDate}</p>
                </div>
                <div className="cart-content flex-1 overflow-y-auto pt-2 pb-2 pr-4 pl-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="">
                      <div className="flex items-center justify-between p-4 border-b border-gray-200 fade-in">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => dispatch(deleteFromCart(item.id))}
                          >
                            <img src={deleteIcon} alt="Delete" />
                          </button>

                          <div className="flex flex-col ml-5">
                            <h2 className="text-2xl font-semibold text-gray-700">
                              {item.name}
                            </h2>
                            <h4 className="text-xl text-gray-400">
                              @ {item.price}
                            </h4>
                          </div>
                        </div>
                        <div className="flex items-center gap-5">
                          <input
                            type="number"
                            className="w-16 outline-none text-xl border rounded-md pl-2"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(e.target.value, item.id)
                            }
                          />
                          <h2 className="text-2xl font-semibold w-32 text-right">
                            {item.price * item.quantity}
                          </h2>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full bg-[#edf3f1] p-10 rounded-xl flex flex-col gap-2 mb-40">
                <div className="flex justify-between items-center">
                  <p className="text-xl text-gray-500">Subtotal</p>
                  <h2 className="text-xl font-semibold">
                    {calculateTotalPrice()}
                  </h2>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <div className="flex items-center gap-2">
                    <p className="text-xl text-gray-500">Dicount</p>
                  </div>
                  <h2 className="text-xl font-medium red-text">0</h2>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <p className="text-2xl font-semibold">Total</p>
                  <h2 className="text-3xl font-semibold text-[#468378]">
                    {calculateTotal()}
                  </h2>
                </div>
                <div className="flex justify-center gap-5">
                  <button
                    onClick={handleCheckout}
                    className="flex items-center mt-5 justify-center rounded-xl bg-[#2C3433] text-white gap-2"
                  >
                    <h3 className="text-2xl px-10 py-4">Check out</h3>
                  </button>
                </div>
              </div>
            </>
          )}

          {isCheckOutSelected && (
            <>
              <>
                <div className="flex flex-col flex-1 overflow-hidden fade-in">
                  <div className="cart-top text-white rounded-tr-lg rounded-tl-lg pt-3 pb-3 pl-7 pr-7">
                    <h2 className="text-lg font-semibold">Check out</h2>
                    <p className="text-sm text-white">{formattedDate}</p>
                  </div>
                  <div className="cart-content flex-1 overflow-y-auto pt-1 pb-1 pr-4 pl-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="fade-in">
                        <div className="flex items-center justify-between pt-2 pb-2 pl-4 pr-4 border-b border-gray-200">
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                              <h2
                                // onClick={handleItemClick(item.id, item.name)}
                                className="text-2xl font-bold text-gray-700"
                              >
                                {item.name}
                              </h2>
                              <h4 className="text-xl text-gray-400">
                                @ {item.price}
                              </h4>
                            </div>
                          </div>
                          <div className="flex items-center gap-10">
                            <h3 className="text-2xl">x{item.quantity}</h3>
                            <h2 className="text-2xl font-semibold w-16 text-right">
                              {item.price * item.quantity}
                            </h2>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* <div className="w-full bg-white p-5 pb-0 flex flex-col gap-2 mb-40"> */}
                <div className="w-full bg-[#edf3f1] p-10 rounded-xl flex flex-col gap-2 mb-40">
                  <div className="flex justify-between items-center">
                    <p className="text-xl text-gray-500">Subtotal</p>
                    <h2 className="text-xl font-semibold">
                      {calculateTotalPrice()}
                    </h2>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xl text-gray-500">Discount:</p>
                    <h2 className="text-xl font-semibold">0</h2>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <p className="text-2xl font-semibold">Total</p>
                    <h2 className="text-3xl font-semibold text-[#468378]">
                      {calculateTotal()}
                    </h2>
                  </div>
                  <hr />
                  <div className="mt-2 mb-4">
                    {/* <div className="w-full bg-[#edf3f1] p-10 rounded-xl flex flex-col gap-2 mb-40"> */}
                    <form className="w-full" onSubmit={handleCompleteOrder}>
                      <div className="flex sm:flex-row flex-col">
                        <input
                          required
                          type="text"
                          className="text-xl w-full sm:w-3/5 border-gray-300 border outline-none py-3 px-6 rounded-md mb-2 mr-3 "
                          placeholder="Enter Name... "
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                        />
                        <input
                          required
                          type="number"
                          className="text-xl w-full sm:w-2/5 border-gray-300 border outline-none py-3 px-6 rounded-md mb-2 mr-3 "
                          placeholder="Enter Mobile Number... "
                          value={userMobileNumber}
                          onChange={(e) => setUserMobileNumber(e.target.value)}
                        />
                      </div>
                      <input
                        required
                        type="text"
                        className="text-xl w-full border-gray-300 border outline-none py-3 px-6 rounded-md mb-2 mr-3 "
                        placeholder="Enter Delivery Address ... "
                        value={userAddress}
                        onChange={(e) => setUserAddress(e.target.value)}
                      />
                      <div className="flex gap-6 items-center mt-4">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="payment"
                            value="cod"
                            className="mr-2"
                            defaultChecked
                            onChange={(e) => setPaymentMethod(e.target.value)}
                          />
                          <h2 className="text-xl">Cash on delivery</h2>
                        </div>
                        <div></div>
                      </div>
                      <div className="mt-3 flex justify-center gap-5">
                        <button
                          onClick={handleCheckoutBack}
                          className=" text-xl flex items-center justify-center rounded-xl px-10 py-4 border border-[#468378] gap-2"
                        >
                          <h3>Back</h3>
                        </button>
                        <button className=" text-xl flex items-center justify-center rounded-xl px-10 py-4 bg-[#2C3433] text-white gap-2">
                          <h3>Complete Order</h3>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                {isModalOpen && (
                  <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center fade-in">
                    <div className="bg-white rounded-lg shadow-lg w-2/3">
                      <div className="p-5">
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-lg font-semibold"> </h2>
                          <button onClick={closeModal}>
                            <img src={crossIcon} alt="Close" />
                          </button>
                        </div>
                        <div className="flex items-center flex-col justify-center mb-10">
                          <h1 className="text-2xl font-semibold mb-4">
                            Your Order has been placed!
                          </h1>
                          <h1 className="text-xl font-medium">Order Summary</h1>
                        </div>

                        <div>
                          <div className="flex mb-6">
                            <p className="text-lg w-1/12 font-semibold">No.</p>
                            <p className="text-lg w-8/12 font-semibold">
                              Item Name
                            </p>
                            <p className="text-lg w-2/12 font-semibold">
                              Quantity
                            </p>
                            <p className="text-lg w-3/12 font-semibold text-right">
                              Total Price
                            </p>
                          </div>
                          <div className="flex flex-col justify-between w-full">
                            {order.map((item, index) => (
                              <div key={index} className="flex mb-2 w-full">
                                <p className="text-lg w-1/12">{index + 1}.</p>
                                <p className="text-lg w-8/12">{item.name}</p>
                                <p className="text-lg w-2/12">
                                  {item.quantity}
                                </p>
                                <p className="text-lg w-3/12 text-right">
                                  {item.price * item.quantity}
                                </p>
                              </div>
                            ))}
                          </div>
                          <hr className="mt-3 mb-3" />

                          <div className="flex flex-col justify-between w-full">
                            <div className="flex mb-2 w-full">
                              <p className="w-1/12"></p>
                              <p className="w-8/12"></p>
                              <p className="w-2/12 font-semibold text-xl">
                                Subtotal:
                              </p>
                              <p className="w-3/12 font-semibold text-right text-xl">
                                {orderPrice}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col justify-between w-full">
                            <div className="flex mb-2 w-full">
                              <p className="w-1/12"></p>
                              <p className="w-8/12"></p>
                              <p className="w-2/12 font-semibold text-xl">
                                Discount:
                              </p>
                              <p className="w-3/12  text-right text-xl">
                                - {orderDiscount1 + orderDiscount2}
                              </p>
                            </div>
                          </div>
                          <hr className="mt-3 mb-3" />
                          <div className="flex flex-col justify-between w-full">
                            <div className="flex mb-2 w-full">
                              <p className="w-1/12"></p>
                              <p className="w-8/12"></p>
                              <p className="w-2/12 font-semibold text-2xl">
                                Total:
                              </p>
                              <p className="w-3/12 font-semibold text-right text-2xl">
                                {orderPrice - orderDiscount1 - orderDiscount2}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            </>
          )}
          {isHistorySelected && (
            <div className="flex flex-col flex-1 overflow-hidden fade-in">
              <div className="cart-top text-white rounded-tr-lg rounded-tl-lg pt-3 pb-3 pl-7 pr-7">
                <h2 className="text-lg font-semibold">History</h2>
                <p className="text-sm text-white">{formattedDate}</p>
              </div>

              <div className="w-full h-full bg-white p-5 flex flex-col gap-0 mb-40 overflow-y-auto">
                {history.length > 0 ? (
                  history.map((order, index) => (
                    <div key={index} className="mb-0">
                      <div className="flex flex-col items-center justify-center mb-2">
                        <h3 className="text-xl font-semibold text-[#468378]">
                          {order.date}
                        </h3>
                        <h3 className="text-xl italic red-text">
                          {order.time}
                        </h3>
                      </div>
                      {order.items.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="flex items-center justify-between pt-0 pb-1 pl-4 pr-4 border-gray-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                              <h2 className="text-xl font-medium text-gray-700">
                                {item.name}
                              </h2>
                              {/* <h4 className="text-sm text-gray-400">@ {item.price}</h4> */}
                            </div>
                          </div>
                          <div className="flex items-center gap-10 text-gray-700">
                            <h3 className="text-xl">x{item.quantity}</h3>
                            <h2 className="text-xl w-16 text-right">
                              {item.price * item.quantity}
                            </h2>
                          </div>
                        </div>
                      ))}
                      <div className="mt-3">
                        <div className="pl-4 pr-4 flex mt-1 justify-end">
                          <div className="flex justify-between items-center w-1/2 ">
                            <p className="text-xl">Subtotal:</p>
                            <h2 className="text-xl font-medium">
                              {order.total}
                            </h2>
                          </div>
                        </div>
                        <div className="pl-4 pr-4 flex mt-1 justify-end">
                          <div className="flex justify-between items-center w-1/2 ">
                            <p className="text-xl">Discount:</p>
                            <h2 className="text-xl font-medium">
                              - {order.discount}
                            </h2>
                          </div>
                        </div>
                        <div className="pl-4 pr-4 flex mt-5 justify-end">
                          <div className="flex justify-between items-center w-1/2 ">
                            <p className="text-2xl font-semibold">Total:</p>
                            <h2 className="text-2xl font-semibold text-[#468378]">
                              {order.total - order.discount}
                            </h2>
                          </div>
                        </div>
                      </div>
                      <hr className="mt-4 mb-4" />
                    </div>
                  ))
                ) : (
                  <p>No history available</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
