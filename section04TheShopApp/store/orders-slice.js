import { createSlice } from "@reduxjs/toolkit";
import Order from "../models/order";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
  },
  reducers: {
    addOrder: (state, { payload }) => {
      const { items, amount } = payload;
      const newOrder = new Order(
        new Date().toString(),
        items,
        amount,
        new Date()
      );
      state.orders = state.orders.concat(newOrder);
    },
  },
});

export const { addOrder } = orderSlice.actions;
export default orderSlice;
