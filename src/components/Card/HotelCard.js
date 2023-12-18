import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const HotelCard = ({ city, hotelStar, photoURLs }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.city}>{city}</Text>
      <Text style={styles.hotelStar}>{`${hotelStar} stars`}</Text>
      {photoURLs.length > 0 && (
        <Image
          source={{ uri: photoURLs[0] }}
          style={styles.photo}
          resizeMode="cover"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    margin: 10,
  },
  city: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  hotelStar: {
    fontSize: 16,
    marginBottom: 5,
  },
  photo: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginTop: 5,
  },
});

export default HotelCard;
