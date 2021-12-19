import { createSlice } from "@reduxjs/toolkit";

import CartItem from "../models/cart-item";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: {},
    totalAmount: 0,
  },
  reducers: {
    addToCart: (state, action) => {
      const { product } = action.payload;
      console.log("product: ", product);

      const addedProduct = product;
      const prodPrice = addedProduct.price;
      const prodTitle = addedProduct.title;

      let updatedOrderNewCartItem;

      if (state.items[addedProduct.id]) {
        updatedOrderNewCartItem = new CartItem(
          state.items[addedProduct.id].quantity + 1,
          prodPrice,
          prodTitle,
          state.items[addedProduct.id].sum + prodPrice
        );
      } else {
        updatedOrderNewCartItem = new CartItem(
          1,
          prodPrice,
          prodTitle,
          prodPrice
        );
      }

      state.items[addedProduct.id] = updatedOrderNewCartItem;
      state.totalAmount = state.totalAmount + prodPrice;
    },
    removeFromCart: (state, action) => {
      const { productId } = action.payload;

      const selectedCartItem = state.items[productId];
      const currentQty = selectedCartItem.quantity;
      let updatedCartItems;
      if (currentQty > 1) {
        const updatedCartItem = new CartItem(
          selectedCartItem.quantity - 1,
          selectedCartItem.productPrice,
          selectedCartItem.productTitle,
          selectedCartItem.sum - selectedCartItem.productPrice
        );
        state.items[productId] = updatedCartItem;
      } else {
        delete state.items[productId];
      }
      state.totalAmount = state.totalAmount - selectedCartItem.productPrice;
    },
    addOrderCart: (state, action) => {
      state.items = {};
      state.totalAmount = 0;
    },
    deleteProduct: (state, action) => {
      const { productId } = action.payload;
      if (!state.items[productId]) {
        state;
      }
      const itemTotal = state.items[productId].sum;
      delete state.items[productId];
      state.totalAmount = state.totalAmount = itemTotal;
    },
  },
});

export const { addOrderCart, removeFromCart, addToCart, deleteProduct } =
  cartSlice.actions;
export default cartSlice;
