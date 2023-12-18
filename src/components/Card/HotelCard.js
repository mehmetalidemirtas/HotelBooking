import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import StarRating from "./StarRating";

const HotelCard = ({ city, hotelStar, photoURLs, hotelName, capacity }) => {
  return (
    <View style={styles.container}>
      {photoURLs.length > 0 && (
        <Image
          source={{ uri: photoURLs[0] }}
          style={styles.photo}
          resizeMode="cover"
        />
      )}
      <Text style={{ fontWeight: "bold", fontSize: 18, marginTop: 5 }}>
        {hotelName}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={styles.city}>Konum: {city}</Text>
        <StarRating rating={hotelStar} />
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

export default HotelCard;
