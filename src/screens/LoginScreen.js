import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import firebase from "../../firebaseConfig";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import FlashMessage, {
  showMessage,
  hideMessage,
} from "react-native-flash-message";
const auth = getAuth();

const createUser = async () => {
  await createUserWithEmailAndPassword(auth, "asdsad@gmail.com", "asdsddad")
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
        message: errorMessage,
        type: "info",
      });
      // ..
    });
};

const handleSignOut = async () => {
  signOut(auth)
    .then(() => {
      console.log("signout");
    })
    .catch((error) => {
      // An error happened.
    });
};
export default function LoginScreen({ navigation, handleLogin }) {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  const signIn = async () => {
    await signInWithEmailAndPassword(auth, username, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        handleLogin();
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        showMessage({
          message: errorCode,
          type: "danger",
        });
      });
  };
  /*   useEffect(() => {
    const user = auth.currentUser;

    if (user !== null) {
      user.providerData.forEach((profile) => {
        console.log("Sign-in provider: " + profile.providerId);
        console.log("  Provider-specific UID: " + profile.uid);
        console.log("  Name: " + profile.displayName);
        console.log("  Email: " + profile.email);
        console.log("  Photo URL: " + profile.photoURL);
      });
    }
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log(uid);
      } else {
        //navigate login page
      }
    });
  }); */

  return (
    <SafeAreaView style={styles.container}>
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
          value={password}
          onChangeText={(inputText) => setPassword(inputText)}
        />
        <Button onPress={signIn} title={"Giriş Yap"} />
        <Button
          title={"Kayıt Ol"}
          onPress={() => navigation.navigate("RegisterScreen")}
        />
        <StatusBar style="auto" />
      </View>
      <FlashMessage position="top" />
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
