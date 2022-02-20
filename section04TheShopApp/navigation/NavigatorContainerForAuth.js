// import React, { useEffect, useRef } from "react";
// import { useSelector } from "react-redux";
// import {
//   useNavigationContainerRef,
//   useNavigation,
// } from "@react-navigation/native";

// import ShopNavigator from "./ShopNavigator";
// //아래와 같이 navigationContainer안에 shopNavigator 를 넣는 이유는..
// // token 삭제 후 오토로그아웃을 하기위한 setTimeout 을 걸때.. 화면마다(라우트screen) dispatch 를 걸 수 없으므로
// // 전역관리하기 위해 컨테이너로 감싸서 여기서 작업을 하는 것이다!
// const NavigatorContainerForAuth = () => {
//   const navRef = useNavigationContainerRef();
//   const isAuth = useSelector(({ auth }) => !!auth.token);
//   const navigation = useNavigation();

//   useEffect(() => {
//     if (!isAuth) {
//       console.log("isAuth: ", isAuth);
//       console.log("navRef: ", navRef);
//       navRef.current.navigate("Auth");
//       // navigation.navigate("Auth");
//     }
//   }, [isAuth]);

//   return <ShopNavigator ref={navRef} />;
// };

// export default NavigatorContainerForAuth;
