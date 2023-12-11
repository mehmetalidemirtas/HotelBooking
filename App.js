import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
import firebase from "./firebaseConfig";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

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
      // ..
    });
};
const signIn = async () => {
  await signInWithEmailAndPassword(auth, "asdsad@gmail.com", "asdsddad")
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      //navigate("/home");
      console.log(user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
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
export default function App() {
  useEffect(() => {
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
  });

  return (
    <View style={styles.container}>
      <Button title="Sign Up" onPress={createUser} />
      <Button title="Sign In" onPress={signIn} />
      <Button title="Sign Out" onPress={handleSignOut} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
