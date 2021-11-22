import React, { useLayoutEffect } from "react";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../components/HeaderButton";

import MealList from "../components/MealList";
import { MEALS } from "../data/dummy-data";

export default FavoritesScreen = ({ navigation }) => {
  const favMeals = MEALS.filter((meal) => meal.id === "m1" || meal.id === "m2");

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Your Favorites",
      headerLeft: () => (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            title="Menu"
            iconName="ios-menu"
            onPress={() => {
              navigation.toggleDrawer();
            }}
          />
        </HeaderButtons>
      ),
    });
  }, [navigation]);

  return <MealList listData={favMeals} navigation={navigation} />;
};
