import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import { Picker } from "@react-native-picker/picker";
import FlashMessage, { showMessage } from "react-native-flash-message";

export default function RegisterScreen({ navigation }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState();
  const [name, setName] = useState();
  const [surname, setSurname] = useState();
  const [password, setPassword] = useState();

  const createUser = async () => {
    setLoading(true);
    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const db = getFirestore();
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, { isAdmin, name, surname, email });
        console.log("User data added to Firestore successfully");
        setLoading(false);
        navigation.navigate("LoginScreen");
      })
      .catch((error) => {
        setLoading(false);
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        showMessage({
          message: errorMessage,
          type: "info",
        });
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Kullanıcı Bilgileri</Text>
      <View style={styles.body_container}>
        <Input
          placeholder="Kullanıcı adı"
          value={name}
          onChangeText={(inputText) => setName(inputText)}
        />
        <Input
          placeholder="Kullanıcı soyadı"
          value={surname}
          onChangeText={(inputText) => setSurname(inputText)}
        />
        <Input
          placeholder="Email adresi"
          value={email}
          onChangeText={(inputText) => setEmail(inputText)}
        />
        <Input
          placeholder="Şifre"
          value={password}
          isPassword
          onChangeText={(inputText) => setPassword(inputText)}
        />
        <Picker
          selectedValue={isAdmin}
          mode="dialog"
          dropdownIconColor={"red"}
          onValueChange={(itemValue, itemIndex) => setIsAdmin(itemValue)}
        >
          <Picker.Item label="Müşteri" value="false" />
          <Picker.Item label="Otel Sahibi" value="true" />
        </Picker>
        <Button onPress={createUser} title={"Kayıt Ol"} loading={loading} />
        <FlashMessage position="top" />
      </View>
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
