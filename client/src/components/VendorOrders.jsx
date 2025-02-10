import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VendorDashboardSidebar from "./VendorDashboardSidebar";

const VendorOrders = () => {
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("vendorToken");
    if (!token) {
      navigate("/vendor/login"); // Redirect if no token
    }
  }, [navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("vendorToken");
        const response = await fetch(
          "https://gharbanao-87pi.onrender.com/api/orders/vendor",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch orders");
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="flex max-w-[1920px] m-auto">
      <VendorDashboardSidebar />
      <div className="flex-grow mr-16 mt-16 p-6">
        <h2 className="text-2xl font-bold mb-6">Order History</h2>
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-lg shadow-md p-4 mb-4"
          >
            <div className="flex justify-between mb-2">
              <span className="font-semibold">
                Order Date: {new Date(order.date).toLocaleDateString()}
              </span>
              <span className="font-semibold">Status: {order.status}</span>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold">Customer: {order.user.name}</h3>
              <p>Contact: {order.user.mobileNumber}</p>
              <p>Address: {order.user.address}</p>
            </div>
            {order.items.map((item, index) => (
              <div key={index} className="border-b py-2">
                <div className="flex justify-between">
                  <span>
                    {item.name} (x{item.quantity})
                  </span>
                  <span>PKR {item.price * item.quantity}</span>
                </div>
                <p className="text-sm text-gray-500">
                  Vendor Product ID: {item.productId}
                </p>
              </div>
            ))}
            <div className="mt-4 pt-2 border-t">
              <div className="flex justify-between">
                <span className="font-semibold">Total:</span>
                <span className="font-semibold">
                  PKR {order.total - order.discount}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorOrders;
