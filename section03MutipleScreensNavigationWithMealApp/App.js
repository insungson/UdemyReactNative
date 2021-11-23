import "react-native-gesture-handler";
// https://reactnavigation.org/docs/drawer-navigator
// 위의 링크에서 보면... 위와 같이 라이브러리를 import 하면 좋다고 되어있다.
import React, { useState } from "react";
import { Text, View } from "react-native";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";
import { enableScreens } from "react-native-screens";
// react-native-screens 는 Native 의 시스템 환경에서 좀더 최적화 하여 screen이 동작하게 도와준다!!
// (일반적인 View 보단 좀더 Native 에 가까운 screen(화면)을 제공하여 시스템의 최적화에 더 도움이 된다)
// -> screen 이동 시 훨씬 부드러운 transition이 적용된다.
// (** 네비게이션 라이브러리의 dependency 이다!! 그러므로 네비게이션 없이 사용해봤자 의미없다..)
// https://www.npmjs.com/package/react-native-screens
// https://docs.expo.dev/versions/latest/sdk/screens/
// https://codingbroker.tistory.com/98   (누군가의 설명)
enableScreens();

import MealsNavigator from "./navigation/MealsNavigator";

import mealsReducer from "./store/reducers/meals";

const rootReducer = combineReducers({
  meals: mealsReducer,
});

const store = createStore(rootReducer);

const fetchFonts = () => {
  return Font.loadAsync({
    "open-sans": require("./assets/fonts/OpenSans-Regular.ttf"),
    "open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf"),
  });
};

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setFontLoaded(true)}
        onError={(err) => console.log(err)}
      />
    );
  }

  return (
    <Provider store={store}>
      <MealsNavigator />
    </Provider>
  );
}

// reactNavigator 의 기본인 아래의 링크
// https://reactnavigation.org/docs/getting-started
// 에서 npm install @react-navigation/native  으로 설치해주고
// expo install react-native-screens react-native-safe-area-context
// 로 현재 expo 버전과 맞춰야하는 라이브러리는 따로 설치해준다.
// 그리고 아래의 Navigator 도 동일하게 모두 설치해준다.
// https://reactnavigation.org/docs/stack-navigator
// https://reactnavigation.org/docs/drawer-navigator
// https://reactnavigation.org/docs/bottom-tab-navigator
