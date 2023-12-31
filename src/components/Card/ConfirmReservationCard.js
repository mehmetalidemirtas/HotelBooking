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
  addDoc,
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
  birkisilikodabaslangic,
  birkisilikodabitis,
  ikikisilikodabaslangic,
  ikikisilikodabitis,
  uckisilikodabaslangic,
  uckisilikodabitis,
}) => {
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  useEffect(() => {
    if (status === true) {
      setConfirmed(false);
    }
  });
  function generateRandomRoomNo({
    bedCount,
    birkisilikodabaslangic,
    birkisilikodabitis,
    ikikisilikodabaslangic,
    ikikisilikodabitis,
    uckisilikodabaslangic,
    uckisilikodabitis,
  }) {
    const getRandomNumber = (min, max) =>
      Math.floor(Math.random() * (max - min + 1)) + min;

    let generatedRoomNumber = null;

    if (bedCount === "1") {
      generatedRoomNumber = getRandomNumber(
        Math.min(birkisilikodabaslangic, birkisilikodabitis),
        Math.max(birkisilikodabaslangic, birkisilikodabitis)
      );
    } else if (bedCount === "2") {
      generatedRoomNumber = getRandomNumber(
        Math.min(ikikisilikodabaslangic, ikikisilikodabitis),
        Math.max(ikikisilikodabaslangic, ikikisilikodabitis)
      );
    } else if (bedCount === "3") {
      generatedRoomNumber = getRandomNumber(
        Math.min(uckisilikodabaslangic, uckisilikodabitis),
        Math.max(uckisilikodabaslangic, uckisilikodabitis)
      );
    }
    return generatedRoomNumber;
  }

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
  const AddReservedRoom = async (roomNo) => {
    setLoading(true);
    try {
      const uid = await AsyncStorage.getItem("uid");
      const db = getFirestore();

      const reservedRoomsRef = collection(db, "reservedRooms");

      await addDoc(reservedRoomsRef, {
        uid,
        hotelName,
        bedCount,
        birkisilikodabaslangic,
        birkisilikodabitis,
        ikikisilikodabaslangic,
        ikikisilikodabitis,
        uckisilikodabaslangic,
        uckisilikodabitis,
        reservedRoomNo: roomNo,
        bookerUID,
      });

      console.log("Hotel data and images added to Firestore successfully");
      setLoading(false);
    } catch (error) {
      console.error("Error adding hotel data and images to Firestore:", error);
    }
  };
  const updateReservation = async () => {
    setLoading(true);

    const roomNo = generateRandomRoomNo({
      bedCount,
      birkisilikodabaslangic,
      birkisilikodabitis,
      ikikisilikodabaslangic,
      ikikisilikodabitis,
      uckisilikodabaslangic,
      uckisilikodabitis,
    });
    const db = getFirestore();
    const washingtonRef = doc(db, "reservations", reservationID);
    await updateDoc(washingtonRef, {
      status: true,
      roomNo: roomNo,
    });
    decreaseHotelCapacity(hotelName);
    AddReservedRoom(roomNo);
    setLoading(false);
    setConfirmed(true);
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

      {confirmed && <Text>Onaylandı, Sayfayı Yenileyiniz...</Text>}
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
