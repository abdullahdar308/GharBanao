// client/src/features/cart/cartSlice.js

import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  orderItems: [],
  history: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, name, price, quantity, vendorId } = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        const newItem = {
          id,
          name,
          price,
          quantity,
          vendorId, // Make sure this is included
        };
        state.cartItems.push(newItem);
      }
    },

    deleteFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== action.payload
      );
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find((item) => item.id === id);
      if (item) {
        item.quantity = Math.max(quantity, 1);
      }
    },
    emptyCart: (state, action) => {
      state.cartItems = [];
    },
    updateHistory: (state, action) => {
      // state.history.push(action.payload);
      state.history = [action.payload, ...state.history];
    },
  },
});

export const {
  addToCart,
  updateQuantity,
  deleteFromCart,
  emptyCart,
  updateHistory,
  s,
} = cartSlice.actions;
export default cartSlice.reducer;
