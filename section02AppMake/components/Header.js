import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
// Platform 은 현재 사용되는 기기를 구분할 수 있는 정보를 준다!! (android, ios, macos, web, window 인지..)
// https://docs.expo.dev/versions/v43.0.0/react-native/platform/   (참조)
// https://reactnative.dev/docs/platform-specific-code
import Colors from "../constants/colors";

const Header = (props) => {
  // 아래에선 Platform.select({})  를 사용하여 ios, android 냐에 대한 스타일객체를 처리했지만..
  // Platform.select({ios: 'hello Apple!', android: 5 });  같은 값을 준다면 해당 기기일때 설정한 값을 리턴해준다.
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{props.title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: 90,
    paddingTop: 36,
    backgroundColor: Platform.OS === "android" ? Colors.primary : "white",
    alignItems: "center",
    justifyContent: "center",
    borderBottomColor: Platform.OS === "ios" ? "#ccc" : "transparent",
    borderBottomWidth: Platform.OS === "ios" ? 1 : 0,
  },
  headerTitle: {
    color: Platform.OS === "ios" ? Colors.primary : "black",
    fontSize: 18,
  },
});

export default Header;
