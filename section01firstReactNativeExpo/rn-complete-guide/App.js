import React, { useState } from "react";
import { View, FlatList, Button } from "react-native";

import GoalInput from "./components/GoalInput";
import GoalItem from "./components/GoalItem";

export default function App() {
  // 웹(리엑트)과는 달리 문자열도 Text 컴포넌를 wrapper로 감싸줘야 한다.
  // Image 컴포넌트도 마찬가지이다.
  // React Native 에선 Button 컴포넌트 사용시 <Button /> 로 사용해야한다
  // TextInput 은 아래의 링크처럼 사용하면 된다
  // https://reactnative.dev/docs/textinput
  // inline style은 카멜케이스의 속성을 사용해야 한다

  // flex 의 개념에 대해 알아보자 (view 컴포넌트의 레이아웃 잡기)
  // https://reactnative.dev/docs/flexbox     ReactNative 공식 페이지
  // https://kkiuk.tistory.com/150            누군가 좀더 쉽게 풀어설명한것

  ///////////////////////
  // ScrollView 해당 페이지가 넘어가는 컴퍼넌트가 있을때 scroll 기능이 있다. (FlatList와 차이점은 ScrollView 는 리스트를 전부 랜더링한다.)
  // https://reactnative.dev/docs/scrollview#view-props

  // FlatList 는 ScrollView 와 같은 기능이지만.. List 가 많을때 최적화하여 끊어서 랜더링한다.
  // https://reactnative.dev/docs/flatlist

  // TouchableOpacity 는 기존의 ReactNative 컴포넌트를 터치할 수 있게 만든다. Wrapper로 해당 컴포넌트부분을 감싸면 된다.(범위 가능)
  // https://reactnative.dev/docs/touchableopacity
  // components/GoalItem 에서 구현됨.
  // TouchableHighlight 는 Wrapper로 감싼 컴포넌트의 배경부분이 깜빡이고, TouchableOpacity 는 Wrapper로 감싼 컴포넌트 부분이 깜빡인다.
  // 색상 조정은 아래의 문서 옵션 참조!
  // https://reactnative.dev/docs/touchablehighlight
  // TouchableWithoutFeedback 은 Wrapper로 감싼 컴포넌트들을 터치시 효과는 없지만 동작한다. (별로 안쓰임..)
  // https://reactnative.dev/docs/touchablewithoutfeedback

  // Modal 컴포넌트는 overay 기능을 제공한다!! (말그대로 모달 기능이다!)
  // Wrapper로 해당 컴포넌트를 감싸면 된다.
  // components/GoalInput 에서 모달을 적용시켜 인풋오버레이를 따로 만들어보자
  // https://reactnative.dev/docs/modal

  const [courseGoals, setCourseGoals] = useState([]);
  const [isAddMode, setIsAddMode] = useState(false);

  const addGoalHandler = (goalTitle) => {
    if (goalTitle.length === 0) {
      return;
    }
    setCourseGoals((curGoals) => [
      ...curGoals,
      { id: Math.random().toString(), value: goalTitle },
    ]);
    setIsAddMode(false);
  };

  const removeGoalHandler = (goalId) => {
    setCourseGoals((curGoals) => {
      return curGoals.filter((goal) => goal.id !== goalId);
    });
  };

  const cancelGoalHandler = () => {
    setIsAddMode(false);
  };

  return (
    // 아래처럼 StyleSheet.create() 를 사용하여 접근할 수 도 있다.
    <View style={{ padding: 50 }}>
      <Button title="Add New Goal" onPress={setIsAddMode.bind(null, true)} />
      <GoalInput
        visible={isAddMode}
        onAddGoal={addGoalHandler}
        onCancel={cancelGoalHandler}
      />
      {/* ScrollView 컴포넌트를 사용할때.. */}
      {/* <ScrollView>
        {courseGoals.map((goal) => (
          <View key={goal.id} style={styles.listItem}>
            <Text>{goal}</Text>
          </View>
        ))}
      </ScrollView> */}
      {/* FlatList를 사용할때.. */}
      <FlatList
        keyExtractor={(item, index) => item.id}
        data={courseGoals}
        renderItem={(itemData) => (
          <GoalItem
            title={itemData.item.value}
            id={itemData.item.id}
            onDelete={removeGoalHandler}
          />
        )}
      />
    </View>
  );
}
