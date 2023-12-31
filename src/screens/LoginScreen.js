import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import { auth, app } from "../../firebaseConfig";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import FlashMessage, { showMessage } from "react-native-flash-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation, handleLogin, setIsAdmin }) {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const [splash, setSplash] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setLoading(true);
        const db = getFirestore(app);
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const isAdminValue = userData.isAdmin;
          setIsAdmin(isAdminValue);
          await AsyncStorage.setItem("isAdmin", JSON.stringify(isAdminValue));
          const uid = user.uid;
          await AsyncStorage.setItem("uid", uid);
          setSplash(false);
          handleLogin();
          setLoading(false);
        }
      }
      if (!user) {
        setSplash(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    setLoading(true);
    await signInWithEmailAndPassword(auth, username, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const uid = user.uid;
        const db = getFirestore(app);
        const userRef = doc(db, "users", uid);

        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const isAdminValue = userData.isAdmin;
          setIsAdmin(isAdminValue);
        }
        await handleLogin();
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        showMessage({
          message: errorMessage,
          type: "danger",
        });
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      {splash === true ? (
        <Image
          style={[
            styles.logo,
            { justifyContent: "center", alignSelf: "center", flex: 1 },
          ]}
          source={require("../../assets/login-logo.png")}
        />
      ) : (
        <>
          <View style={styles.logo_container}>
            <Image
              style={styles.logo}
              source={require("../../assets/login-logo.png")}
            />
          </View>
          <View style={styles.body_container}>
            <Input
              placeholder="Kullanıcı adı"
              value={username}
              onChangeText={(inputText) => setUsername(inputText)}
            />
            <Input
              placeholder="Şifre"
              isPassword
              value={password}
              onChangeText={(inputText) => setPassword(inputText)}
            />
            <Button onPress={signIn} title={"Giriş Yap"} loading={loading} />
            <Button
              title={"Kayıt Ol"}
              onPress={() => navigation.navigate("RegisterScreen")}
              loading={loading}
            />
            <StatusBar style="auto" />
          </View>
          <FlashMessage position="top" />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  logo_container: {
    flex: 1,
    justifyContent: "center",
  },
  body_container: {
    marginBottom: 100,
  },
  logo: {
    height: Dimensions.get("window").width * 0.5,
    width: Dimensions.get("window").height / 3,
    resizeMode: "contain",
    alignItems: "center",
    alignSelf: "center",
  },
});
