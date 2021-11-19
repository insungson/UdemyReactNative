import React from "react";
import { TextInput, StyleSheet } from "react-native";

const Input = (props) => {
  // 아래의 TextInput 컴포넌트는 multiline 을 비릇해 여러 옵션들이 많으므로 살펴보고 처리하면 된다.
  // https://reactnative.dev/docs/textinput#multiline
  // https://reactnative.dev/docs/textinput#autocapitalize
  // https://reactnative.dev/docs/textinput#keyboardtype
  // 키보드타입의 기본설정은 numeric 방식이다!! 그냥 알아두자
  return <TextInput {...props} style={{ ...styles.input, ...props.style }} />;
};

const styles = StyleSheet.create({
  input: {
    height: 30,
    borderBottomColor: "grey",
    borderBottomWidth: 1,
    marginVertical: 10,
  },
});

export default Input;
