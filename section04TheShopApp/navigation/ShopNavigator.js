import React from "react";
import { Platform } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";

import Colors from "../constants/Colors";

import ProductOverviewScreen from "../screens/shop/ProductOverviewScreen";

const defaultStackNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === "android" ? Colors.primary : "",
  },
  headerTitleStyle: {
    fontFamily: "open-sans-bold",
  },
  headerBackTitleStyle: {
    fontFamily: "open-sans",
  },
  headerTintColor: Platform.OS === "android" ? "white" : Colors.primary,
};

const ProductsNavigator = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator screenOptions={defaultStackNavOptions}>
      <Stack.Screen name="ProductsOverview" component={ProductOverviewScreen} />
    </Stack.Navigator>
  );
};

const ShopDrawerNavigator = () => {
  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerActiveTintColor: Colors.primary,
        drawerLabelStyle: {
          fontFamily: "open-sans-bold",
        },
        headerShown: false, // 이걸 안해주면.. 헤더가 뜨기 때문에 해당 컴포넌트에서의 헤더와 더불어 2개의 헤더가 뜨게 된다
      }}
    >
      <Drawer.Screen
        name="Products"
        component={ProductsNavigator}
        // options={{drawerLabel: 'Products'}}
      />
    </Drawer.Navigator>
  );
};

export default MainNavigator = () => {
  return <NavigationContainer>{ShopDrawerNavigator()}</NavigationContainer>;
};
