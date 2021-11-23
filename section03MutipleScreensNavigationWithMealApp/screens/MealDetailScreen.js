import React, { useCallback, useLayoutEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";
import { toggleFavorite } from "../store/actions/meals";

// 커스텀하게 해더를 만들어도 상관없지만.. (2단원에서 한것처럼..)
// 여기선 쉽게처리하기 위해 라이브러리를 사용해보자 (아래 링크는 react navigation 에서 추천한 헤더버튼라이브러리)
// https://reactnavigation.org/docs/community-libraries-and-navigators/#react-navigation-header-buttons
// https://github.com/vonovak/react-navigation-header-buttons   (여기는 해당 라이브러리의 깃헙)
// https://github.com/vonovak/react-navigation-header-buttons#quick-example  (여기는 사용 예시코드!!)

import { MEALS } from "../data/dummy-data";
import HeaderButton from "../components/HeaderButton";
import DefaultText from "../components/DefaultText";

const ListItem = (props) => {
  return (
    <View style={styles.listItem}>
      <DefaultText>{props.children}</DefaultText>
    </View>
  );
};

export default MealDetailScreen = ({
  navigation,
  route: {
    params: { mealId },
  },
}) => {
  const currentMealIsFavorite = useSelector((state) =>
    state.meals.favoriteMeals.some((meal) => meal.id === mealId)
  );
  const availableMeals = useSelector((state) => state.meals.meals);
  const selectedMeal = availableMeals.find((meal) => meal.id === mealId);

  const dispatch = useDispatch();

  const toggleFavoriteHandler = useCallback(() => {
    dispatch(toggleFavorite(mealId));
  }, [dispatch, mealId]);

  // 헤더의 버튼 설정도 여기서 확인하면 된다.
  // https://reactnavigation.org/docs/header-buttons
  useLayoutEffect(() => {
    navigation.setOptions({
      title: selectedMeal.title,
      headerRight: () => (
        // 아래의 HeaderButtons로 감싸고 HeaderButtonComponent 로 기본 설정을 해준다.
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          {/* Item 은 해당 라이브러리에서 만들어진 커스텀 버튼이다. 
        (물론 여러개의 Item 을 사용할 수 있다.)
        아래의 속성처럼 넣으면 되고, 사용법은 해당 라이브러리의 링크에서 확인해보자! */}
          <Item
            title="Favorite"
            iconName={currentMealIsFavorite ? "ios-star" : "ios-star-outline"}
            onPress={toggleFavoriteHandler}
          />
          {/* 위의 해당 아이콘은 https://icons.expo.fyi/  요기서 찾는다 */}
          {/* 참고로 OverflowMenu 도 있는데 이건 버튼(클릭시) -> 버튼 이 나오는 버튼이다. */}
        </HeaderButtons>
      ),
    });
  }, [navigation, selectedMeal, currentMealIsFavorite, toggleFavoriteHandler]);

  return (
    // <View style={styles.screen}>
    //   <Text>{selectedMeal.title}</Text>
    //   <Button
    //     title="Go Back to Categories"
    //     onPress={() => {
    //       navigation.popToTop();
    //     }}
    //   />
    // </View>
    <ScrollView>
      <Image source={{ uri: selectedMeal.imageUrl }} style={styles.image} />
      <View style={styles.detail}>
        <DefaultText>{selectedMeal.duration}</DefaultText>
        <DefaultText>{selectedMeal.complexity.toUpperCase()}</DefaultText>
        <DefaultText>{selectedMeal.affordability.toUpperCase()}</DefaultText>
      </View>
      <Text style={styles.title}>Ingredients</Text>
      {selectedMeal.ingredients.map((ingredient) => (
        <ListItem key={ingredient}>{ingredient}</ListItem>
      ))}
      <Text style={styles.title}>Steps</Text>
      {selectedMeal.steps.map((step) => (
        <ListItem key={step}>{step}</ListItem>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 200,
  },
  detail: {
    flexDirection: "row",
    padding: 15,
    justifyContent: "space-around",
  },
  title: {
    fontFamily: "open-sans-bold",
    fontSize: 22,
    textAlign: "center",
  },
  listItem: {
    marginVertical: 10,
    marginHorizontal: 20,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
  },
});
