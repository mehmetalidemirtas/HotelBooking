import React, { useState, useEffect } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, app } from "../../firebaseConfig";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import Button from "../components/Button/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MyHotelsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Button
          title="Otel Ekle"
          onPress={() => navigation.navigate("AddNewHotel")}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
