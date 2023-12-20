import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import StarRating from "../components/Card/StarRating";
import Button from "../components/Button/Button";
const { width } = Dimensions.get("window");

export default function HotelDetailsScreen({ navigation, route }) {
  const { hotelName, city, hotelStar, photoURLs, capacity } = route.params;
  const renderImageItem = ({ item }) => (
    <Image source={{ uri: item }} style={styles.imageItem} />
  );

  const bookingHotel = () => {
    console.log("book hotel...");
  };

  return (
    <View style={styles.container}>
      {photoURLs.length > 0 && (
        <View
          style={{
            margin: 15,
            marginBottom: 10,
            justifyContent: "center",
          }}
        >
          <FlatList
            data={photoURLs}
            renderItem={renderImageItem}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}
      <View style={{ margin: 15 }}>
        <Text style={{ fontWeight: "bold", fontSize: 18 }}>{hotelName}</Text>
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
      <Button title="Rezervasyon Yap" onPress={bookingHotel} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageItem: {
    width,
    height: 250,
    resizeMode: "cover",
  },
});
