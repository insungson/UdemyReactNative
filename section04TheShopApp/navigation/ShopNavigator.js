import React from "react";
import { Platform, Button } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerItem,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";

import Colors from "../constants/Colors";

import ProductOverviewScreen from "../screens/shop/ProductOverviewScreen";
import ProductDetailScreen from "../screens/shop/ProductDetailScreen";
import CartScreen from "../screens/shop/CartScreen";

import OrderScreen from "../screens/shop/OrderScreen";

import EditProductScreen from "../screens/user/EditProductScreen";
import UserProductsScreen from "../screens/user/UserProductsScreen";

import AuthScreen from "../screens/user/AuthScreen";

import StartupScreen from "../screens/StartupScreen";

import { useDispatch } from "react-redux";
import { logOut } from "../store/auth-slice";

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

// "Orders" 가 2번들어갔기 떄문에 충돌? 같은 경고가 뜨긴하는데.. 나중에 이부분은 바꿔야 한다.
const OrderNavigator = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator screenOptions={defaultStackNavOptions}>
      <Stack.Screen name="Orderscreen" component={OrderScreen} />
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

// 로그아웃 버튼을 위한 함수이다.
// https://reactnavigation.org/docs/drawer-navigator#props
// 에서 drawerNavigator 에서 버튼만 추가하는 방식으로 처리하였다. (DrawerItem 로 검색!)
const AddDrawerContent = (props) => {
  const dispatch = useDispatch();

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="LogOut"
        // style={Colors.primary}
        icon={({ color, size, focused }) => (
          <Ionicons
            name={Platform.OS === "android" ? "md-log-out" : "ios-log-out"}
            size={23}
            color={color}
          />
        )}
        onPress={() => {
          dispatch(logOut({}));
        }}
      />
    </DrawerContentScrollView>
  );
};

const ShopDrawerNavigator = () => {
  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <AddDrawerContent {...props} />}
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
export const MainAuthNavigator = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        ...defaultStackNavOptions,
        headerLeft: null, // 헤더의 left 에서 뒤로가기 버튼이 자동으로 생성되기 때문에 없애주는 역할을 함!
      }}
    >
      <Stack.Screen name="Startup" component={StartupScreen} />
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="Shop" component={ShopDrawerNavigator} />
    </Stack.Navigator>
  );
};

// export default MainNavigator = () => {
//   // https://reactnavigation.org/docs/navigating-without-navigation-prop/
//   // 여기서 'Auth' 주소로 보낼 navigate 처리를 하면 어떨까?..
//   return <NavigationContainer>{MainAuthNavigator()}</NavigationContainer>;
// };
