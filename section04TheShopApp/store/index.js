import { configureStore } from "@reduxjs/toolkit";
import productSlice from "./products-slice";
import cartSlice from "./cart-slice";
import orderSlice from "./orders-slice";

const store = configureStore({
  reducer: {
    products: productSlice.reducer,
    cart: cartSlice.reducer,
    order: orderSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
