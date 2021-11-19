import React from "react";
import { Platform } from "react-native";
import { HeaderButton } from "react-navigation-header-buttons";
import { Ionicons } from "@expo/vector-icons";
// 참고로 위의 @expo/vector-icons 는 expo init, expo install 로 이미 설치된것이기 때문에 따로 설치할 필요는 없다.

import Colors from "../constants/Colors";

export default IoniconsHeaderButton = (props) => {
  return (
    <HeaderButton
      {...props}
      IconComponent={Ionicons}
      iconSize={23}
      color={Platform.OS === "android" ? "white" : Colors.primaryColor}
    />
  );
};
