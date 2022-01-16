import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import PRODUCTS from "../data/dummy-data";
import Product from "../models/product";

// 아래의 createAsyncThunk 관련 함수는 사가처럼 따로 관리하는게 나을수 있다.
// 참조 링크(https://redux-toolkit.js.org/api/createAsyncThunk#examples) : reduxTookit 관련 함수
// 참조 링크(https://velog.io/@kyungjune/reduxtoolkit%EA%B3%BC-thunk-%EA%B8%B0%EB%B3%B8%EA%B0%9C%EB%85%90-%EC%97%B0%EC%8A%B5) : 누군가 axios 와 연결하여 만든 링크
// 참조 링크(https://blog.woolta.com/categories/1/posts/204) : 통신상태까지 정리한 부분
// 사용은 해당 페이지에서 dispatch(fetchCreateProduct(id, title, imageUrl, description));  이렇게 사용하면 된다!!
export const fetchCreateProduct = createAsyncThunk(
  "fetchCreateProduct", // toolkit의 이름이다.
  async ({ title, imageUrl, description, price }) => {
    console.log("price: ", price);
    console.log("description: ", description);
    console.log("imageUrl: ", imageUrl);
    console.log("title: ", title);
    const id = new Date().toString();
    //fetch로 처리해도 상관없다.
    // const response = await axios.get(
    //   "https://react-http-text-default-rtdb.firebaseio.com/meals.json"
    // );
    const response = await axios.post(
      "https://react-http-text-default-rtdb.firebaseio.com/reactNative/products.json",
      { id, title, imageUrl, description, price }
    );
    // const response = await fetch(
    //   "https://react-http-text-default-rtdb.firebaseio.com/reactNative/products.json",
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       id,
    //       title,
    //       description,
    //       imageUrl,
    //       price,
    //     }),
    //   }
    // );
    console.log("response통신결과:: ", response);
    // 성공일때 그냥 보낸 정보를 보내줌..(원래는 그냥 ok 만 처리해야할듯..)
    // if (response.status == 200) {
    return { id, title, imageUrl, description, price };
    // }
  }
);

export const fetchProducts = createAsyncThunk("fetchProducts", async () => {
  const response = await axios.get(
    "https://react-http-text-default-rtdb.firebaseio.com/reactNative/products.json"
  );
  return response.data;
});

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
      console.log("state.availableProducts: ", state.availableProducts);
      const availableProductIndex = state.availableProducts.findIndex(
        (prod) => prod.id === id
      );
      console.log("availableProductIndex: ", availableProductIndex);
      state.userProducts[productIndex] = updatedProduct;
      state.availableProducts[availableProductIndex] = updatedProduct;
    },
    deleteProduct: (state, action) => {
      const { id } = action.payload;

      state.availableProducts = state.availableProducts.filter(
        (prod) => prod.id !== id
      );
      state.userProducts = state.userProducts.filter((prod) => prod.id !== id);
    },
  },
  // https://redux-toolkit.js.org/api/createslice#the-extrareducers-map-object-notation  여기서 [] 의 형태로 사용한다.
  // https://redux-toolkit.js.org/api/createAsyncThunk#promise-lifecycle-actions 에 해당 파라미터 및 타입이 나와 있다.
  extraReducers: {
    // @상품생성
    [fetchCreateProduct.pending.type]: (state, { paylaod, meta }) => {}, //pending 일땐 paylaod가 undefined 이다.
    [fetchCreateProduct.fulfilled.type]: (state, { payload, meta }) => {
      //fulfilled 일땐 payload가 fetchCreateProduct 의 리턴값이다.
      console.log("payload: ", payload);
      const { id, title, imageUrl, description, price } = payload;
      console.log(
        "response Payload:: ",
        id,
        title,
        imageUrl,
        description,
        price
      );
      const newProduct = new Product(
        id,
        "u1",
        title,
        imageUrl,
        description,
        price
      );
      state.availableProducts = state.availableProducts.concat(newProduct);
      state.userProducts = state.userProducts.concat(newProduct);
    },
    [fetchCreateProduct.rejected.type]: (
      state,
      { payload, error: { message, code }, meta }
    ) => {}, // rejected 일땐 error객체의 code, message로 처리해준다.
    // @상품목록 가져오기
    [fetchProducts.pending.type]: (state, { payload, meta }) => {},
    [fetchProducts.fulfilled.type]: (state, { payload, meta }) => {
      const data = payload;
      // data가 빈배열일땐 그대로 냅두고..
      if (data.length > 0) {
        //기존의 데이터와 id 를 비교해서 있을때만 추가해준다! (include 에 포함되지 않는것만 추가해주기)
        const addData = data.filter(
          (resItem) =>
            !state.availableProducts.includes(
              (availableItem) => availableItem.id === resItem.id
            )
        );
        state.availableProducts = state.availableProducts.concat(addData);
        // state.userProducts 도 같은 작업해주고... 파이어베이스에서 생각한 데이터가 오는지 확인해보기!!
      }
    },
    [fetchProducts.rejected.type]: (
      state,
      { error: { code, message }, paylaod, meta }
    ) => {},
  },
});

export const { createProduct, updateProduct, deleteProduct } =
  productSlice.actions;
export default productSlice;
