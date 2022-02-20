import React, {
  useEffect,
  useLayoutEffect,
  useCallback,
  useState,
} from "react";
import {
  FlatList,
  Button,
  Platform,
  StyleSheet,
  ActivityIndicator,
  View,
  Text,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import HeaderButton from "../../components/UI/HeaderButton";
import ProductItem from "../../components/shop/ProductItem";
import { addToCart } from "../../store/cart-slice";
import { fetchProducts } from "../../store/products-slice";

import Colors from "../../constants/Colors";

const ProductsOverviewScreen = ({ navigation, route: { params } }) => {
  const products = useSelector((state) => state.products.availableProducts);
  const { token, userId } = useSelector(({ auth }) => auth);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 리엑트 네이티브의 FlatList 컴포넌트 를 아래로 끌어 댕시면 스피닝 애니매이션이 나오면서 요청을 하는것이다.
  // FlatList 컴포넌트의 속성들중
  // 1. onRefresh 에 요청하는 함수를 넣고,
  // 2. refreshing 에 요청중인지 아닌지를 판단하는 boolean state를 넣으면 된다.
  const [isRefreshing, setIsRefreshing] = useState(false);

  // fetchProducts 에서 axios 를 통해 통신 에러 발생시 여기서 error state로 보여주고 처리함!
  const loadProducts = useCallback(async () => {
    console.log("willFocus 이벤트 동작 확인용!!");
    setError(null);
    setIsRefreshing(true); // 요청 전후로 refreshing 처리를 해주자!!
    try {
      await dispatch(fetchProducts({ userId }));
    } catch (error) {
      setError(error);
    }
    setIsRefreshing(false);
  }, [dispatch, setError, setIsRefreshing, userId]);

  // 아래의 useEffect 는 네비게이션의 이벤트를 이용하여 데이터를 요청하는 로직을 짜본다!! (focus, blur 만 동작하는듯하다...)
  // didFocus : 페이지가 focused 되어질때의 이벤트시 콜백 함수이다.
  // wilFocus : 페이지의 trasition 이 될때의 이벤트시 콜백 함수이다.
  // focus - This event is emitted when the screen comes into focus
  // willBlur : 페이지를 떠날때 이벤트시 콜백 함수이다.
  // didBlur : 페이지를 떠났을때 이벤트시 콜백 함수이다.
  // blur - This event is emitted when the screen goes out of focus
  useEffect(() => {
    // navigation.addListener 사용법링크
    // https://reactnavigation.org/docs/navigation-prop/#navigation-events
    // navigation.addListener 의 이벤트 종류 링크
    // https://reactnavigation.org/docs/navigation-events/
    // 스크린의 focus 시 콜백 함수를 사용하는 다른 방법들 링크
    // (1. navigation.addListener()  2. useFocusEffect 사용  3. useIsFocused 사용(리랜더링시 fetch 하고 싶다면!!))
    // https://reactnavigation.org/docs/function-after-focusing-screen/
    const willFocusSub = navigation.addListener("blur", loadProducts);
    console.log("willFocus: ");
    return () => {
      console.log("willFocus:123123 ");
      // willFocusSub.remove(); // 위의 링크에서 확인해보니깐 remove 가 아닌 그냥 객체를 리턴해서 없애줘야 한다!!
      return willFocusSub;
    };
  }, [navigation, loadProducts]);

  useEffect(() => {
    setIsLoading(true);
    // loadProducts 함수가 async 로 되어있기 때문에 promise 객체를 리턴하므로 then 으로 처리해 준다.
    loadProducts()
      .then(() => {
        setIsLoading(false);
      })
      .catch((err) => setError(err));
  }, [loadProducts]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "All Products",
      headerLeft: () => (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            title="Menu"
            iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
            onPress={() => {
              navigation.toggleDrawer();
            }}
          />
        </HeaderButtons>
      ),
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            title="Cart"
            iconName={Platform.OS === "android" ? "md-cart" : "ios-cart"}
            onPress={() => {
              navigation.navigate("Cart");
            }}
          />
        </HeaderButtons>
      ),
    });
  }, [navigation]);

  const selectItemHandler = useCallback(
    (id, title) => {
      navigation.navigate("ProductDetail", {
        productId: id,
        productTitle: title,
      });
    },
    [navigation]
  );

  // 에러처리
  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occurred!</Text>
        <Button
          title="Try again!"
          onPress={loadProducts}
          color={Colors.primary}
        />
      </View>
    );
  }

  // 로딩스피너 처리 (ActivityIndicator 컴포넌트는 리엑트 네이티브에서 제공하는 로딩스피너이다!)
  // https://reactnative.dev/docs/activityindicator#animating
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size={"large"} color={Colors.primary} />
      </View>
    );
  }

  // 현재 데이터의 길이가 없을떄..
  if (!isLoading && products.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No products found. Maybe start adding some!</Text>
      </View>
    );
  }

  return (
    <FlatList
      onRefresh={loadProducts} //  FlatList 를 아래로 댕길떄 요청하는 속성이다. 요청 함수를 넣어주면 된다.
      refreshing={isRefreshing} // 스피닝 처리를 위한 판단 state이다.
      data={products}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => {
            selectItemHandler(itemData.item.id, itemData.item.title);
          }}
        >
          <Button
            color={Colors.primary}
            title="View Details"
            onPress={() => {
              selectItemHandler(itemData.item.id, itemData.item.title);
            }}
          />
          <Button
            color={Colors.primary}
            title="To Cart"
            onPress={() => {
              console.log("itemData.item: ", itemData.item);
              dispatch(addToCart({ product: itemData.item }));
            }}
          />
        </ProductItem>
      )}
    ></FlatList>
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignContent: "center" },
});

export default ProductsOverviewScreen;
