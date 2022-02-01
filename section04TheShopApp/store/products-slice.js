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
    const id = new Date().toString();
    //fetch로 처리해도 상관없다.
    // const response = await axios.get(
    //   "https://react-http-text-default-rtdb.firebaseio.com/meals.json"
    // );
    const response = await axios.post(
      "https://react-http-text-default-rtdb.firebaseio.com/reactNative/products.json",
      { id, title, imageUrl, description, price }
    );

    if (response.status == 200) {
      // console.log("responseData: ", response.data); // 콘솔로 찍어보면 name 을 고유의 id로 응답 받는다.. 유일
      return {
        id,
        title,
        imageUrl,
        description,
        price,
        name: response.data.name,
      };
    } else {
      throw new Error(response.statusText);
    }
  }
);

// 아래에서 try catch 문으로 발생한 에러를 프론트에서 dispatch로 가져오는 부분에서 찾을 수 있게 만든다.
// axios 를 사용하면 통신에러를 컨트롤 할 수 있기 떄문에 굳이 try catch 문을 사용하지 않아도 된다.
export const fetchProducts = createAsyncThunk("fetchProducts", async () => {
  const response = await axios.get(
    "https://react-http-text-default-rtdb.firebaseio.com/reactNative/products.json"
  );
  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error(response.statusText);
  }
});

// 업데이트 관련
export const fetchUpdateProducts = createAsyncThunk(
  "fetchUpdateProducts",
  async ({ firebaseKey, title, imageUrl, description, id }) => {
    const response = await axios.patch(
      // patch 는 업뎃이 된다!!
      `https://react-http-text-default-rtdb.firebaseio.com/reactNative/products/${firebaseKey}.json`,
      { title, imageUrl, description }
    );
    if (response.status === 200) {
      // console.log("response: ", response.data);
      // 위의 콘솔은 해당 객체가 들어있음.. { title, imageUrl, description }
      return { firebaseKey, id, ...response.data };
    } else {
      throw new Error(response.statusText);
    }
  }
);

// 삭제 관련
export const fetchDeleteProduct = createAsyncThunk(
  "fetchDeleteProduct",
  async ({ firebaseKey, id }) => {
    const response = await axios.delete(
      `https://react-http-text-default-rtdb.firebaseio.com/reactNative/products/${firebaseKey}.json`
    );
    if (response.status === 200) {
      console.log("response: ", response.data);
      return { id };
    } else {
      throw new Error(response.statusText);
    }
  }
);

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
    // ***********
    // @상품생성
    [fetchCreateProduct.pending.type]: (state, { paylaod, meta }) => {}, //pending 일땐 paylaod가 undefined 이다.
    [fetchCreateProduct.fulfilled.type]: (state, { payload, meta }) => {
      //fulfilled 일땐 payload가 fetchCreateProduct 의 리턴값이다.
      console.log("payload: ", payload);
      const { id, title, imageUrl, description, price, name } = payload;
      const newProduct = new Product(
        id,
        "u1",
        title,
        imageUrl,
        description,
        price
      );
      state.availableProducts = state.availableProducts.concat({
        ...newProduct,
        firebaseKey: name,
      });
      state.userProducts = state.userProducts.concat({
        ...newProduct,
        firebaseKey: name,
      });
    },
    [fetchCreateProduct.rejected.type]: (
      state,
      { payload, error: { message, code }, meta }
    ) => {}, // rejected 일땐 error객체의 code, message로 처리해준다.
    // *****************
    // @상품목록 가져오기
    [fetchProducts.pending.type]: (
      state,
      { type, payload, meta: { requestId, arg } }
    ) => {
      console.log("pendingType: ", type); // fetchProducts/pending  로 찍힌다.
      console.log("pendingPayload: ", payload); // pending 에서 이건 undefined 이다!!
      console.log("requestId: ", requestId);
      console.log("arg: ", arg);
    },
    [fetchProducts.fulfilled.type]: (state, { type, payload, meta }) => {
      console.log("fulfilledType: ", type); // fetchProducts/fulfilled 로 찍힌다!!
      const data = payload;
      let getData = [];
      if (data) {
        let keys = Object.keys(data);
        keys.forEach((key) => {
          const productObj = new Product(
            data[key].id,
            "u1",
            data[key].title,
            data[key].imageUrl,
            data[key].description,
            data[key].price
          );
          getData.push({ ...productObj, firebaseKey: key });
        });

        // data가 빈배열일땐 그대로 냅두고..
        if (getData.length > 0) {
          //기존의 데이터와 id 를 비교해서 있을때만 추가해준다! (include 에 포함되지 않는것만 추가해주기)
          const addData = getData.filter((resData) => {
            if (
              state.availableProducts.find((item) => item.id === resData.id)
            ) {
              return false;
            } else {
              return true;
            }
          });
          state.availableProducts = state.availableProducts.concat(addData);

          const userProductData = getData.filter((resData) => {
            if (state.userProducts.find((item) => item.id === resData.id)) {
              return false;
            } else {
              return true;
            }
          });

          state.userProducts = state.userProducts.concat(userProductData);
        }
      }
    },
    [fetchProducts.rejected.type]: (
      state,
      {
        type,
        error: { code, message, name, stack },
        paylaod,
        meta: { requestId, arg, aborted, condition },
      }
    ) => {
      console.log("type: ", type);
      console.log("code: ", code);
      console.log("message: ", message);
      console.log("name: ", name);
    },
    // ******************
    // @상품 업데이트 관련
    [fetchUpdateProducts.pending.type]: (state, { paylaod, meta }) => {},
    [fetchUpdateProducts.fulfilled.type]: (state, { payload, meta }) => {
      const { firebaseKey, id, title, imageUrl, description } = payload;
      // userProduct 리듀서 업데이트
      const userProductIndex = state.userProducts.findIndex(
        (product) => product.id === id
      );
      const updatedProduct = new Product(
        id,
        state.userProducts[userProductIndex].ownerId,
        title,
        imageUrl,
        description,
        state.userProducts[userProductIndex].price
      );
      state.userProducts[userProductIndex] = { ...updatedProduct, firebaseKey };
      // availableProduct 리듀서 업데이트
      const availableProductIndex = state.availableProducts.findIndex(
        (product) => product.id === id
      );
      const updatedAvailableProduct = new Product(
        id,
        state.availableProducts[availableProductIndex].ownerId,
        title,
        imageUrl,
        description,
        state.availableProducts[availableProductIndex].price
      );
      state.availableProducts[availableProductIndex] = {
        ...updatedAvailableProduct,
        firebaseKey,
      };
    },
    [fetchUpdateProducts.rejected.type]: (
      state,
      { error: { code, message }, payload, meta }
    ) => {},
    // ************
    // @상품 삭제 관련
    [fetchDeleteProduct.pending.type]: (
      state,
      { type, meta: { requestId, arg } }
    ) => {},
    [fetchDeleteProduct.fulfilled.type]: (
      state,
      { type, payload, meta: { requestId, arg } }
    ) => {
      const { id } = payload;
      // 리듀서 업데이트 처리
      state.userProducts = state.userProducts.filter(
        (product) => product.id !== id
      );
      state.availableProducts = state.availableProducts.filter(
        (product) => product.id !== id
      );
    },
    [fetchDeleteProduct.rejected.type]: (
      state,
      {
        error: { code, message, name, stack },
        meta: { requestId, arg, aborted, condition },
      }
    ) => {},
  },
});

export const { createProduct, updateProduct, deleteProduct } =
  productSlice.actions;
export default productSlice;
