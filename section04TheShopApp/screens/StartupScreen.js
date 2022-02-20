import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import Colors from "../constants/Colors";
import { authenticate } from "../store/auth-slice";

const StartupScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    const tryLogin = async () => {
      const userData = await AsyncStorage.getItem("userData");
      // AsyncStorage 에 'userData' 키로 된 값이 없다면 Auth로 화면 변경처리!
      if (!userData) {
        navigation.navigate("Auth");
        return; //빈값을 리턴하여 아래의 로직이 실행되지 않도록 만든다!
      }
      const transformedData = JSON.parse(userData);
      const { token, userId, expiryDate } = transformedData;
      const expirationDate = new Date(expiryDate);

      // 만약 토큰만료일이 적거나 토큰이 없거나 유저아이디가 없을땐 Auth 로 이동처리!
      if (expirationDate <= new Date() || !token || !userId) {
        navigation.navigate("Auth");
        return;
      }

      // 위의 절차를 통해 로긴을 하고 Shop 으로 이동처리!
      navigation.navigate("Shop");
      dispatch(authenticate({ userId, token }));
    };

    tryLogin();
  }, [dispatch, navigation]);

  return (
    <View style={styles.screen}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default StartupScreen;
