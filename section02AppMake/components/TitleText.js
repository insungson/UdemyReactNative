// 이렇게 title이 들어간 Text 에만 적용시킬 컴포넌트를 따로 만들어도되고, 물론 추가 적용이 가능하도록 props로 style을 따로 받아서 합치는 작업을 한다.
import React from "react";
import { Text, StyleSheet } from "react-native";

export default TitleText = (props) => (
  <Text style={{ ...styles.title, ...props.style }}>{props.children}</Text>
);

const styles = StyleSheet.create({
  title: {
    fontFamily: "open-sans-bold",
    fontSize: 18,
  },
});
