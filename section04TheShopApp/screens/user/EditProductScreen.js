import React, {
  useLayoutEffect,
  useState,
  useCallback,
  useReducer,
} from "react";
import {
  View,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";
import HeaderButton from "../../components/UI/HeaderButton";
import { updateProduct, createProduct } from "../../store/products-slice";

import Input from "../../components/UI/Input";
// 유효성 검사를 좀 더 세부적으로 처리하기 위한 커스텀 TextInput 컴포넌트를 만들었다.

// input의 여러 state를 한번에 관리하기 위해 useReducer 를 사용해준다!!
const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";
// 해당 컴포넌트 바깥쪽에서 useReducer 함수를 만들면 useCallback을 사용안해도 재실행을 막을 수 있다!!
const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsvalid = true;
    for (const key in updatedValidities) {
      updatedFormIsvalid = updatedFormIsvalid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsvalid,
      inputValidities: updatedValidities,
      inputValues: updatedValues,
    };
  }
  return state;
};

const EditProductScreen = ({
  navigation,
  route: {
    params: { productId },
  },
}) => {
  console.log("에러라면 이게 찍혀야함");
  const editedProduct = useSelector((state) =>
    state.products.userProducts.find((prod) => prod.id === productId)
  );
  const dispatch = useDispatch();

  // 유효성 검사를 위한 input element의 state와 validation과 전체 form의 validation을 위해 useReducer를 사용한다
  // https://www.npmjs.com/package/formik     form 라이브러리를 사용하면 유효성검사를 쉽게 사용할 수 있다.(reactNative 에서 사용 가능하다)
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedProduct ? editedProduct.title : "",
      imageUrl: editedProduct ? editedProduct.imageUrl : "",
      description: editedProduct ? editedProduct.description : "",
      price: "",
    },
    inputValidities: {
      title: editedProduct ? true : false,
      imageUrl: editedProduct ? true : false,
      description: editedProduct ? true : false,
      price: editedProduct ? true : false,
    },
    formIsValid: editedProduct ? true : false,
  });

  const [title, setTitle] = useState(editedProduct ? editedProduct.title : "");
  const [imageUrl, setImageUrl] = useState(
    editedProduct ? editedProduct.imageUrl : ""
  );
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState(
    editedProduct ? editedProduct.description : ""
  );

  const submitHandler = useCallback(() => {
    console.log("editedProduct: ", editedProduct);
    if (!formState.formIsValid) {
      Alert.alert("Wrong input!", "Please check the errors in the form,", [
        { text: "Okay" },
      ]);
      return;
    }
    if (editedProduct) {
      dispatch(
        updateProduct({
          id: productId,
          title: formState.inputValues.title,
          imageUrl: formState.inputValues.imageUrl,
          description: formState.inputValues.description,
        })
      ); // 기존의 state를 useReducer로 바꿔준다.
      // dispatch(
      //   updateProduct({
      //     id: productId,
      //     title: title,
      //     imageUrl: imageUrl,
      //     description: description,
      //   })
      // );
    } else {
      dispatch(
        createProduct({
          title: formState.inputValues.title,
          imageUrl: formState.inputValues.imageUrl,
          description: formState.inputValues.description,
          price: formState.inputValues.price,
        })
      );
      // dispatch(
      //   createProduct({
      //     title: title,
      //     imageUrl: imageUrl,
      //     description: description,
      //     price: price,
      //   })
      // );
    }
    navigation.goBack();
    // navigation.navigate("UserProducts");
  }, [
    navigation,
    dispatch,
    productId,
    // title,
    // description,
    // imageUrl,
    // price,
    editedProduct,
    formState,
  ]);
  // 기존의 useState보다 useReducer를 사용할때 dependency도 간단해진다!

  useLayoutEffect(() => {
    navigation.setOptions({
      title: productId ? "Edit Product" : "Add Product",
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            title="Save"
            iconName={
              Platform.OS === "android" ? "md-checkmark" : "ios-checkmark"
            }
            onPress={submitHandler}
          />
        </HeaderButtons>
      ),
    });
  }, [navigation, submitHandler]);

  // 아래와 같이 input element 에 들어가는 값에 대한 유효성 검사를 할 수 있는 함수를 만들 수 있다.
  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );

  return (
    <KeyboardAvoidingView // 키보드 가 현재 화면의 Description input element 를 가리기 때문에 이렇게 처리해준다
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={100} // 본인의 스크린 사이즈에 맞게 처리해준다.
    >
      <ScrollView>
        <View style={styles.form}>
          <Input
            id="title"
            label="Title"
            errorText="Please enter a valid title!"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next"
            onInputChange={inputChangeHandler} // 커스텀하게 만든 Input 컴포넌트에서 사용할 state 변경 함수
            // 기존의 inputChangeHandler.bind(this, 'title') 은 리랜더링을 많이 일으키기 때문에..  useCallback을 사용하고
            // 하위 컴포넌트에서 input 값을 받아 처리해준다!!
            initialValue={editedProduct ? editedProduct.title : ""}
            initallyValid={!!editedProduct}
            required
          />
          <Input
            id="imageUrl"
            label="Image Url"
            errorText="Please enter a valid image url!"
            keyboardType="default"
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            initialValue={editedProduct ? editedProduct.imageUrl : ""}
            initiallyValid={!!editedProduct}
            required
          />
          {editedProduct ? null : (
            <Input
              id="price"
              label="Price"
              errorText="Please enter a valid price!"
              keyboardType="decimal-pad"
              returnKeyType="next"
              onInputChange={inputChangeHandler}
              required
              min={0.1}
            />
          )}
          <Input
            id="description"
            label="Description"
            errorText="Please enter a valid description!"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            multiline
            numberOfLines={3}
            onInputChange={inputChangeHandler}
            initialValue={editedProduct ? editedProduct.description : ""}
            initiallyValid={!!editedProduct}
            required
            minLength={5}
          />
          {/* <View style={styles.formControl}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={(text) => setTitle(text)}
          />
        </View>
        <View style={styles.formControl}>
          <Text style={styles.label}>Image URL</Text>
          <TextInput
            style={styles.input}
            value={imageUrl}
            onChangeText={(text) => setImageUrl(text)}
          />
        </View>
        <View style={styles.formControl}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={(text) => setDescription(text)}
          />
        </View>
        {editedProduct ? null : (
          <View style={styles.formControl}>
            <Text style={styles.label}>Price</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={(text) => setPrice(text)}
            />
          </View>
        )} */}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
  // formControl: {
  //   width: "100%",
  // },
  // label: {
  //   fontFamily: "open-sans-bold",
  //   marginVertical: 8,
  // },
  // input: {
  //   paddingHorizontal: 2,
  //   paddingVertical: 5,
  //   borderBottomColor: "#ccc",
  //   borderBottomWidth: 1,
  // },
});

export default EditProductScreen;
