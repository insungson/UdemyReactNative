import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  ScrollView,
  FlatList,
  Dimensions,
} from "react-native";
// ScrollView의  contentContainerStyle 옵션은 자식컴포넌트들의 스타일을 정해준다.
import { Ionicons } from "@expo/vector-icons";
// @expo/vector-icons 는 기존에 expo 설치 시 빌트인 된 패키지이다.
// 원하는 모양은 옆의 주소에서 찾으면 된다.  https://icons.expo.fyi/

import * as ScreenOrientation from "expo-screen-orientation";
// https://docs.expo.dev/versions/latest/sdk/screen-orientation/   (참조링크)
// screen orientation(모바일의 가로/세로 여부) 을 체크해주는 expo 라이브러리이다.
// 해당 라이브러리는 동작중(at runtime) 모바일 기기의 orientation을 체크해준다.
// app.json 에서 세팅한 것보다 우선시되고, 안드로이드, IOS 에도 기존 세팅위로 overide
// 되어 변화한다.

import NumberContainer from "../components/NumberContainer";
import Card from "../components/Card";
import MainButton from "../components/MainButton.android";
import defaultStyles from "../constants/default-styles";
import BodyText from "../components/BodyText";
// 위와 같이 default 스타일로 처리해도 된다.

const generateRandomBetween = (min, max, exclude) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  const rndNum = Math.floor(Math.random() * (max - min)) + min;
  if (rndNum === exclude) {
    return generateRandomBetween(min, max, exclude);
  } else {
    return rndNum;
  }
};

// // 아래는 ScrollView 에 입각한 랜더링 함수이다
// const renderListItem = (value, numOfRound) => (
//   <View key={value} style={styles.listItem}>
//     <BodyText>#{numOfRound}</BodyText>
//     <BodyText>{value}</BodyText>
//   </View>
// );
// 아래처럼 bind로 넘겨받은 부분이list 의 length 이고, 두번째 인자가 FlatList 의 data 이기 때문에
// data의 index 접근이 가능하기 때문에 아래와 같이 처리한다
const flastRenderListItem = (listLength, itemData) => {
  // FlatList 의 renderItem 의 내부 itemData가 어떻게 구성되어있는지 콘솔로 살펴보자
  console.log("itemData: ", itemData);
  // object{"index": 1, "item": "22", "separators": Object{...}}  이런식으로 구성이 되어있다.
  return (
    <View style={styles.listFlatlistItem}>
      <BodyText>#{listLength - itemData.index}</BodyText>
      <BodyText>{itemData.item}</BodyText>
    </View>
  );
};

const GameScreen = ({ userChoice, onGameOver }) => {
  // ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
  // 예를 들어 위와 같이 처리해주면 GameScreen 컴포넌트 실행시 화면은 app.json 에서
  // default나 landscape 로 설정해도 세로로 고정처리가 된다!!
  // ScreenOrientation.addOrientationChangeListener('change', function(){});
  // 위의 메서드는 원하는 레이아웃이나 screen 컴포넌트에서 orientation 의 변화시 변경을 줄 수 있기 때문에 유용할 수 있다.

  const initialGuess = generateRandomBetween(1, 100, userChoice);
  const [currentGuess, setCurrentGuess] = useState(initialGuess);
  const [pastGuesses, setPastGuesses] = useState([initialGuess.toString()]);
  // const [rounds, setRounds] = useState(0);
  // useRef 는 리랜더링이 되더라도 값이 유지되는 특성이 있기 때문에... 아래에서 사용한다.

  // 화면이 가로/세로 일때는 + - 의 버튼 위치까지 바뀌는 작업을 하기 때문에 width, height 가 바뀌면
  // 현재 컴포넌트의 랜더링 리턴도 바꿔서 처리해보자
  // 방법은 StartGameScreen.js 에서 한것과 비슷하다.
  // useEffect, useState, Dimensions 를 사용하여 처리해준다.
  const [availableDeviceWidth, setAvailableDeviceWidth] = useState(
    Dimensions.get("window").width
  );
  const [availableDeviceHeight, setAvailableDeviceHeight] = useState(
    Dimensions.get("window").height
  );

  const currentLow = useRef(0);
  const currentHigh = useRef(100);

  // Dimensions 를 이용하여 width, height 를 가로세로에 맞게 처리해주는 useEffect 로직
  useEffect(() => {
    const updateLayout = () => {
      // 이렇게 width/height 의 변화를 감지하여 처리해도 되지만.. 좀더 보호 코드를 만드려면
      ScreenOrientation.getOrientationAsync().then((result) => {
        console.log("result: ", result);
        //result가 enum 값으로 나오기 때문에 조건문으로 분기처리하면 좀더 명확하게 처리할 수 있다.
        // https://docs.expo.dev/versions/latest/sdk/screen-orientation/#orientation
      });
      setAvailableDeviceWidth(Dimensions.get("window").width);
      setAvailableDeviceHeight(Dimensions.get("window").height);
    };

    Dimensions.addEventListener("change", updateLayout);

    return () => {
      Dimensions.removeEventListener("change", updateLayout);
    };
  });

  useEffect(() => {
    if (currentGuess === userChoice) {
      // onGameOver(rounds);
      onGameOver(pastGuesses.length);
    }
  }, [currentGuess, userChoice, onGameOver]);

  const nextGuessHandler = (direction) => {
    if (
      (direction === "lower" && currentGuess < userChoice) ||
      (direction === "greater" && currentGuess > userChoice)
    ) {
      Alert.alert("Don't lie!", "You know that this is wrong...", [
        { text: "Sorry!", style: "cancel" },
      ]);
      return;
    }
    if (direction === "lower") {
      currentHigh.current = currentGuess - 1;
    } else {
      currentLow.current = currentGuess + 1;
    }
    const nextNumber = generateRandomBetween(
      currentLow.current,
      currentHigh.current,
      currentGuess
    );
    setCurrentGuess(nextNumber);
    // setRounds((curRounds) => curRounds + 1);
    setPastGuesses((curPastGuesses) => [
      nextNumber.toString(),
      ...curPastGuesses,
    ]);
  };

  // Dimension 으로 모바일기기의 넓이에 따라 스타일을 바꿔서 처리해보자
  // + state로 화면이 가로일때/세로일때 구분하여 처리해보자
  let listContainerStyle = styles.listFlatlistContainer;
  if (availableDeviceWidth < 350) {
    listContainerStyle = styles.listContainerBig;
  }

  // 가로일때/세로일때 랜더링 리턴의 배치도 바뀌므로 아래와 같이 랜더링 변수를 따로 만들고 조건문으로 분기처리하자
  let gameControls = (
    <React.Fragment>
      <NumberContainer>{currentGuess}</NumberContainer>
      <Card
        style={{
          ...styles.buttonContainer,
          ...{ marginTop: availableDeviceHeight > 600 ? 20 : 5 },
        }}
      >
        <MainButton onPress={() => nextGuessHandler("lower")}>
          <Ionicons name="md-remove" size={24} color="white" />
        </MainButton>
        <MainButton onPress={() => nextGuessHandler("greater")}>
          <Ionicons name="md-add" size={24} color="white" />
        </MainButton>
        {/* <Button title="LOWER" onPress={() => nextGuessHandler("lower")} />
        <Button title="GREATER" onPress={() => nextGuessHandler("greater")} /> */}
      </Card>
    </React.Fragment>
  );

  // 높이가 500픽셀보다 작다면 가로화면일것이기 때문에 아래와 같이 분기처리해준다.
  if (availableDeviceHeight < 500) {
    gameControls = (
      <View style={styles.controls}>
        <MainButton onPress={nextGuessHandler.bind(this, "lower")}>
          <Ionicons name="md-remove" size={24} color="white" />
        </MainButton>
        <NumberContainer>{currentGuess}</NumberContainer>
        <MainButton onPress={nextGuessHandler.bind(this, "greater")}>
          <Ionicons name="md-add" size={24} color="white" />
        </MainButton>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={defaultStyles.title}>Opponent's Guess</Text>
      {gameControls}
      {/* 아래는 ScrollView 의 랜더링 코드이다 */}
      {/* <View style={styles.listContainer}>
        <ScrollView contentContainerStyle={styles.list}>
          {pastGuesses.map((guess, index) =>
            renderListItem(guess, pastGuesses.length - index)
          )}
        </ScrollView>
      </View> */}
      {/* 아래의 코드는 FlatList 코드이다. */}
      {/* 지금의 프로젝트는 리스트가 길어봐야 15개 20개 이기 때문에 성능에 상관이 없지만.. 
        100개가 넘는 리스트가 있다면.. 아래처럼 ScrollView 를 사용하는건 성능에 좋지 않다!! 
        그러므로 FlatList 컴포넌트를 사용하는게 좋다!! (아래는 참조링크이다.) */}
      {/* https://reactnative.dev/docs/flatlist */}
      {/* 위의 링크에서 보면 FlatList 는 키가 있는 객체로 이뤄진 배열을 데이터로 넣어줘야 한다.
        (아래의 예시에선 데이터에 key 가 없으므로 string 으로 변환 후 string 을 key 처럼 처리해줬다.)
        주요 속성을 알아보자
        data: 데이터
        renderItem: 랜더링하는 컴포넌트 (props 로 배열로 된 전제 데이터만 가져온다.) 
                  - 여기선 bind 를 써서 전체 배열의 전체길이를 넘겼다.
        keyExtractor: 데이터의 키 값
        extraData: 선택한 값을 넘겨줄때 renderItem 에서 state 의 변화가 있다면 FlatList 내부에서 
                  re-rendering 을 하도록 한다. (자세한 사항은 위의 링크 참조) */}
      <View style={listContainerStyle}>
        <FlatList
          keyExtractor={(item) => item}
          data={pastGuesses}
          renderItem={flastRenderListItem.bind(this, pastGuesses.length)}
          contentContainerStyle={styles.listFlatlist}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 10,
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    // 아래와 같이 Dimension 을 사용하여 높이를 구하고 그 높이에 따라 삼항식으로 높이값을 처리해줄 수 있다.
    // 같은 경우로 Dimension.get('window').height 의 높이값을 통해 삼항식으로 다른 컴포넌트를 사용할 수도 있다.
    // marginTop: Dimensions.get("window").height > 600 ? 20 : 5,
    // 위의 부분은 ... 로 인라인 스타일로 처리하였다.
    width: 400,
    maxWidth: "80%",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "80%",
  },
  listContainer: {
    flex: 1,
    width: "80%",
  },
  // https://blogpack.tistory.com/863
  // https://stackoverflow.com/questions/43143258/flex-vs-flexgrow-vs-flexshrink-vs-flexbasis-in-react-native
  // flexGrow 의 이해 링크
  list: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  listItem: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 15,
    marginVertical: 10,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
  },
  // flatList 에 적용시키 위해 기존의 listContainer 부터 변경을 해줘야 한다.
  // 컨테이너 width 를 정해주고 하위 listItem의 width 를 100%로 정하여 넓이를 맞춰준다.
  listFlatlistContainer: {
    flex: 1,
    // Dimension.get('window').width 로 모바일 기기에 따른 넓이 처리를 해줄 수 있다.
    width: Dimensions.get("window").width > 350 ? "60%" : "80%",
  },
  listFlatlist: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  listFlatlistItem: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 15,
    marginVertical: 10,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  listContainerBig: {
    flex: 1,
    width: "80%",
  },
});

export default GameScreen;
