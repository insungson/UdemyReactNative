import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Order from "../models/order";

// 주문 보내기
export const fetchAddOrder = createAsyncThunk(
  "fetchAddOrder",
  async ({ items, amount }) => {
    const date = new Date();
    const response = await axios.post(
      "https://react-http-text-default-rtdb.firebaseio.com/reactNative/orders/u1.json",
      { cartItems: items, totalAmount: amount, date: date.toISOString() }
    );

    if (response.status === 200) {
      return {
        id: response.data.name,
        items: items,
        amount: amount,
        date: date,
      };
    } else {
      throw new Error(response.statusText);
    }
  }
);

// 주문 목록 가져오기
export const fetchOrders = createAsyncThunk("fetchOrders", async () => {
  const response = await axios.get(
    "https://react-http-text-default-rtdb.firebaseio.com/reactNative/orders/u1.json"
  );
  const loadedOrders = [];
  if (response.status === 200) {
    console.log("response: ", response.data);
    if (response.data) {
      let keys = Object.keys(response.data);
      keys.forEach((key) => {
        loadedOrders.push(
          new Order(
            key,
            response.data[key].cartItems,
            response.data[key].totalAmount,
            new Date(response.data[key].date)
          )
        );
      });
      return { loadedOrders };
    }
  } else {
    throw new Error(response.statusText);
  }
});

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
  extraReducers: {
    // **************
    // @주문 추가 처리
    [fetchAddOrder.pending.type]: (
      state,
      { type, meta: { requestId, arg } }
    ) => {},
    [fetchAddOrder.fulfilled.type]: (
      state,
      { payload, meta: { requestId, arg } }
    ) => {
      const { id, items, amount, date } = payload;
      state.orders = state.orders.concat(new Order(id, items, amount, date));
    },
    [fetchAddOrder.rejected.type]: (
      state,
      {
        error: { code, message, name, stack },
        meta: { requestId, arg, aborted, condition },
      }
    ) => {},
    // *************
    // @주문 목록 가져오기
    [fetchOrders.pending.type]: (
      state,
      { type, meta: { requestId, arg } }
    ) => {},
    [fetchOrders.fulfilled.type]: (
      state,
      { payload, meta: { requestId, arg } }
    ) => {
      const { loadedOrders } = payload;
      state.orders = loadedOrders;
    },
    [fetchOrders.rejected.type]: (
      state,
      {
        error: { code, message, name, stack },
        meta: { requestId, arg, aborted, condition },
      }
    ) => {},
  },
});

export const { addOrder } = orderSlice.actions;
export default orderSlice;
