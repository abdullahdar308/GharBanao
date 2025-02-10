import { configureStore } from "@reduxjs/toolkit";
import categoriesReducers from "../features/categories/categoriesSlice";
import cartReducers from "../features/cart/cartSlice";

export const store = configureStore({
  reducer: {
    categories: categoriesReducers,
    cart: cartReducers,
  },
});
