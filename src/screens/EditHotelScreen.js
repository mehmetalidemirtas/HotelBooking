import React from "react";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";

export default function EditHotelScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>EditHotel Screen</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
});
