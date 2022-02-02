import React from "react";
import { Platform } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";

import Colors from "../constants/Colors";

import ProductOverviewScreen from "../screens/shop/ProductOverviewScreen";
import ProductDetailScreen from "../screens/shop/ProductDetailScreen";
import CartScreen from "../screens/shop/CartScreen";

import OrderScreen from "../screens/shop/OrderScreen";

import EditProductScreen from "../screens/user/EditProductScreen";
import UserProductsScreen from "../screens/user/UserProductsScreen";

import AuthScreen from "../screens/user/AuthScreen";

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
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
    </Stack.Navigator>
  );
};

const OrderNavigator = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator screenOptions={defaultStackNavOptions}>
      <Stack.Screen name="Orders" component={OrderScreen} />
    </Stack.Navigator>
  );
};

const AdminNavigator = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator screenOptions={defaultStackNavOptions}>
      <Stack.Screen name="UserProducts" component={UserProductsScreen} />
      <Stack.Screen name="EditProduct" component={EditProductScreen} />
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
        options={{
          drawerIcon: ({ color, size, focused }) => (
            <Ionicons
              name={Platform.OS === "android" ? "md-cart" : "ios-cart"}
              size={23}
              color={color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Orders"
        component={OrderNavigator}
        options={{
          drawerIcon: ({ color, size, focused }) => (
            <Ionicons
              name={Platform.OS === "android" ? "md-list" : "ios-list"}
              size={23}
              color={color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Admin"
        component={AdminNavigator}
        options={{
          drawerIcon: ({ color, size, focused }) => (
            <Ionicons
              name={Platform.OS === "android" ? "md-create" : "ios-create"}
              size={23}
              color={color}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

// 예시 코드에선 createSwitchNavigator 를 사용하였지만.. V5 부터 해당 navigator는 없어졌다..
// 그래서 아래와 같이 createStackNavigator 로 대체한다.
const MainAuthNavigator = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator screenOptions={defaultStackNavOptions}>
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="Shop" component={ShopDrawerNavigator} />
    </Stack.Navigator>
  );
};

export default MainNavigator = () => {
  return <NavigationContainer>{MainAuthNavigator()}</NavigationContainer>;
};
