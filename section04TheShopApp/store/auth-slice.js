// 토큰 저장용 기존 리덕스는 유지가 안되기 떄문에
// https://docs.expo.dev/versions/latest/sdk/async-storage/
// https://github.com/react-native-async-storage/async-storage
// https://react-native-async-storage.github.io/async-storage/docs/usage
// https://reactnavigation.org/docs/drawer-navigator
//
// 위의 코드에서 아래와 같이 바꿀 수 있다,
// function CustomDrawerContent(props) {
//   return (
//     <DrawerContentScrollView {...props}>
//       <DrawerItemList {...props} />
//       <DrawerItem label="Help" onPress={() => props.navigation.navigate('Article')} />
//     </DrawerContentScrollView>
//   );
// }
// https://reactnavigation.org/docs/use-navigation/     Shopnavigation을 감싸는 컨테이너에서 useLocation으로 접근한다.

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 토큰 저장시 사용할 함수
const saveDataToStorage = (token, userId, expirationDate) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token: token,
      userId: userId,
      expiryDate: expirationDate.toISOString(),
    })
  );
};
// 토큰 삭제시 사용할 함수 (extraReudcer가 아닌 기존의 reducer 사용함!)
const removeDataToStorage = () => {
  AsyncStorage.removeItem("userData");
};

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
      const { idToken, localId, expiresIn } = response.data;
      // 아래의 로직은 자동 로그인에 필요한 처리
      const expirationDate = new Date(
        new Date().getTime() + parseInt(expiresIn) * 1000
      );
      saveDataToStorage(idToken, localId, expirationDate);
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
      const { idToken, localId, expiresIn } = response.data;
      // 아래의 로직은 자동 로그인에 필요한 처리
      const expirationDate = new Date(
        new Date().getTime() + parseInt(expiresIn) * 1000
      );
      saveDataToStorage(idToken, localId, expirationDate);
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
  reducers: {
    // saveDataToStorage 를 통해 localStorage에 저장하고 여기서 다시 리듀서에 넣어준다!!
    authenticate: (state, action) => {
      const { token, userId } = action.payload;
      state.token = token;
      state.userId = userId;
    },
    logOut: (state, action) => {
      const { token, userId } = action.payload;
      // 기존의 localStorage에 있는 토큰은 삭제처리하고 state는 초기화 처리하기
      removeDataToStorage();
      state.token = null;
      state.userId = null;
    },
  },
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

export const { authenticate, logOut } = authSlice.actions;
export default authSlice;
