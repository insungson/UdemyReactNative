import "react-native-gesture-handler";
import React, { useState } from "react";
import { Text, View } from "react-native";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import { enableScreens } from "react-native-screens";
import { Provider } from "react-redux";
import store from "./store";

import ShopNavigator from "./navigation/ShopNavigator";
import NavigationContainerForGlobalState from "./navigation/NavigatorContainerForGlobalState";

enableScreens();

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
        onFinish={() => {
          setFontLoaded(true);
        }}
        onError={(err) => {
          console.log(err);
        }}
      />
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainerForGlobalState />
      {/* <ShopNavigator /> */}
    </Provider>
  );
}
