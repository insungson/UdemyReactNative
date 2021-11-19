// 파일명을 해당 파일처럼 .android.js 로 하면 native 에서 알아서 안드로이드일땐 해당 파일을 사용하게 된다.
// https://reactnative.dev/docs/touchablenativefeedback
// touchablenativefeedback 는 커스텀하게 터치작업을 할 수 있지만...
// single View instance as a child node(1개의 노드element) 만 wrapping 처리를 할 수 있다.
// 그리고!! 안드로이드에서만 사용 가능하다!!
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform,
} from "react-native";

import Colors from "../constants/colors";

export default MainButton = (props) => {
  let ButtonComponent = TouchableOpacity;

  if (Platform.Version >= 21) {
    ButtonComponent = TouchableNativeFeedback;
  }

  return (
    <View style={styles.buttonContainer}>
      <ButtonComponent activeOpacity={0.6} onPress={props.onPress}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>{props.children}</Text>
        </View>
      </ButtonComponent>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 25,
    overflow: "hidden",
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: "white",
    fontFamily: "open-sans",
    fontSize: 18,
  },
});
