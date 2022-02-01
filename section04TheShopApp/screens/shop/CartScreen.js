import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

import Colors from "../../constants/Colors";
import CartItem from "../../components/shop/CartItem";
import Card from "../../components/UI/Card";
import { removeFromCart, addOrderCart } from "../../store/cart-slice";
// 기존의 리듀서는 액션명이 공유되기 때문에 그냥 리듀서에 추가해주면 되지만..
// 여기선 따로 구분해줬기 때문에 아래의 출킷을 실행시 그 아래줄에 addOrderCart를
// 사용해준다
import { addOrder, fetchAddOrder } from "../../store/orders-slice";

const CartScreen = () => {
  const [isLoading, setIsLoading] = useState(false);

  const cartTotalAmount = useSelector((state) => state.cart.totalAmount);
  const cartItems = useSelector((state) => {
    const transformedCartItems = [];
    for (const key in state.cart.items) {
      transformedCartItems.push({
        productId: key,
        productTitle: state.cart.items[key].productTitle,
        productPrice: state.cart.items[key].productPrice,
        quantity: state.cart.items[key].quantity,
        sum: state.cart.items[key].sum,
      });
    }
    return transformedCartItems.sort((a, b) =>
      a.productId > b.productId ? 1 : -1
    );
  });
  const dispatch = useDispatch();

  const sendOrderHandler = useCallback(async () => {
    setIsLoading(true);
    // dispatch(addOrder({ items: cartItems, amount: cartTotalAmount })); // 기존 리듀서는 주석처리
    // 아래의 리듀서는 통신 관련 toolkit썽크
    await dispatch(
      fetchAddOrder({ items: cartItems, amount: cartTotalAmount })
    );
    await dispatch(addOrderCart()); //기존의 리듀서처럼 공유가 안되기 때문에 따로 액션함수를 만들던지 여기에 그냥 추가작업을 해줘야 한다.
    setIsLoading(false);
  }, [dispatch]);

  return (
    <View style={styles.screen}>
      <Card style={styles.summary}>
        <Text style={styles.sumaryText}>
          Total:{" "}
          <Text style={styles.amount}>
            ${Math.round(cartTotalAmount.toFixed(2) * 100) / 100}
          </Text>
        </Text>
        {isLoading ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : (
          <Button
            color={Colors.accent}
            title="Order Now"
            disabled={cartItems.length === 0}
            onPress={sendOrderHandler}
          />
        )}
      </Card>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.productId}
        renderItem={(itemData) => (
          <CartItem
            quantity={itemData.item.quantity}
            title={itemData.item.productTitle}
            amount={itemData.item.sum}
            deletable={true}
            onRemove={() => {
              dispatch(removeFromCart({ productId: itemData.item.productId }));
            }}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    margin: 20,
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 10,
  },
  sumaryText: {
    fontFamily: "open-sans-bold",
    fontSize: 18,
  },
  amount: {
    color: Colors.primary,
  },
});

export default CartScreen;
