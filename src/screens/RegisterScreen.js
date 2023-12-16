import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import { Picker } from "@react-native-picker/picker";
import FlashMessage, {
  showMessage,
  hideMessage,
} from "react-native-flash-message";

const auth = getAuth();

export default function RegisterScreen({ navigation }) {
  const [isAdmin, setIsAdmin] = useState();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  const createUser = async () => {
    await createUserWithEmailAndPassword(auth, username, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        showMessage({
          message: errorCode,
          type: "danger",
        });
        // ..
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Kullanıcı Bilgileri</Text>
      <View style={styles.body_container}>
        <Input
          placeholder="Kullanıcı adı"
          value={username}
          onChangeText={(inputText) => setUsername(inputText)}
        />
        <Input
          placeholder="Şifre"
          value={password}
          onChangeText={(inputText) => setPassword(inputText)}
        />
        <Picker
          selectedValue={isAdmin}
          mode="dialog"
          dropdownIconColor={"red"}
          onValueChange={(itemValue, itemIndex) => setIsAdmin(itemValue)}
        >
          <Picker.Item label="Müşteri" value="false" />
          <Picker.Item label="Otel Sahibi" value="admin" />
        </Picker>
        <Button onPress={createUser} title={"Kayıt Ol"} />
      </View>
      <FlashMessage position="top" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
  },
  logo_container: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    fontSize: 25,
    fontWeight: "bold",
    padding: 20,
  },
});
