import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import StarRating from "../components/Card/StarRating";
import Button from "../components/Button/Button";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { app } from "../../firebaseConfig";

const { width } = Dimensions.get("window");

export default function HotelDetailsScreen({ navigation, route }) {
  const {
    JhotelName,
    Jcity,
    JhotelStar,
    JphotoURLs,
    Jcapacity,
    JhotelOwnerUID,
    Jbirkisilikodabaslangic,
    Jbirkisilikodabitis,
    Jikikisilikodabaslangic,
    Jikikisilikodabitis,
    Juckisilikodabaslangic,
    Juckisilikodabitis,
  } = route.params;

  const [enterDate, setEnterDate] = useState(new Date());
  const [exitDate, setExitDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [showEnterDate, setShowEnterDate] = useState(false);
  const [showExitDate, setShowExitDate] = useState(false);
  const [bedCount, setBedCount] = useState("1");
  const [userData, setUserData] = useState({});
  const [bookerName, setName] = useState("");
  const [bookerSurname, setSurname] = useState("");
  const [bookerEmail, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(false);
  const roomNo = 0;
  const getUserData = async () => {
    const uid = await AsyncStorage.getItem("uid");

    const db = getFirestore(app);
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userDatas = userDoc.data();
      setUserData(userData);
      setName(userDatas.name);
      setSurname(userDatas.surname);
      setEmail(userDatas.email);
    }
  };
  useEffect(() => {
    getUserData();
  }, []);
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

  const bookingHotel = async () => {
    setLoading(true);
    try {
      const bookerUID = await AsyncStorage.getItem("uid");
      const db = getFirestore();

      const hotelsCollectionRef = collection(db, "reservations");

      const newHotelRef = await addDoc(hotelsCollectionRef, {
        bookerUID,
        bookerName,
        bookerSurname,
        bookerEmail,
        JhotelName,
        Jcity,
        Jcapacity,
        JhotelOwnerUID,
        bedCount,
        enterDate,
        exitDate,
        status,
        roomNo,
        Jbirkisilikodabaslangic,
        Jbirkisilikodabitis,
        Jikikisilikodabaslangic,
        Jikikisilikodabitis,
        Juckisilikodabaslangic,
        Juckisilikodabitis,
      });

      const reservationID = newHotelRef.id;
      console.log("New reservation added with ID:", reservationID);
      setLoading(false);
      navigation.goBack();
    } catch (error) {
      console.error("Error adding hotel data and images to Firestore:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <>
          <ActivityIndicator
            size="large"
            color="red"
            style={{ marginTop: 300 }}
          />
          <Text style={{ textAlign: "center" }}>
            Rezervasyon yapılıyor, Lütfen bekleyiniz...
          </Text>
        </>
      ) : (
        <>
          <View
            style={{ backgroundColor: "#eee", margin: 10, borderRadius: 20 }}
          >
            {JphotoURLs.length > 0 && (
              <View
                style={{
                  margin: 15,
                  marginBottom: 10,
                  flex: 1,
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
            <View style={{ margin: 15, marginTop: 0 }}>
              <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                {JhotelName}
              </Text>
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
            </View>
          </View>
          <View style={{ margin: 10 }}>
            <Pressable onPress={showDatepicker}>
              <View
                style={{
                  borderWidth: 1,
                  borderRadius: 20,
                  height: 40,
                  padding: 10,
                  marginVertical: 10,
                  justifyContent: "center",
                }}
              >
                <Text>
                  Otele Giriş Tarihi: {enterDate.toLocaleDateString()}
                </Text>
              </View>
            </Pressable>
            <Pressable onPress={showDatepickerExit}>
              <View
                style={{
                  borderWidth: 1,
                  borderRadius: 20,
                  height: 40,
                  padding: 10,
                  marginVertical: 10,
                  marginTop: 0,
                  justifyContent: "center",
                }}
              >
                <Text>
                  Otelden Çıkış Tarihi: {exitDate.toLocaleDateString()}
                </Text>
              </View>
            </Pressable>
            <Picker
              selectedValue={bedCount}
              mode="dialog"
              dropdownIconColor={"red"}
              onValueChange={(itemValue, itemIndex) => setBedCount(itemValue)}
            >
              <Picker.Item label="1 Kişilik Oda" value="1" />
              <Picker.Item label="2 Kişilik Oda" value="2" />
              <Picker.Item label="3 Kişilik Oda" value="3" />
            </Picker>
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
                minimumDate={enterDate}
              />
            )}
          </View>
          <Button title="Rezervasyon Yap" onPress={bookingHotel} />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageItem: {
    width: 290,
    height: 250,
    resizeMode: "cover",
    borderRadius: 15,
    marginRight: 10,
  },
});
