import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import StarRating from "./StarRating";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "../Button/Button";
import { doc, updateDoc, getFirestore } from "firebase/firestore";
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
  reservationID,
}) => {
  const updateUser = async () => {
    const db = getFirestore();
    console.log(reservationID);
    const washingtonRef = doc(db, "reservations", reservationID);
    console.log("washingtonRef", washingtonRef);
    await updateDoc(washingtonRef, {
      status: true,
    });
    console.log("Güncellendi");
  };

  const confirmReservationButton = () => {
    console.log("clicked");
    updateUser();
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
        <Button title={"Talebi Onayla"} onPress={confirmReservationButton} />
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
