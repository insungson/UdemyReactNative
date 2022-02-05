import React, {
  useLayoutEffect,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  FlatList,
  Platform,
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import HeaderButton from "../../components/UI/HeaderButton";
import OrderItem from "../../components/shop/OrderItem";

import { fetchOrders } from "../../store/orders-slice";
import Colors from "../../constants/Colors";

const OrederScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);

  const orders = useSelector((state) => state.order.orders);
  // 유저id 토큰을 queryString으로 보내기 위해 가져옮
  const { token, userId } = useSelector(({ auth }) => auth);
  const dispatch = useDispatch();

  const requestOrderList = useCallback(async () => {
    console.log("token: ", token);
    console.log("userId: ", userId);
    await dispatch(fetchOrders({ token, userId }));
    setIsLoading(false);
  }, [dispatch, token, userId]);

  useEffect(() => {
    setIsLoading(false);
    requestOrderList();
  }, [requestOrderList]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Your Orders",
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
    });
  }, [navigation]);

  if (isLoading) {
    <View style={styles.centered}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>;
  }

  if (orders.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No order found, maybe start ordering some products?</Text>
      </View>
    );
  }

  const renderOrderItem = (itemData) => {
    return (
      <OrderItem
        amount={itemData.item.totalAmount}
        date={itemData.item.readableDate}
        items={itemData.item.items}
      />
    );
  };

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id}
      renderItem={renderOrderItem}
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
});

export default OrederScreen;
