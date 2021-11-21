import React, { useLayoutEffect } from "react";

import MealList from "../components/MealList";
import { MEALS } from "../data/dummy-data";

export default FavoritesScreen = ({ navigation }) => {
  const favMeals = MEALS.filter((meal) => meal.id === "m1" || meal.id === "m2");
  console.log("favMeals: ", favMeals);

  useLayoutEffect(() => {
    navigation.setOptions({ title: "Your Favorites" });
  }, [navigation]);

  return <MealList listData={favMeals} navigation={navigation} />;
};
