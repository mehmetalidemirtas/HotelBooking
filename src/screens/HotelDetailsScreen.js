import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import StarRating from "../components/Card/StarRating";
import Button from "../components/Button/Button";
import DateTimePicker from "@react-native-community/datetimepicker";
import Input from "../components/Input/Input";

const { width } = Dimensions.get("window");

export default function HotelDetailsScreen({ navigation, route }) {
  const { hotelName, city, hotelStar, photoURLs, capacity } = route.params;

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const renderImageItem = ({ item }) => (
    <Image source={{ uri: item }} style={styles.imageItem} />
  );

  const bookingHotel = () => {
    console.log("book hotel in here...");
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
        <Button
          onPress={showDatepicker}
          title={"Otele Giriş Tarihi: " + date.toLocaleDateString()}
        />
        <Button
          onPress={showDatepicker}
          title={"Otelden Çıkış Tarihi: " + date.toLocaleDateString()}
        />
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            onChange={onChange}
            minimumDate={new Date()}
          />
        )}
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
