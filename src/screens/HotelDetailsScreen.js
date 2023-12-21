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
  const { JhotelName, Jcity, JhotelStar, JphotoURLs, Jcapacity } = route.params;

  const [enterDate, setEnterDate] = useState(new Date());
  const [exitDate, setExitDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [showEnterDate, setShowEnterDate] = useState(false);
  const [showExitDate, setShowExitDate] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShowEnterDate(false);
    setEnterDate(currentDate);
  };
  const onChangeExitDate = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShowExitDate(false);
    setExitDate(currentDate);
  };
  const showMode = (currentMode) => {
    setShowEnterDate(true);
    setMode(currentMode);
  };
  const showModeExitDate = (currentMode) => {
    setShowExitDate(true);
    setMode(currentMode);
  };
  const showDatepicker = () => {
    showMode("date");
  };
  const showDatepickerExit = () => {
    showModeExitDate("date");
  };

  const renderImageItem = ({ item }) => (
    <Image source={{ uri: item }} style={styles.imageItem} />
  );

  const bookingHotel = () => {
    console.log("book hotel in here...");
  };

  return (
    <View style={styles.container}>
      {JphotoURLs.length > 0 && (
        <View
          style={{
            margin: 15,
            marginBottom: 10,
            justifyContent: "center",
          }}
        >
          <FlatList
            data={JphotoURLs}
            renderItem={renderImageItem}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}
      <View style={{ margin: 15 }}>
        <Text style={{ fontWeight: "bold", fontSize: 18 }}>{JhotelName}</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.city}>Konum: {Jcity}</Text>
          <StarRating rating={JhotelStar} />
        </View>
        <Button
          onPress={showDatepicker}
          title={"Otele Giriş Tarihi: " + enterDate.toLocaleDateString()}
        />
        <Button
          onPress={showDatepickerExit}
          title={"Otelden Çıkış Tarihi: " + exitDate.toLocaleDateString()}
        />
        {showEnterDate && (
          <DateTimePicker
            testID="dateTimePicker"
            value={enterDate}
            mode={mode}
            is24Hour={true}
            onChange={onChange}
            minimumDate={new Date()}
          />
        )}
        {showExitDate && (
          <DateTimePicker
            testID="dateTimePicker"
            value={exitDate}
            mode={mode}
            is24Hour={true}
            onChange={onChangeExitDate}
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
