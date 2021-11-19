// 강좌의 예시처럼 const catId = props.navigation.getParam('categoryId'); 로 아이디를 받을 필요 없이 route.categoryId 로 받을 수 있다.
// https://reactnavigation.org/docs/route-prop   참조

import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, Text, Button, StyleSheet, FlatList } from "react-native";

import { CATEGORIES, MEALS } from "../data/dummy-data";
import MealItem from "../components/MealItem";

export default CategoriesScreen = ({
  navigation,
  route: {
    params: { categoryId },
  },
}) => {
  const selectedCategory = CATEGORIES.find((cat) => cat.id === categoryId);
  //indexOf() 메서드는 호출한 String 객체에서 주어진 값과 일치하는 첫 번째 인덱스를 반환합니다
  // https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/String/indexOf   (참조)
  const displayedMeals = MEALS.filter(
    (meal) => meal.categoryIds.indexOf(categoryId) >= 0
  );

  useLayoutEffect(() => {
    navigation.setOptions({ title: selectedCategory.title });
  }, [navigation, selectedCategory]);

  const renderMealItem = (itemData) => {
    return (
      <MealItem
        title={itemData.item.title}
        image={itemData.item.imageUrl}
        duration={itemData.item.duration}
        complexity={itemData.item.complexity}
        affordability={itemData.item.affordability}
        onSelectMeal={() => {
          navigation.navigate("MealDetail", { mealId: itemData.item.id });
        }}
      />
    );
  };

  return (
    <View style={styles.screen}>
      <FlatList
        data={displayedMeals}
        keyExtractor={(item, index) => item.id}
        // 위의 keyExtractor 의 item 은 데이터 배열내부의 1개 객체를 가르킨다.
        renderItem={renderMealItem}
        style={{ width: "100%" }}
      />
      {/* <Button
        title="Go to Details"
        onPress={() => {
          navigation.navigate("MealDetail");
        }}
      />
      <Button
        title="Go Back"
        onPress={() => {
          navigation.pop();
        }}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
