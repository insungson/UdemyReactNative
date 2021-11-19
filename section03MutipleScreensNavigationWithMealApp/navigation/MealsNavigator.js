// Navigator 의 stack 은 screen(화면 컴포넌트)가 위로 계속 쌓이는 것으로 아래 링크의 gif? 파일에서
// 클릭해서 해당 화면 컴포넌트로 이동했다가 옆으로 밀어내거나 뒤로가기 하여 밑에 깔린 화면 컴포넌트가 보이는걸 확인할 수 있다.
// https://reactnavigation.org/docs/stack-navigator
// import 하는 방법은 reactNavigation 의 버전에 따라 다르기 때문에 위의 문서에서 버전을 확인후 해당 라이브러리를 가져와 사용해야한다.

//여리서 X6버전은 다르게 Navigation 처리를 하기 때문에 강의 내용을 따라하면 안된다..
// https://reactnavigation.org/docs/hello-react-navigation   를 참조하여 처리해보자
// defaultNavigationOptions 를 사용하여 처리하면 안되고... 아래 링크의 예시를 보고 screenOptions 을 통해 기본 세팅을 해야한다.
// https://reactnavigation.org/docs/stack-navigator#props

import React from "react";
import { Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import CategoriesScreen from "../screens/CategoriesScreen";
import CategoryMealsScreen from "../screens/CategoryMealsScreen";
import MealDetailScreen from "../screens/MealDetailScreen";
import Colors from "../constants/Colors";

export default MealsNavigator = () => {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor:
              Platform.OS === "android" ? Colors.primaryColor : "",
          },
          headerTintColor:
            Platform.OS === "android" ? "white" : Colors.primaryColor,
          // headerTitle: "A Screen",
          // 위에서 title을 설정해주면.. 아래의 다른 screen 에서
          // navigation.setOptions({title: '바꿀타이틀이름'}) 를 통해 title을 바꾸려고 해도 바뀌지 않는다.
        }}
      >
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
    </NavigationContainer>
  );
};
