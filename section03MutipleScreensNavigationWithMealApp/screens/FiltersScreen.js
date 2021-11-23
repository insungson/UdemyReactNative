import React, {
  useLayoutEffect,
  useEffect,
  useState,
  useCallback,
} from "react";
import { View, Text, StyleSheet, Switch, Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "../store/actions/meals";

import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../components/HeaderButton";
import Colors from "../constants/Colors";

// Switch 컴포넌트는 토글로 제공된다 (onValueChange 에서 value 의 값을 boolean 으로 처리할 수 있다.)
// https://reactnative.dev/docs/switch#trackcolor
// 위의 링크에서 살펴보면.... 스위치의 true, false 에 따른 색상의 변경처리도 가능하다!!
// thumbColor 은 버튼의 색상, trackcolor는 스위치 버튼의 잔상 색상 이다.
const FilterSwitch = ({ label, state, onChange }) => {
  return (
    <View style={styles.filterContainer}>
      <Text>{label}</Text>
      <Switch
        trackColor={{ true: Colors.primaryColor }}
        thumbColor={Platform.OS === "android" ? Colors.primaryColor : ""}
        value={state}
        onValueChange={onChange}
      />
    </View>
  );
};

export default FiltersScreen = ({
  navigation,
  // route: {
  //   params: { save },
  // },
}) => {
  const filterOPtions = useSelector((state) => state.meals.filterOptions);

  const [isGlutenFree, setIsGlutenFree] = useState(
    filterOPtions !== null ? filterOPtions?.glutenFree : false
  );
  const [isLactoseFree, setIsLactoseFree] = useState(
    filterOPtions !== null ? filterOPtions?.lactoseFree : false
  );
  const [isVegan, setIsVegan] = useState(
    filterOPtions !== null ? filterOPtions?.vegan : false
  );
  const [isVegetarian, setIsVegetarian] = useState(
    filterOPtions !== null ? filterOPtions?.isVegetarian : false
  );

  const dispatch = useDispatch();

  // useCallback 의 사용이유!
  // 자바스크립트에서 함수는 객체이다.
  // 컴포넌트 내부의함수는 컴포넌트가 재실행될때마다 재실행되기 때문에 비효율적이고
  // 내부 함수가 외부의 인자를 바꿔 컴포넌트를 재실행시킨다면.. 무한재실행이 일어난다...
  // useCallback 은 내부 함수를 Wrapping 처리하여 재실행을 막아준다.
  // 내부 함수는 오직 dependency의 값이 변할 때만  재실행이 된다!!
  const saveFilters = useCallback(() => {
    console.log(
      "isGlutenFree, isLactoseFree, isVegan, isVegetarian: ",
      isGlutenFree,
      isLactoseFree,
      isVegan,
      isVegetarian
    );
    const appliedFilters = {
      glutenFree: isGlutenFree,
      lactoseFree: isLactoseFree,
      vegan: isVegan,
      isVegetarian: isVegetarian,
    };
    console.log("appliedFilters: ", appliedFilters);

    dispatch(setFilters(appliedFilters));
    // return appliedFilters;
  }, [isGlutenFree, isLactoseFree, isVegan, isVegetarian, dispatch]);

  // useEffect(() => {
  //   console.log("saveFilters: ", saveFilters());
  //   navigation.setParams({ save: saveFilters() });
  //   // https://reactnavigation.org/docs/navigation-prop
  //   // https://reactnavigation.org/docs/navigation-prop#setparams
  //   // setParams 는 라우터의 params를 바꿔준다.(기존의 params 는 합쳐지게 된다)
  // }, [saveFilters]);
  // // navigation 를 dependency 에 넣지 않는 이유는.. navigation.setParams() 를 실행시
  // // navigation 가 변하게 되고 다시 dependency 의 navigation가 싫행되기 때문에 무한루프가 일어난다.

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Filter Meals",
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
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item title="Save" iconName="ios-save" onPress={saveFilters} />
        </HeaderButtons>
      ),
    });
  }, [navigation, saveFilters]);

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Available Filters / Restrictions</Text>
      <FilterSwitch
        label="Gluten-free"
        state={isGlutenFree}
        onChange={(newValue) => setIsGlutenFree(newValue)}
      />
      <FilterSwitch
        label="Lactose-free"
        state={isLactoseFree}
        onChange={(newValue) => setIsLactoseFree(newValue)}
      />
      <FilterSwitch
        label="Vegan"
        state={isVegan}
        onChange={(newValue) => setIsVegan(newValue)}
      />
      <FilterSwitch
        label="Vegetarian"
        state={isVegetarian}
        onChange={(newValue) => setIsVegetarian(newValue)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontFamily: "open-sans-bold",
    fontSize: 22,
    margin: 20,
    textAlign: "center",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
    marginVertical: 15,
  },
});
