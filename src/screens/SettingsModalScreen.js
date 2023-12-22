import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import { doc, updateDoc, getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsModalScreen({ navigation, route }) {
  const { name, surname } = route.params;
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [newName, setNewName] = useState(name);
  const [newSurname, setNewSurname] = useState(surname);
  useEffect(() => {
    if (surname === undefined) {
      setTitle("Adınızı düzenleyin");
      setStatus("editName");
    }
    if (name === undefined) {
      setTitle("Soyadınızı düzenleyin");
      setStatus("editSurname");
    }
  }, []);

  const updateUser = async () => {
    const uid = await AsyncStorage.getItem("uid");

    const db = getFirestore();
    const usersRef = doc(db, "users", uid);

    if (status === "editName") {
      await updateDoc(usersRef, {
        name: newName,
      });
      navigation.goBack();
    } else {
      await updateDoc(usersRef, {
        surname: newSurname,
      });
      navigation.goBack();
    }
  };
  return (
    <View
      style={{ flex: 1, justifyContent: "center", backgroundColor: "white" }}
    >
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 20,
          textAlign: "center",
          marginBottom: 5,
        }}
      >
        {title}
      </Text>
      {status === "editName" ? (
        <Input
          placeholder={"Yeni adınızı giriniz"}
          value={newName}
          onChangeText={(value) => setNewName(value)}
        />
      ) : (
        <Input
          placeholder={"Yeni soyadınızı giriniz"}
          value={newSurname}
          onChangeText={(value) => setNewSurname(value)}
        />
      )}
      <Button title="Değişiklikleri Kaydet" onPress={updateUser} />
    </View>
  );
}
