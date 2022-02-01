import React, { useReducer, useEffect } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const INPUT_CHANGE = "INPUT_CHANGE";
const INPUT_BLUR = "INPUT_BLUR";

const inputReducer = (state, action) => {
  switch (action.type) {
    case INPUT_CHANGE:
      return {
        ...state,
        value: action.value,
        isValid: action.isValid,
      };
    case INPUT_BLUR:
      return {
        ...state,
        touched: true,
      };
    default:
      return state;
  }
};

const Input = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue ? props.initialValue : "",
    isValid: props.initiallyValid,
    touched: false,
  });

  const { onInputChange, id } = props;

  useEffect(() => {
    if (inputState.touched) {
      onInputChange(id, inputState.value, inputState.isValid);
    }
  }, [inputState, onInputChange, id]);

  // http://validatejs.org/   처럼 유효성 검사를 위한 라이브러리도 있다.
  // (참고로 유효성 검사를 위한 위와 같은 라이브러리도 존재한다!! 좀더 세부적인 유효성 검사를 위해 라이브러리를 사용할 수도 있다.)
  const textChangeHandler = (text) => {
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isValid = true;
    if (props.required && text.trim().length === 0) {
      isValid = false;
    }
    if (props.email && !emailRegex.test().length === 0) {
      isValid = false;
    }
    if (props.min != null && +text < props.min) {
      isValid = false;
    }
    if (props.max != null && +text > props.max) {
      isValid = false;
    }
    if (props.minLength != null && text.length < props.minLength) {
      isValid = false;
    }

    dispatch({ type: INPUT_CHANGE, value: text, isValid: isValid });
  };

  const lostFocusHandler = () => {
    dispatch({ type: INPUT_BLUR });
  };

  return (
    <View style={styles.formControl}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        {...props} //기존의 TextInput 을 커스텀하게 사용하기 위한 처리
        style={styles.input}
        value={inputState.value}
        onChangeText={textChangeHandler}
        onBlur={lostFocusHandler} // 다른 element 로 이동하여 focus 가 없어질때 유효성 체크 결과를 보여주기 위함이다.
        // onEndEditing={() => console.log('onEndEditing')} // 해당 element 를 벗어날때 동작한다
        // onSubmitEditing={() => console.log('onSubmitEditing')} //해당 eleement에서 키보드의 확인(영문으론 return)을 클릭시 동작한다.
      />
      {!inputState.isValid && inputState.touched && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{props.errorText}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  formControl: {
    width: "100%",
  },
  label: {
    fontFamily: "open-sans-bold",
    marginVertical: 8,
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  errorContainer: {
    marginVertical: 5,
  },
  errorText: {
    fontFamily: "open-sans",
    color: "red",
    fontSize: 13,
  },
});

export default Input;
