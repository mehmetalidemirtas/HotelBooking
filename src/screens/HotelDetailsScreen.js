import React from "react";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";

export default function HotelDetailsScreen({ navigation, route }) {
  const { hotelName, city, hotelStar, photoURLs, capacity } = route.params;

  return (
    <ScrollView style={styles.container}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>HotelDetailsScreen Screen</Text>
        <View>
          <Text>{hotelName}</Text>
          <Text>{city}</Text>
          <Text>{hotelStar}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
});
