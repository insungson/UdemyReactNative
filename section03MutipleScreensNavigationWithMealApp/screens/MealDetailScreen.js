import React, { useLayoutEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

// 커스텀하게 해더를 만들어도 상관없지만.. (2단원에서 한것처럼..)
// 여기선 쉽게처리하기 위해 라이브러리를 사용해보자 (아래 링크는 react navigation 에서 추천한 헤더버튼라이브러리)
// https://reactnavigation.org/docs/community-libraries-and-navigators/#react-navigation-header-buttons
// https://github.com/vonovak/react-navigation-header-buttons   (여기는 해당 라이브러리의 깃헙)
// https://github.com/vonovak/react-navigation-header-buttons#quick-example  (여기는 사용 예시코드!!)

import { MEALS } from "../data/dummy-data";
import HeaderButton from "../components/HeaderButton";

export default MealDetailScreen = ({
  navigation,
  route: {
    params: { mealId },
  },
}) => {
  const selectedMeal = MEALS.find((meal) => meal.id === mealId);

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
            iconName="ios-star"
            onPress={() => {
              console.log("Mark as favorite!");
            }}
          />
          {/* 위의 해당 아이콘은 https://icons.expo.fyi/  요기서 찾는다 */}
          {/* 참고로 OverflowMenu 도 있는데 이건 버튼(클릭시) -> 버튼 이 나오는 버튼이다. */}
        </HeaderButtons>
      ),
    });
  }, [navigation, selectedMeal]);

  return (
    <View style={styles.screen}>
      <Text>{selectedMeal.title}</Text>
      <Button
        title="Go Back to Categories"
        onPress={() => {
          navigation.popToTop();
        }}
      />
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
