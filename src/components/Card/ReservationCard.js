import React from "react";
import { View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";
import Button from "../Button/Button";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
const ReservationCard = ({
  city,
  hotelName,
  hotelOwnerUID,
  bedCount,
  bookerEmail,
  bookerName,
  bookerSurname,
  bookerUID,
  enterDate,
  exitDate,
  status,
  roomNo,
}) => {
  const cancelReservation = async () => {
    const uid = await AsyncStorage.getItem("uid");
    try {
      const db = getFirestore();
      const hotelsCollectionRef = collection(db, "reservations");
      const hotelQuery = query(
        hotelsCollectionRef,
        where("JhotelName", "==", hotelName),
        where("bookerUID", "==", uid)
      );
      const querySnapshot = await getDocs(hotelQuery);

      querySnapshot.forEach(async (document) => {
        const reservationIdToDelete = document.id;
        await deleteDoc(doc(db, "reservations", reservationIdToDelete));
      });
    } catch (error) {
      console.error("Error decreasing hotel capacity:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontWeight: "bold", fontSize: 18, color: "blue" }}>
        {hotelName}
      </Text>

      <View style={{ marginVertical: 10 }}>
        <Text>Giriş Tarihi: {enterDate}</Text>
        <Text>Çıkış Tarihi: {exitDate}</Text>
      </View>
      {status !== false && (
        <View>
          <Text
            style={{
              color: "#5C8374",
              fontStyle: "italic",
              fontWeight: "bold",
              marginBottom: 10,
            }}
          >
            Sizin İçin Tanımlanan Oda Numarası: {roomNo}
          </Text>
        </View>
      )}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 2,
        }}
      >
        <Text style={styles.city}>Konum: {city}</Text>
        {status === false ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <AntDesign
              name="clockcircle"
              size={24}
              color="red"
              style={{ marginRight: 10 }}
            />
            <Text style={{ color: "red", fontWeight: "bold" }}>
              Onay bekliyor
            </Text>
          </View>
        ) : (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <AntDesign
              name="checkcircle"
              size={24}
              color="#38E54D"
              style={{ marginRight: 10 }}
            />
            <Text style={{ color: "#38E54D", fontWeight: "bold" }}>
              Onaylandı
            </Text>
          </View>
        )}
      </View>
      {status === false && (
        <Button
          title={"Rezervasyon Talebini İptal Et"}
          onPress={cancelReservation}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f7f7f7",
    padding: 15,
    margin: 10,
    borderRadius: 20,
  },
  city: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "purple",
    marginTop: 5,
  },
  hotelStar: {
    fontSize: 16,
    marginBottom: 5,
  },
  photo: {
    width: "100%",
    height: 200,
    borderRadius: 15,
  },
});

export default ReservationCard;
