import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import StarRating from "./StarRating";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
const getIsAdmin = async () => {
  try {
    const isAdmin = await AsyncStorage.getItem("isAdmin");
    return isAdmin;
  } catch (error) {
    console.error("Error getting isAdmin from AsyncStorage:", error);
    return null;
  }
};

const HotelCard = ({ city, hotelStar, photoURLs, hotelName, capacity }) => {
  const navigation = useNavigation();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchIsAdmin = async () => {
      const adminStatus = await getIsAdmin();
      setIsAdmin(adminStatus);
    };
    fetchIsAdmin();
  }, []);

  const handlePress = () => {
    if (isAdmin === true) {
      navigation.navigate("EditHotel", {
        hotelName,
        city,
        hotelStar,
        photoURLs,
        capacity,
      });
    } else {
      navigation.navigate("HotelDetails", {
        hotelName,
        city,
        hotelStar,
        photoURLs,
        capacity,
      });
    }
  };
  return (
    <Pressable onPress={handlePress}>
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
    </Pressable>
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
