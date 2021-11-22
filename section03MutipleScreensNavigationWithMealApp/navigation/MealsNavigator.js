// Navigator 의 stack 은 screen(화면 컴포넌트)가 위로 계속 쌓이는 것으로 아래 링크의 gif? 파일에서
// 클릭해서 해당 화면 컴포넌트로 이동했다가 옆으로 밀어내거나 뒤로가기 하여 밑에 깔린 화면 컴포넌트가 보이는걸 확인할 수 있다.
// https://reactnavigation.org/docs/stack-navigator
// import 하는 방법은 reactNavigation 의 버전에 따라 다르기 때문에 위의 문서에서 버전을 확인후 해당 라이브러리를 가져와 사용해야한다.

//여리서 X6버전은 다르게 Navigation 처리를 하기 때문에 강의 내용을 따라하면 안된다..
// https://reactnavigation.org/docs/hello-react-navigation   를 참조하여 처리해보자
// defaultNavigationOptions 를 사용하여 처리하면 안되고... 아래 링크의 예시를 보고 screenOptions 을 통해 기본 세팅을 해야한다.
// https://reactnavigation.org/docs/stack-navigator#props

import React from "react";
import { Platform, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// https://reactnavigation.org/docs/bottom-tab-navigator#options
// bottomTab 의 설정방법에 대한 문서 링크이다.
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
// https://reactnavigation.org/docs/material-bottom-tab-navigator#example
// MatrialBottomTab 에 대한 설정방법 문서 링크이다.
import { createDrawerNavigator } from "@react-navigation/drawer";

import CategoriesScreen from "../screens/CategoriesScreen";
import CategoryMealsScreen from "../screens/CategoryMealsScreen";
import MealDetailScreen from "../screens/MealDetailScreen";
import FavoriteScreen from "../screens/FavoritesScreen";
import FiltersScreen from "../screens/FiltersScreen";
import Colors from "../constants/Colors";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
// tab navigator 와 stack Navigator를 같이 사용 하는 방법은 아래의 링크처럼 사용하면 된다
// https://reactnavigation.org/docs/screen-options-resolution

const defaultStackNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === "android" ? Colors.primaryColor : "",
  },
  headerTintColor: Platform.OS === "android" ? "white" : Colors.primaryColor,
  // headerTitle: "A Screen",
  // 위에서 title을 설정해주면.. 아래의 다른 screen 에서
  // navigation.setOptions({title: '바꿀타이틀이름'}) 를 통해 title을 바꾸려고 해도 바뀌지 않는다.
};

const MealsNavigator = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator screenOptions={defaultStackNavOptions}>
      <Stack.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{ title: "A Screen" }}
        //위처럼 처리해도 title 설정은 된다 다만!! 이후 title은
        //CategoriesScreen 컴포넌트 내부의 useLayoutEffect 에 의해 오버라이트 처리된다.
      />
      <Stack.Screen name="CategoryMeals" component={CategoryMealsScreen} />
      <Stack.Screen name="MealDetail" component={MealDetailScreen} />
    </Stack.Navigator>
  );
};

const FavNavigator = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator screenOptions={defaultStackNavOptions}>
      <Stack.Screen name="Favorites" component={FavoriteScreen} />
      <Stack.Screen name="MealDetail" component={MealDetailScreen} />
    </Stack.Navigator>
  );
};

const TabNavigator = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      // initialRouteName="Feed" // 처음 로딩될때 보여줄 Tab 라우터
      screenOptions={{
        tabBarActiveTintColor: Colors.accentColor, //클릭시 변화시킬 색상
      }}
    >
      <Tab.Screen
        name="Meals"
        component={MealsNavigator}
        options={{
          tabBarLabel: "Meals",
          tabBarLabelStyle: {
            fontFamily: "open-sans",
          },
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name="ios-restaurant" size={25} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoriteScreen}
        options={{
          tabBarLabel: "Favorites!",
          tabBarLabelStyle: {
            fontFamily: "open-sans",
          },
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name="ios-star" size={25} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const MatrialTabNavigator = () => {
  const MatrialTab = createMaterialBottomTabNavigator();

  return (
    <MatrialTab.Navigator
      activeColor="white"
      // inactiveColor="#3e2465" //이렇게 구체적인 설정도 가능하다
      shifting={true}
      barStyle={{ backgroundColor: Colors.primaryColor }}
    >
      <MatrialTab.Screen
        name="Meals"
        component={MealsNavigator}
        options={{
          tabBarLabel: (
            <Text style={{ fontFamily: "open-sans-bold" }}>Meals</Text>
          ), //이렇게 처리해도 된다..;; 기존엔 그냥 'Meals' 로 처리했다.
          tabBarIcon: ({ focused, color }) => (
            <MaterialIcons name="favorite" size={25} color={color} />
          ),
          tabBarColor: Colors.primaryColor, // 이 옵션으로 탭의 칼러를 바꿀 수 있다.
        }}
      />
      <MatrialTab.Screen
        name="Favorites"
        component={FavNavigator}
        options={{
          tabBarLabel: "Favorites!",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name="ios-star" size={25} color={color} /> // 이렇게 Matrial이 아닌 다른 아이콘을 사용해도 된다.
          ),
          tabBarColor: Colors.accentColor,
        }}
      />
    </MatrialTab.Navigator>
  );
};

const FilterNavigator = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={defaultStackNavOptions}>
      <Stack.Screen name="Filters" component={FiltersScreen} />
    </Stack.Navigator>
  );
};

const DrawerNavigator = () => {
  const Drawer = createDrawerNavigator();
  let showTabBar =
    Platform.OS === "android" ? MatrialTabNavigator : TabNavigator;
  // 위처럼 모바일 기기별로 분기처리하여 처리할 수 도 있다.

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerActiveTintColor: Colors.accentColor,
        drawerLabelStyle: {
          fontFamily: "open-sans-bold",
        },
        headerShown: false, // 이걸 안해주면.. 헤더가 뜨기 때문에 해당 컴포넌트에서의 헤더와 더불어 2개의 헤더가 뜨게 된다
      }}
    >
      <Drawer.Screen
        name="MealsFavs"
        component={showTabBar}
        options={{ drawerLabel: "Meals" }}
      />
      <Drawer.Screen name="Filters" component={FilterNavigator} />
    </Drawer.Navigator>
  );
};

export default MainNavigatorTab = () => {
  return <NavigationContainer>{DrawerNavigator()}</NavigationContainer>;
};
