// 만약 navigation.replace('Screen 이름'); 으로 화면전환을 한다면...
// 현재 stack 이 없어지고 새로운 화면으로 대체된다.
// (뒤로가기 버튼도 없어지고 goBack()을 사용못하는건 당연하다)
// 이 기능은 유저가 로긴할때, 로긴되어졌을 때 이후 뒤로가기 기능을
// 사용못하게 stack 을 없애버리는 용도로 사용하면 유용하다

// FlatList의 numColums 는 컬럼갯수를 설정할 수 있다. (default 는 1이다. - 1줄에 1개)

// 아래의 예시처럼 CategoriesScreen.navigationOptions 로 처리하면 안되고 X6 버전에선 아래의 링크처럼
// https://reactnavigation.org/docs/screen-options-resolution/#setting-parent-screen-options-based-on-child-navigators-state
// navigation.setOptions({ headerTitle: getHeaderTitle(route) });  로 처리하는게 깔끔해보인다. -> 이거 되는지 테스트 해보자
// CategoriesScreen.navigationOptions  ->  CategoriesScreen.defaultNavigationOptions   으로 속성명이 바뀌었다고 나온다. 아래 참조링크
// https://reactnavigation.org/blog/2018/11/17/react-navigation-3.0/#renamed-navigationoptions-in-navigator-configuration
// ** 노트패드에 정리한 useEffectLayout 을 써서 처리하는게 좋아보인다... (일단 구버전이 되는지 확인부터 해보자)

// navigation.navigate('screen 이름', {categoryId: ~~}) 로 처리하면 된다. (X6 기준!!)

import React, { useLayoutEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { CATEGORIES } from "../data/dummy-data";
import CategoryGridTile from "../components/CategoryGridTile";

export default CategoriesScreen = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({ title: "Meals Categories" });
  }, [navigation]);

  const renderGridItem = (itemData) => {
    return (
      <CategoryGridTile
        title={itemData.item.title}
        color={itemData.item.color}
        onSelect={() => {
          navigation.navigate("CategoryMeals", {
            categoryId: itemData.item.id,
          });
        }}
      />
    );
  };

  return (
    <FlatList
      keyExtractor={(item, index) => item.id}
      data={CATEGORIES}
      renderItem={renderGridItem}
      numColumns={2}
    />
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  gridItem: {
    flex: 1,
    margin: 15,
    height: 150,
  },
});
