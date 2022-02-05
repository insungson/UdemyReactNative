import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchSignUp = createAsyncThunk(
  "fetchSignUp",
  // https://firebase.google.com/docs/reference/rest/auth#section-create-email-password  참조
  async ({ email, password }) => {
    console.log(
      "email, password: ",
      email,
      typeof email,
      password,
      typeof password
    );
    const response = await axios.post(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBwuX3ywjJQxmnljVptj8b8ERxX7SlKLAk",
      { email: email, password: password, returnSecureToken: true }
    );
    if (response.status === 200) {
      console.log("(response: ", response.data);
      const { idToken, localId } = response.data;
      // 회원가입 시 token, localId 넣어줌!
      return { token: idToken, userId: localId };
    } else {
      let message = "Something went wrong!";
      if (errorId === "EMAIL_EXISTS") {
        message = "This email exists already!";
      }
      throw new Error(`${response.statusText} ${message}`);
    }
  }
);

// https://firebase.google.com/docs/reference/rest/auth#section-sign-in-email-password   로그인에 대한 파이어베이스 api 이다.
// 위의 링크에 에러코드도 나와있다.
export const fetchSignIn = createAsyncThunk(
  "fetchSignIn",
  async ({ email, password }) => {
    const response = await axios.post(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBwuX3ywjJQxmnljVptj8b8ERxX7SlKLAk",
      { email: email, password: password, returnSecureToken: true }
    );
    if (response.status === 200) {
      console.log("response: ", response.data);
      const { idToken, localId } = response.data;
      return { token: idToken, userId: localId };
    } else {
      const errorResData = response.data;
      const errorId = errorResData.error.message;
      let message = "Something wend wrong!";
      if (errorId === "EMAIL_NOT_FOUND") {
        message = "This email could not be found!!";
      } else if (errorId === "INVALID_PASSWORD") {
        message = "This password is not valid!!";
      } else if (errorId === "USER_DISABLED") {
        message = "This user can not use account!";
      }
      throw new Error(message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    userId: null,
  },
  reducers: {},
  extraReducers: {
    //// 회원가입!
    [fetchSignUp.pending.type]: (
      state,
      { type, meta: { requestId, arg } }
    ) => {},
    [fetchSignUp.pending.type]: (
      state,
      { payload, meta: { requestId, arg } }
    ) => {
      const { token, userId } = payload;
      state.token = token;
      state.userId = userId;
    },
    [fetchSignUp.pending.type]: (
      state,
      {
        error: { code, message, name, stack },
        meta: { requestId, arg, aborted, condition },
      }
    ) => {},
    //// 로그인
    [fetchSignIn.pending.type]: (
      state,
      { type, meta: { requestId, arg } }
    ) => {},
    [fetchSignIn.fulfilled.type]: (
      state,
      { payload, meta: { requestId, arg } }
    ) => {
      const { token, userId } = payload;
      state.token = token;
      state.userId = userId;
    },
    [fetchSignIn.rejected.type]: (
      state,
      {
        error: { code, message, name, stack },
        meta: { requestId, arg, aborted, condition },
      }
    ) => {},
  },
});

export default authSlice;
