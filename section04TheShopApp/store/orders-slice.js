import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Order from "../models/order";

// 주문 보내기
export const fetchAddOrder = createAsyncThunk(
  "fetchAddOrder",
  async ({ items, amount, token, userId }) => {
    const date = new Date();
    // https://firebase.google.com/docs/reference/rest/database   rest 요청에 대한 데이터베이스 관련 문서이다.
    // https://firebase.google.com/docs/database/rest/auth#generate_an_id_token   아래의 토큰포함 요청에 대한 문서이다.
    // 그냥 목록을 가져오는 fetchProduct 를 제외하고 CRUD 중 R 제외 나머진 전부 token을 넣어 요청하도록 하자!!
    const response = await axios.post(
      `https://react-http-text-default-rtdb.firebaseio.com/reactNative/orders/${userId}.json?auth=${token}`,
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

// 주문 목록 가져오기 (아이디를 기준으로 요청을 한다!!)
export const fetchOrders = createAsyncThunk(
  "fetchOrders",
  async ({ token, userId }) => {
    const response = await axios.get(
      `https://react-http-text-default-rtdb.firebaseio.com/reactNative/orders/${userId}.json`
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
  }
);

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
