import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import StarRating from "./StarRating";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "../Button/Button";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { AntDesign } from "@expo/vector-icons";

const ConfirmReservationCard = ({
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
  capacity,
  reservationID,
  roomNo,
}) => {
  const [loading, setLoading] = useState(false);
  const generateRoomNumber = (capacity) => {
    const randomRoom = Math.floor(Math.random() * capacity) + 1;
    return randomRoom;
  };

  async function decreaseHotelCapacity(hotelName) {
    setLoading(true);
    const db = getFirestore();
    const hotelsCollectionRef = collection(db, "hotels");

    const hotelQuery = query(
      hotelsCollectionRef,
      where("hotelName", "==", hotelName)
    );

    try {
      const querySnapshot = await getDocs(hotelQuery);
      for (const document of querySnapshot.docs) {
        const hotelRef = doc(db, "hotels", document.id);
        const hotelData = document.data();
        const currentCapacity = hotelData.capacity;
        let newCapacity = currentCapacity - 1;
        await updateDoc(hotelRef, {
          capacity: newCapacity,
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error decreasing hotel capacity:", error);
    }
  }
  const updateReservation = async () => {
    setLoading(true);
    const roomNo = generateRoomNumber(capacity);
    const db = getFirestore();
    const washingtonRef = doc(db, "reservations", reservationID);
    await updateDoc(washingtonRef, {
      status: true,
      roomNo: roomNo,
    });
    decreaseHotelCapacity(hotelName);
    setLoading(false);
  };

  const confirmReservationButton = () => {
    updateReservation();
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontWeight: "bold", fontSize: 18, color: "blue" }}>
        {hotelName}
      </Text>

      <View style={{ marginVertical: 10 }}>
        <Text style={{ fontWeight: "bold", color: "brown" }}>
          Giriş Tarihi: {enterDate}
        </Text>
        <Text style={{ fontWeight: "bold", color: "brown" }}>
          Çıkış Tarihi: {exitDate}
        </Text>
      </View>

      <View style={{ marginVertical: 10 }}>
        <Text style={{ fontWeight: "bold" }}>
          Müşteri Adı: {bookerName} {bookerSurname}
        </Text>
        <Text style={{ fontWeight: "bold" }}>
          İletişim Adresi: {bookerEmail}
        </Text>
        <Text style={{ fontWeight: "bold" }}>
          Seçilen Oda: {bedCount} Kişilik Oda
        </Text>
      </View>
      {status !== false && (
        <View>
          <Text
            style={{
              color: "#5C8374",
              fontStyle: "italic",
              fontWeight: "bold",
            }}
          >
            Atanan Oda Numarası: {roomNo}
          </Text>
        </View>
      )}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
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
          <>
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
          </>
        )}
      </View>

      {status === false && (
        <Button
          title={"Talebi Onayla"}
          onPress={confirmReservationButton}
          loading={loading}
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

export default ConfirmReservationCard;
