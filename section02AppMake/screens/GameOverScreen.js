import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";

import Colors from "../constants/colors";

import BodyText from "../components/BodyText";
import TitleText from "../components/TitleText";
import MainButton from "../components/MainButton.android";

// Image 컴포넌트의 정보는 아래의 링크에서 확인 가능하다.
// https://reactnative.dev/docs/image
// Image 컴포넌트에 source 로 이미지를 가져올때 require를 사용하여 사진의 경로를 통해 가져오면 된다!

// Text 컴포넌트 안에 View 컴포넌트가 들어갈때 style 상에 문제가 발생할 수도 있다.
// 그래서 아래와 같이 Text 컴포넌트 안에는 Text 컴포넌트를 사용한다.
// https://github.com/facebook/react-native/issues/25197
// https://github.com/facebook/react-native/commit/a2a03bc68ba062a96a6971d3791d291f49794dfd
// 만약에 Text 컴포넌트 의 내용이 긴데 wrapping 없이 옵션을 사용하여 몇줄만 나오게 할것인지, 처리가 가능하다.
// https://reactnative.dev/docs/text#ellipsizemode   (해당 옵션 링크이다)
// https://velog.io/@hojin9622/ellipsizeMode%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%9C-%ED%85%8D%EC%8A%A4%ED%8A%B8-%EC%83%9D%EB%9E%B5   (사용예시이다.)

// *** View Vs Text  컴포넌트
// 1) View 는 flexbox css? 옵션이 있기 때문에 캄포넌트의 구조를 잡는데 사용된다.
// 예를 들어 Image 컴포넌트의 외곽을 꾸미기 위해 container로서 View 를 사용할 수 있다.
// 또다른 예시로 ScrollView 를 사용할때 View 로 감싸서 해당 디자인을 꾸며야한다.
// ScrollView 자체에 flexbox 를 준다면 ScrollBox가 동작하지 않을 것이다.
// https://stackoverflow.com/questions/46805135/scrollview-with-flex-1-makes-it-un-scrollable
// (ScrollBox에 flexbox를 줄때 에러발생의 예시)
// 2) Text 는 위에서 명시한것 처럼 Text 내부에 Text 를 처리하는게 추후 레이아웃상 문제가 발생하지 않게 된다.
// 만약 Text 에 들어가는 내용의 라인이 너무 길다면 numberOfLines , ellipsizeMode 옵션을 사용하여 처리하면 된다.
// (아래의 예시처럼 내용이 길어지면 1줄에 tail 로 처리했기 때문에 Text의 width를 넘어서면 ... 으로 보여진다)
{
  /* <Text numberOfLines={1} ellipsizeMode="tail">
  This text will never wrap into a new line, instead it will be cut off like this if it is too lon...
</Text> */
}

export default GameOverScreen = ({ roundsNumber, userNumber, onRestart }) => {
  // 화면이 작은 모바일일 수도 있기 때문에 ScrollView 로 전체를 Wrapping 처리해준다.
  // 가로/세로 화면에 따라 처리를 해줘야 하기 때문에 useState, useEffect, Dimensions 를 아래와 같이 사용해준다
  const [availableDeviceWidth, setAvailableDeviceWidth] = useState(
    Dimensions.get("window").width
  );
  const [availableDeviceHeight, setAvailableDeviceHeight] = useState(
    Dimensions.get("window").height
  );

  useEffect(() => {
    const updateLayout = () => {
      setAvailableDeviceWidth(Dimensions.get("window").width);
      setAvailableDeviceHeight(Dimensions.get("window").height);
    };

    Dimensions.addEventListener("change", updateLayout);
    return () => {
      Dimensions.removeEventListener("change", updateLayout);
    };
  });

  return (
    <ScrollView>
      <View style={styles.screen}>
        <TitleText>The Game is Over!</TitleText>
        <View
          style={{
            ...styles.imageContainer,
            ...{
              width: availableDeviceWidth * 0.7,
              height: availableDeviceWidth * 0.7,
              borderRadius: (availableDeviceWidth * 0.7) / 2,
              marginVertical: availableDeviceHeight / 30,
            },
          }}
        >
          <Image
            // source={require("../assets/success.png")}
            fadeDuration={300} //android 에만 있는 속성이다.
            source={{
              uri: "https://cdn.pixabay.com/photo/2016/05/05/23/52/mountain-summit-1375015_960_720.jpg",
            }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        <View
          style={{
            ...styles.resultContainer,
            ...{
              marginVertical: availableDeviceHeight / 60,
            },
          }}
        >
          <BodyText
            style={{
              ...styles.resultText,
              ...{ fontSize: availableDeviceHeight < 400 ? 16 : 20 },
            }}
          >
            Your phone needed{" "}
            <Text style={styles.highlight}>{roundsNumber}</Text> rounds to guess
            the number <Text style={styles.highlight}>{userNumber}</Text>.
          </BodyText>
        </View>
        <MainButton onPress={onRestart}>NEW GAME!</MainButton>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  // Dimension.get('window').width 를 통해 어떤 값을 구할 때 이건 모든 같은 디자인을 보증해주지 않는다...
  // 그러므로 같은 높이, 넓이 값을 가져가기 위해 아래처럼 height*<some factor> 를 모두에 적용시켜주면 된다!
  imageContainer: {
    // width: Dimensions.get("window").width * 0.7,
    // height: Dimensions.get("window").width * 0.7,
    // borderRadius: (Dimensions.get("window").width * 0.7) / 2, //동그랗게 태두리를 만들어준다
    borderWidth: 3, //태두리의 굵기를 표시한다
    borderColor: "black",
    overflow: "hidden", // 이미지가 넘치는 부분은 가려준다
    // marginVertical: Dimensions.get("window").height / 30, // 이미지의 위아래 마진을(공간) 준다.
  },
  // 위의 imageContainer 는 View 컴포넌트의 style로 아래의 image 컴포넌트는 자식으로서 속하게 된다.
  image: {
    width: "100%",
    height: "100%",
  },
  // 가장 효율적인 vertical margin 은 장치의 5% 정도의 높이이다.
  // 아래에선 Dimention.get('window').height / 40 으로 처리했는데 이는 장치의 2.5% 정도의 높이이다.
  resultContainer: {
    marginHorizontal: 30,
    // marginVertical: Dimensions.get("window").height / 60,
  },
  resultText: {
    textAlign: "center",
    // fontSize: Dimensions.get("window").height < 400 ? 16 : 20,
  },
  highlight: {
    color: Colors.primary,
    fontFamily: "open-sans-bold",
  },
});
