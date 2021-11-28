import { createSlice } from "@reduxjs/toolkit";

import PRODUCTS from "../data/dummy-data";
import Product from "../models/product";

const productSlice = createSlice({
  name: "products",
  initialState: {
    availableProducts: PRODUCTS,
    userProducts: PRODUCTS.filter((prod) => prod.ownerId === "u1"),
  },
  reducers: {
    createProduct: (state, action) => {
      const { title, imageUrl, description, price } = action.payload;
      const newProduct = new Product(
        new Date().toString(),
        "u1",
        title,
        imageUrl,
        description,
        price
      );
      state.availableProducts = state.availableProducts.concat(newProduct);
      state.userProducts = state.userProducts.concat(newProduct);
    },
    updateProduct: (state, action) => {
      const { id, title, imageUrl, description } = action.payload;
      const productIndex = state.userProducts.findIndex(
        (prod) => prod.id === id
      );
      const updatedProduct = new Product(
        id,
        state.userProducts[productIndex].ownerId,
        title,
        imageUrl,
        description,
        state.userProducts[productIndex].price
      );
      const availableProductIndex = state.availableProducts.findIndex(
        (prod) => prod.id === id
      );

      state.userProducts = state.userProducts[productIndex] = updatedProduct;
      state.availableProducts = state.availableProducts[availableProductIndex] =
        updatedProduct;
    },
    deleteProduct: (state, action) => {
      const { id } = action.payload;

      state.availableProducts = state.availableProducts.filter(
        (prod) => prod.id !== id
      );
      state.userProducts = state.userProducts.filter((prod) => prod.id !== id);
    },
  },
});

export const productAction = productSlice.actions;
export default productSlice;
