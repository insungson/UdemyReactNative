import React, { useLayoutEffect } from "react";
import { View, StyleSheet } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../components/HeaderButton";
import { useSelector } from "react-redux";

import MealList from "../components/MealList";
import { MEALS } from "../data/dummy-data";
import DefaultText from "../components/DefaultText";

export default FavoritesScreen = ({ navigation }) => {
  // const favMeals = MEALS.filter((meal) => meal.id === "m1" || meal.id === "m2");
  const favMeals = useSelector((state) => state.meals.favoriteMeals);

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

  if (favMeals.length === 0 || !favMeals) {
    return (
      <View style={styles.content}>
        <DefaultText>No favorite meals found. Start adding some!</DefaultText>
      </View>
    );
  }

  return <MealList listData={favMeals} navigation={navigation} />;
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
