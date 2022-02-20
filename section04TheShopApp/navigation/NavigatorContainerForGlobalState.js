// https://reactnavigation.org/docs/hello-react-navigation/
// NavigatorContainerForAuth.js 에서처럼 useRef로 켄테이너로 접근하려 하니깐.. 해당 함수를 불러올 수 없었다..
// 그래서 위의 링크에서 처럼 container 안에서 React의 state와 useEffect 를 사용하여 처리한다.

import React, { useState, useLayoutEffect, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  useNavigation,
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { MainAuthNavigator } from "./ShopNavigator";

const NavigationContainerForGlobalState = () => {
  const isAuth = useSelector(({ auth }) => !!auth.token);
  const navigationRef = useNavigationContainerRef();
  // https://reactnavigation.org/docs/navigating-without-navigation-prop/#handling-initialization
  // useNavigationContainerRef 사용시 아래의 에러가 발생할 수 있다.
  // The 'navigation' object hasn't been initialized yet.
  // if (navigationRef.isReady()) {}
  // 위의 링크에서처럼 위의 if문으로 문제를 해결하면 된다.
  console.log("isAuth: ", isAuth);
  // const navigation = useNavigation(); // 이거때문에 에러뜸..
  // const

  useEffect(() => {
    if (!isAuth) {
      if (navigationRef.isReady()) {
        navigationRef.navigate("Auth");
      }
    }
  }, [isAuth, navigationRef]);

  return (
    <NavigationContainer
      ref={navigationRef}
      // initialState={isAuth}
      // // onStateChange은 NavigationContainer 에 속한 모든 state에 접근이 가능하다!! (route, navigation의 모든 nav 확인 가능!)
      // onStateChange={(state) => {
      //   console.log("state123123: ", state);
      //   // if (state.) {}
      // }}
    >
      {MainAuthNavigator()}
    </NavigationContainer>
  );
};

export default NavigationContainerForGlobalState;
