import React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableNativeFeedback,
} from "react-native";

export default CategoryGridTile = ({ title, color, onSelect }) => {
  let TouchableCMP = TouchableOpacity;

  if (Platform.OS === "android" && Platform.Version >= 21) {
    TouchableCMP = TouchableNativeFeedback;
  }

  return (
    <View style={styles.girdItem}>
      {/* 아래에서 style={{ flex: 1 }} 을 처리해줘야 제대로 스타일이 적용된다 */}
      <TouchableCMP style={{ flex: 1 }} onPress={onSelect}>
        <View style={{ ...styles.container, ...{ backgroundColor: color } }}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
        </View>
      </TouchableCMP>
    </View>
  );
};

const styles = StyleSheet.create({
  girdItem: {
    flex: 1,
    margin: 15,
    height: 150,
    borderRadius: 10,
    overflow:
      Platform.OS === "android" && Platform.Version >= 21
        ? "hidden" // overflow 의 hidden 은 child items 가 밖으로 나오는것을 막기 위한 처리
        : "visible",
    elevation: 5,
  },
  container: {
    flex: 1,
    borderRadius: 10,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    padding: 15,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  title: {
    fontFamily: "open-sans-bold",
    fontSize: 22,
    textAlign: "right",
  },
});
