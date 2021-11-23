// 강좌의 예시처럼 const catId = props.navigation.getParam('categoryId'); 로 아이디를 받을 필요 없이 route.categoryId 로 받을 수 있다.
// https://reactnavigation.org/docs/route-prop   참조

import React, { useEffect, useLayoutEffect } from "react";
import { View, Text, Button, StyleSheet, FlatList } from "react-native";
import { useSelector } from "react-redux";

import { CATEGORIES, MEALS } from "../data/dummy-data";
import MealItem from "../components/MealItem";
import MealList from "../components/MealList";
import DefaultText from "../components/DefaultText";

export default CategoriesScreen = ({
  navigation,
  route: {
    params: { categoryId },
  },
}) => {
  const selectedCategory = CATEGORIES.find((cat) => cat.id === categoryId);
  //indexOf() 메서드는 호출한 String 객체에서 주어진 값과 일치하는 첫 번째 인덱스를 반환합니다
  // https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf   (참조)

  const availableMeals = useSelector((state) => state.meals.filteredMeals);

  const displayedMeals = availableMeals.filter(
    (meal) => meal.categoryIds.indexOf(categoryId) >= 0
  );

  useLayoutEffect(() => {
    navigation.setOptions({ title: selectedCategory.title });
  }, [navigation, selectedCategory]);

  if (displayedMeals.length === 0) {
    return (
      <View style={styles.content}>
        <DefaultText>No meals found, maybe check your filters?</DefaultText>
      </View>
    );
  }

  return <MealList listData={displayedMeals} navigation={navigation} />;
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
