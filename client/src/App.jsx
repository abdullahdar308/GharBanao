import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignupForm from "./components/SignupForm";
import LoginForm from "./components/LoginForm";
import HomePage from "./components/HomePage";
import AdminLogin from "./components/AdminLogin";
import VendorDashboard from "./components/VendorDashboard";
import ProductInfo from "./components/ProductInfo";
import EditProductInfo from "./components/EditProductInfo.jsx";
import AddProduct from "./components/AddProduct.jsx";
import { useAuth } from "./contexts/AuthContext";
import CostEstimation from "./components/CostEstimation";
import Catalogue from "./components/Catalogue";
import Cart from "./components/Cart";
import ProductDetail from "./components/ProductDetail";
import Design from "./components/Design";
import SuperAdminDashboard from "./components/SuperAdminDashboard.jsx";
import AddVendor from "./components/AddVendor.jsx";
import ViewVendors from "./components/ViewVendors.jsx";
import VendorInfo from "./components/VendorInfo.jsx";
import VendorLogin from "./components/VendorLogin.jsx";
import VendorOrders from "./components/VendorOrders.jsx";
import ProductList from "./components/ProductList.jsx";

function App() {
  const { isAuthenticated, isAdminAuthenticated } = useAuth();

  console.log("User Authenticated: ", isAuthenticated);
  console.log("Admin Authenticated: ", isAdminAuthenticated);

  return (
    // <Router>
    <>
      <Routes>
        <Route
          path="/login"
          element={!isAuthenticated ? <LoginForm /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!isAuthenticated ? <SignupForm /> : <Navigate to="/" />}
        />
        <Route path="/" element={<HomePage />} />
        <Route path="/CostEstimation" element={<CostEstimation />} />
        <Route path="/Catalogue" element={<Catalogue />} />
        <Route path="/catalogue/:productName" element={<ProductDetail />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/Design" element={<Design />} />

        <Route path="/vendor/login" element={<VendorLogin />} />
        <Route path="/vendor/dashboard" element={<VendorDashboard />} />
        <Route path="/vendor/productInfo/:id" element={<ProductInfo />} />
        <Route path="/vendor/edit/:id" element={<EditProductInfo />} />
        <Route path="/vendor/addProduct" element={<AddProduct />} />
        <Route path="/vendor/orders" element={<VendorOrders />} />

        <Route path="/superadmin/login" element={<AdminLogin />} />
        <Route
          path="/superadmin/dashboard"
          element={
            isAdminAuthenticated ? <SuperAdminDashboard /> : <AdminLogin />
          }
        />
        <Route
          path="/superadmin/addVendor"
          element={isAdminAuthenticated ? <AddVendor /> : <AdminLogin />}
        />
        <Route
          path="/superadmin/viewVendors"
          element={isAdminAuthenticated ? <ViewVendors /> : <AdminLogin />}
        />
        <Route
          path="/superadmin/vendorInfo"
          element={isAdminAuthenticated ? <VendorInfo /> : <AdminLogin />}
        />
      </Routes>
    </>
    // </Router>
  );
}

export default App;
