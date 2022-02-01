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
  const dispatch = useDispatch();

  const requestOrderList = useCallback(async () => {
    await dispatch(fetchOrders());
    setIsLoading(false);
  }, [dispatch]);

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
