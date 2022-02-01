import React, { useEffect, useLayoutEffect, useCallback } from "react";
import { FlatList, Button, Platform, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import HeaderButton from "../../components/UI/HeaderButton";
import ProductItem from "../../components/shop/ProductItem";
import Colors from "../../constants/Colors";
import {
  deleteProduct,
  fetchProducts,
  fetchDeleteProduct,
} from "../../store/products-slice";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

const UserProductsScreen = ({ navigation, route: { params } }) => {
  const userProducts = useSelector((state) => state.products.userProducts);
  // console.log("userProducts22: ", userProducts);
  const dispatch = useDispatch();

  // 아래와 같이 해당 화면에서 처리해도 되지만.. ProductsOverviewScreen 컴포넌트에서
  // navigation.addListener() 의 willFocus 이벤트를 통하여 탭의 포커스가 바뀔때 불러오는 처리를 해보자!!
  // useEffect(() => {
  //   console.log("화면전환시마다 작동되는가?");
  //   // 여기서 fetchProducts 를 불러오는걸 넣기!! 위의 콘솔이 먹힌다면!!
  //   dispatch(fetchProducts());
  // }, []);

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
    (item) => {
      const { id, firebaseKey } = item;
      Alert.alert("Are you sure?", "Do you really want to delete this item?", [
        { text: "No", style: "default" },
        {
          text: "Yes",
          style: "destructive",
          onPress: () => {
            dispatch(fetchDeleteProduct({ id, firebaseKey }));
            // dispatch(deleteProduct({ id })); // 기존의 리듀서를 이용할때 사용!
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
            onPress={deleteHandler.bind(this, itemData.item)}
          />
        </ProductItem>
      )}
    />
  );
};

export default UserProductsScreen;
// 위의 스크린 작업하고... navigation과 연결해야함!!
