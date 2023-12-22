import React, { useEffect, useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { auth, app } from "../../firebaseConfig";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function SettingsScreen({ navigation }) {
  const [userData, setUserData] = useState({});
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [accountType, setAccountType] = useState("");
  const [email, setEmail] = useState("");
  const getUserData = () => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const db = getFirestore(app);
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userDatas = userDoc.data();
          setUserData(userData);
          setName(userDatas.name);
          setSurname(userDatas.surname);
          if (userDatas.isAdmin === "true") {
            setAccountType("Otel Sahibi");
          } else {
            setAccountType("Müşteri");
          }
          setEmail(userDatas.email);
        }
      }
    });
  };
  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getUserData();
    });
    return unsubscribe;
  }, [navigation, userData]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.text_container}>
        <Text style={styles.name_text}>
          Hoşgeldiniz {name} {surname}
        </Text>
        <View style={styles.title_container}>
          <Text style={styles.title}>Email Adresi:</Text>
          <Text style={styles.text}> {email}</Text>
        </View>
        <View style={styles.title_container}>
          <Text style={styles.title}>Hesap Türü:</Text>
          <Text style={styles.text}> {accountType}</Text>
        </View>
      </View>

      <Pressable
        onPress={() => navigation.navigate("EditProfile", { name: name })}
      >
        <View style={styles.bottom_container}>
          <Text style={styles.title}>Kullanıcı adını değiştir</Text>
          <MaterialCommunityIcons name="account" size={24} color="black" />
        </View>
      </Pressable>
      <Pressable
        onPress={() => navigation.navigate("EditProfile", { surname })}
      >
        <View style={styles.bottom_container}>
          <Text style={styles.title}>Kullanıcı soyadını değiştir</Text>
          <MaterialCommunityIcons
            name="account-multiple"
            size={24}
            color="black"
          />
        </View>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  image_container: {
    flexDirection: "row",
    backgroundColor: "#f7f7f7",
    borderRadius: 25,
    padding: 10,
    margin: 10,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  bottom_container: {
    flexDirection: "row",
    backgroundColor: "#eee",
    borderRadius: 25,
    padding: 10,
    margin: 10,
    marginTop: 5,
    height: 50,
    marginBottom: 5,
    alignItems: "center",
    justifyContent: "space-between",
  },

  name_text: {
    fontWeight: "bold",
    fontSize: 20,
    color: "black",
    textAlign: "center",
    margin: 2,
  },
  text_container: {
    flexDirection: "column",
    justifyContent: "space-around",
    padding: 5,
    backgroundColor: "#eee",
    margin: 10,
    borderRadius: 20,
    padding: 20,
  },
  title: {
    fontSize: 15,
    color: "black",
    fontWeight: "bold",
    marginLeft: 6,
  },
  title_container: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    textAlign: "center",
    textAlignVertical: "center",
    alignItems: "center",
    justifyContent: "center",
    color: "black",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
