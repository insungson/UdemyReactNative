import React, { useLayoutEffect, useCallback } from "react";
import { FlatList, Button, Platform, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import HeaderButton from "../../components/UI/HeaderButton";
import ProductItem from "../../components/shop/ProductItem";
import Colors from "../../constants/Colors";
import { deleteProduct } from "../../store/products-slice";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

const UserProductsScreen = ({ navigation, route: { params } }) => {
  const userProducts = useSelector((state) => state.products.userProducts);
  // console.log("userProducts22: ", userProducts);
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Your Products",
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
            title="Add"
            iconName={Platform.OS === "android" ? "md-create" : "ios-create"}
            onPress={() => {
              navigation.navigate("EditProduct", { productId: null });
            }}
          />
        </HeaderButtons>
      ),
    });
  }, [navigation]);

  const editProductHandler = useCallback(
    (id) => {
      navigation.navigate("EditProduct", { productId: id });
    },
    [navigation]
  );

  const deleteHandler = useCallback(
    (id) => {
      Alert.alert("Are you sure?", "Do you really want to delete this item?", [
        { text: "No", style: "default" },
        {
          text: "Yes",
          style: "destructive",
          onPress: () => {
            dispatch(deleteProduct({ id }));
          },
        },
      ]);
    },
    [navigation]
  );

  return (
    <FlatList
      data={userProducts}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => {
            editProductHandler(itemData.item.id);
          }}
        >
          <Button
            color={Colors.primary}
            title="Edit"
            onPress={() => {
              editProductHandler(itemData.item.id);
            }}
          />
          <Button
            color={Colors.primary}
            title="Delete"
            onPress={deleteHandler.bind(this, itemData.item.id)}
          />
        </ProductItem>
      )}
    />
  );
};

export default UserProductsScreen;
// 위의 스크린 작업하고... navigation과 연결해야함!!
