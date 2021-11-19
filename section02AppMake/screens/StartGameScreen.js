// shadow (그림자 효과) css 에 관한 api 문서이다
// https://reactnative.dev/docs/shadow-props
// 아래는 저자가 사용한 옵션 shadowColor: 'black', shadowOffset: {width: 0, height: 2}, shadowRadius: 6, shadowOpacity: 0.26, backgroundColor: 'white'
// 위의 옵션은 ios 에서만 동작하기 때문에... 아래 링크의 옵션을 사용해준다
// elevation 이라는 옵션이다... (android 전용) 이건 elevation: 5, 이걸 추가해 줘야 한다.(z-index 값인듯 하다)
// https://reactnative.dev/docs/view-style-props#elevation-android
// https://developer.android.com/training/material/shadows-clipping.html#Elevation
// 추가로 borderRadius: 10 이런식으로 각을 둥굴게 만들수도 있고, borderBottomLeftRadius: 10 로 특정 부분을 지정하여 둥굴게 만들 수 있다.

// React Native Styling vs CSS Styling !! 중요한점!!!
// React Native 팀은 css 에 기반하여 Native 스타일을 구성하긴 했지만 Native widget은 css 와 는 완전 다른 것이다.  (web 이 아니기 때문에 HTML 이 아니다)
// 예를 들면 backgroundColor: 'black' 이게 먹히긴 하지만.. 이건 native widget 을 위한 css에 기반한 구성으로 만들었기 때문이다.
// 그렇기 때문에 모든 CSS properties 들이 React Native 에 속하지 않는다!!
// 그래서!! styling 은 Javascript 에 기반되어있고 CSS 에 기반되어있지 않다!!
// 예를 들면  <Text> 컴포넌트는  flexbox-related properties 가 적용되지 않는다..
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
  Keyboard,
  Alert,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";

import Card from "../components/Card";
import Input from "../components/Input";
import NumberContainer from "../components/NumberContainer";
import Colors from "../constants/colors";
import TitleText from "../components/TitleText";
import BodyText from "../components/BodyText";
import MainButton from "../components/MainButton";
//위와 같이 title에 들어갈 부분, body 에 들어갈 text 부분에 다른 스타일을 적용시키기 위해 컴포넌트를 따로 만들어도 된다.

const StartGameScreen = ({ onStartGame }) => {
  const [enteredValue, setEnteredValue] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState();
  // Dimensions 는 항상 current width / height 를 제공한다.
  // app.json 에서 "orientation": "default",  일 경우 화면이 가로/세로에 따라 다르기 때문에
  // 이에 맞게 width 을 설정하려면 width 를 state로 설정하고 useEffect 을 통하여 화면이 변화할때
  // Dimensions 로 현재 화면의 width 를 설정해주면 된다!
  // useEffect 의 return 을 사용하여 기존에 사용하던 EventListener 를 제거하여 1회만 사용하도록 처리해준다
  const [buttonWidth, setButtonWidth] = useState(
    Dimensions.get("window").width / 4
  );

  const numberInputHandler = (inputText) => {
    setEnteredValue(inputText.replace(/[^0-9]/g, ""));
  };

  const resetInputHandler = () => {
    setEnteredValue("");
    setConfirmed(false);
  };

  // 여기서 Dimensions.addEventListener 로 가로/세로에 따른 width 처리를 해준다.
  useEffect(() => {
    const updateLayout = () => {
      setButtonWidth(Dimensions.get("window").width / 4);
    };

    Dimensions.addEventListener("change", updateLayout);
    return () => {
      Dimensions.removeEventListener("change", updateLayout);
    };
  });

  const confirmInputHandler = () => {
    const chooseNumber = parseInt(enteredValue);
    if (isNaN(chooseNumber) || chooseNumber <= 0 || chooseNumber > 99) {
      Alert.alert(
        "Invalid number!",
        "Number has to be a number between 1 and 99.",
        [{ text: "Okay", style: "destructive", onPress: resetInputHandler }]
      );
      return;
    }
    setConfirmed(true);
    setSelectedNumber(chooseNumber);
    setEnteredValue("");
    Keyboard.dismiss();
  };

  let confirmOutput;

  if (confirmed) {
    confirmOutput = (
      <Card style={styles.summaryContainer}>
        <BodyText>You Selected</BodyText>
        <NumberContainer>{selectedNumber}</NumberContainer>
        <MainButton onPress={() => onStartGame(selectedNumber)}>
          START GAME!
        </MainButton>
      </Card>
    );
  }

  // TouchableWithoutFeedback 의 Keyboard.dismiss(); 기능은 wrapper로 감싸지지 않은 다른 컴포넌트를 클릭시 키보드 자판이 없어지게 만들어준다
  // app.json 에서 "orientation": "landscape", (혹은 default) 옵션으로 바꿔서 화면을 가로로 할때 키보드가 View 를 가려버리는 현상이 발생한다..
  // 해결책으로 ScrollView 로 전체 컴포넌트를 wrapping 처리하여 움직일 수 있게 만들고,
  // 그리고 KeyboardAvoidingView  컴포넌트를 wrapping 처리하여 화면상에 나타나는 키보드를 컨트롤 한다.
  // https://maruzzing.github.io/study/rnative/KeyboardAvoidingView-%EC%A0%81%EC%9A%A9%ED%95%98%EA%B8%B0/
  // 위의 링크를 보면 ReactNative에 ScrollView 내부에서 더 잘 동작이 되도록 만드는 다른 라이브러리도 있다.
  return (
    <ScrollView>
      <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={30}>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <View style={styles.screen}>
            <TitleText style={styles.title}>Start a New Game!</TitleText>
            <Card style={styles.inputContainer}>
              <BodyText>Select a Number</BodyText>
              <Input
                style={styles.input}
                blurOnSubmit
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="number-pad"
                maxLength={2}
                onChangeText={numberInputHandler}
                value={enteredValue}
              />
              <View style={styles.buttonContainer}>
                {/* 아래부분에 styles.button 대신 위의 useEffect 에서 만든 state를 사용한다. */}
                {/* <View style={styles.button}> */}
                <View style={{ width: buttonWidth }}>
                  <Button
                    title="Reset"
                    onPress={resetInputHandler}
                    color={Colors.accent}
                  />
                </View>
                {/* <View style={styles.button}> */}
                <View style={{ width: buttonWidth }}>
                  <Button
                    title="Confirm"
                    onPress={confirmInputHandler}
                    color={Colors.primary}
                  />
                </View>
              </View>
            </Card>
            {confirmOutput}
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    marginVertical: 10,
    fontFamily: "open-sans-bold",
  },
  inputContainer: {
    //아래처럼 비율로 맞추면 모바일 기기마다 사이즈가 달라고 공통적용이 좀더 용이해진다.
    width: "80%",
    maxWidth: "95%",
    minWidth: 300,
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  button: {
    // 모바일 기기별로 사이즈가 다르기 떄문에 아래처럼 고정 값으로 주는건 좋지 않다.
    // 그래서 Dimensions 를 사용하여 모바일 기기의 사이즈 값을 가져와서 비율로 처리해준다.
    // (물론 width: '40%' 처럼 비율로 해도 되기는 한다 - Dimension의 기능을 알기 위한 처리이다)
    // width: 100,  //이건 그냥 주석처리
    width: Dimensions.get("window").width / 4, //이렇게 기기의 width 값을 가져온다.
    // 위의 style 은 화면이 가로 or 세로 인 고정값에서 유용한 것이기 때문에 위에서
    // useEffect, useState, Dimension 을 사용하여 width 값을 처리해준다.
  },
  input: {
    width: 50,
    textAlign: "center",
  },
  summaryContainer: {
    marginTop: 20,
    alignItems: "center",
  },
});

export default StartGameScreen;
