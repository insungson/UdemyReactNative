import React, { useState, useEffect } from "react";
import { StyleSheet, View, SafeAreaView } from "react-native";
// SafeAreaView 는 모바일 기기의 모든 화면을 사용할 수 있게 한다(모바일의 구석진 부분까지...)
// https://reactnative.dev/docs/safeareaview
// 사용방법은 SafeAreaView 로 전체 컴포넌트를 감싸면 된다..
// (만약 자식 컴포넌트만 감쌀때  부모컴포넌트는 안보이는 경우도 발생할 수 있으므로 제대로 이해하고 사용해야 한다.)

import * as Font from "expo-font";
import AppLoading from "expo-app-loading";

import Header from "./components/Header";
import StartGameScreen from "./screens/StartGameScreen";
import GameScreen from "./screens/GameScreen";
import GameOverScreen from "./screens/GameOverScreen";

// expo 의 font 를 적용시키기 위해선 아래의 링크처럼 해당 라이브러리를 설치해야 한다.
// https://docs.expo.dev/versions/latest/sdk/font/
// 아래와 같이 기존의 폴더에 저장한 font 를 가져와서 사용해도 된다.
// 아래에서 정한 폰트 속성명은 다른곳에서 불러와서 사용할떄 fontFamily: 'open-sans-bold' 처럼
// fontFamily 의 속성명으로 접근해야 한다.
// (components/StartGameScreen.js 참조)

// *** 아래의 에러 사례는 따로 정리해 둘 것
// 아래와 같이 폰트를 적용시키는 것인데... 가끔 폰트를 불러오지 못할 수도 있다. (패키징의 dependency가 안맞아서 에러가 발생하는 것이다.)
// 그럴땐 아래의 절차대로 node_modules 폴더와 package-lock.json 를 삭제후 다시 설치하여 버전을 맞춰주면 된다.
// - Remove node_modules and package-lock.json
// - Run npm install
// - Run expo install
// - Run npm start

// 둘의 차이는 뭘까?
// 1) npm install --save expo-font
// 2) expo install expo-font
// npm install 은 그냥 많이 쓰이는 패키지가 설치된다. dependency 를 고려한 패키지가 설치되지 않는다.
// expo install 은 현재 설치된 expo 의 dependency 에 맞는 패키지가 설치되기 때문에 expo 에서 모듈을 추가할 땐 expo install 패키지  로 설치하는게 좋다.

const fetchFonts = () => {
  return Font.loadAsync({
    "open-sans": require("./assets/fonts/Montserrat-Regular.ttf"),
    "open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf"),
  });
};

export default function App() {
  const [userNumber, setUserNumber] = useState();
  const [guessRounds, setGuessRounds] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);

  // AppLoading 에서 사용할 때.. 아래와 같이 startAsync 는 promise 형태인 함수를 넣어줘야 한다.
  // 그럼 promise 동작이 끝날때 알아서 onFinsh 의 함수를 실행시켜준다.
  if (!dataLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setDataLoaded(true)}
        onError={(err) => console.log(err)}
      />
    );
  }

  const configureNewGameHandler = () => {
    setGuessRounds(0);
    setUserNumber(null);
  };

  const startGameHandler = (selectedNumber) => {
    setUserNumber(selectedNumber);
  };

  const gameOverHandler = (numOfRounds) => {
    setGuessRounds(numOfRounds);
  };

  let content = <StartGameScreen onStartGame={startGameHandler} />;

  if (userNumber && guessRounds <= 0) {
    content = (
      <GameScreen userChoice={userNumber} onGameOver={gameOverHandler} />
    );
  } else if (guessRounds > 0) {
    content = (
      <GameOverScreen
        roundsNumber={guessRounds}
        userNumber={userNumber}
        onRestart={configureNewGameHandler}
      />
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <Header title="Guess a Number" />
      {content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});

// ReactNative 에서 사용할 수 있는 디자인 라이브러리들이 있다. (쉽게 컴포넌트를 짜준다.)
// 1. https://github.com/react-native-training/react-native-elements
// 2. https://github.com/GeekyAnts/NativeBase

// app.json 에서     "orientation": "portrait",  는 화면을 세로로 보는것을 고정시키는 것이다.
// https://docs.expo.dev/versions/v43.0.0/config/app/#orientation
// 앱개발시 이런부분도 확실하게 생각해야 한다!!!!
// 옵션은 default, portrait, landscape  3개이다. (아래 안드로이드 용어에 나와있다.)
// default 는 가로 세로 모바일 기울기에 따라 자동으로 화면이 변하는 것이고,
// portrait 는 세로
// landscape 는 가로 이다!!

// ** 안드로이드 용어정리!
// https://mydevromance.tistory.com/20
