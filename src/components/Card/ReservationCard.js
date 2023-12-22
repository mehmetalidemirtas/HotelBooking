import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import StarRating from "./StarRating";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
}) => {
  return (
    <View style={styles.container}>
      <Text style={{ fontWeight: "bold", fontSize: 18, color: "blue" }}>
        {hotelName}
      </Text>

      <View style={{ marginVertical: 10 }}>
        <Text>Giriş Tarihi: {enterDate}</Text>
        <Text>Çıkış Tarihi: {exitDate}</Text>
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
          <Text style={{ color: "red", fontWeight: "bold" }}>
            Onay bekliyor
          </Text>
        ) : (
          <Text style={{ color: "green", fontWeight: "bold" }}>Onaylandı</Text>
        )}
      </View>
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
