import React, { useState, useEffect } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { ref, getDownloadURL, getStorage, uploadBytes } from "firebase/storage";

import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Button from "../components/Button/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Input from "../components/Input/Input";
import { Picker } from "@react-native-picker/picker";
import citiesInTurkey from "../../assets/cities";
import { AntDesign } from "@expo/vector-icons";
import Stars from "react-native-stars";
import * as ImagePicker from "expo-image-picker";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
export default function AddNewHotelScreen({ navigation }) {
  const [city, setCity] = useState(null);
  const [hotelName, setHotelName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [hotelStar, setHotelStar] = useState(2);
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [birkisilikodabaslangic, setBirkisilikodabaslangic] = useState(0);
  const [ikikisilikodabaslangic, setIkikisilikodabaslangic] = useState(0);
  const [uckisilikodabaslangic, setUckisilikodabaslangic] = useState(0);
  const [birkisilikodabitis, setBirkisilikodabitis] = useState(0);
  const [ikikisilikodabitis, setIkikisilikodabitis] = useState(0);
  const [uckisilikodabitis, setUckisilikodabitis] = useState(0);
  useEffect(() => {
    const requestPermissions = async () => {
      const { granted } = await Notifications.requestPermissionsAsync();
      if (!granted) {
        console.log("Bildirim izinleri reddedildi.");
      }
    };

    requestPermissions();
  }, []);

  const sendNotification = async () => {
    const notificationContent = {
      title: "BAŞARILI",
      body: "Otel ekleme işleminiz başarıyla tamamlandı!",
      sound: true,
    };

    await Notifications.scheduleNotificationAsync({
      content: notificationContent,
      trigger: null,
    });
  };

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access media library denied");
      }
    })();
  }, []);

  const pickImages = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.3,
      });

      if (!result.canceled) {
        setSelectedImages(result.assets.map((asset) => asset.uri));
      } else {
        console.log("Image picking cancelled by user");
      }
    } catch (error) {
      console.error("Error picking images:", error);
    }
  };

  const uploadImagesToFirebase = async (hotelId) => {
    setLoading(true);

    const uid = await AsyncStorage.getItem("uid");
    try {
      const storage = getStorage();

      const storageRef = ref(storage, `images/${hotelId}/${uid}`);

      await Promise.all(
        selectedImages.map(async (image, index) => {
          const response = await fetch(image);
          const blob = await response.blob();

          const fileRef = ref(storageRef, `image_${index}.jpg`);

          await uploadBytes(fileRef, blob);
          const downloadURL = await getDownloadURL(fileRef);

          console.log(
            `Image ${index} uploaded to Firebase. Download URL: ${downloadURL}`
          );
        })
      );
      setLoading(false);
    } catch (error) {
      console.error("Error uploading images to Firebase:", error);
    }
  };

  const AddNewHotel = async () => {
    setLoading(true);
    try {
      const uid = await AsyncStorage.getItem("uid");
      const db = getFirestore();

      const hotelsCollectionRef = collection(db, "hotels");

      const newHotelRef = await addDoc(hotelsCollectionRef, {
        uid,
        hotelName,
        capacity,
        hotelStar,
        city,
        birkisilikodabaslangic,
        birkisilikodabitis,
        ikikisilikodabaslangic,
        ikikisilikodabitis,
        uckisilikodabaslangic,
        uckisilikodabitis,
      });

      const hotelId = newHotelRef.id;
      console.log("New hotel added with ID:", hotelId);

      await uploadImagesToFirebase(hotelId);

      console.log("Hotel data and images added to Firestore successfully");
      sendNotification();
      setLoading(false);
      navigation.navigate("My Hotels");
    } catch (error) {
      console.error("Error adding hotel data and images to Firestore:", error);
    }
  };
  const renderImageItem = ({ item }) => (
    <Image source={{ uri: item }} style={styles.imageItem} />
  );
  const hotelRoomNumbers = Array.from(
    { length: 1000 },
    (_, index) => index + 1
  );

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
            Oteliniz sunucuya kaydediliyor, Lütfen bekleyiniz...
          </Text>
        </>
      ) : (
        <>
          <View>
            {selectedImages.length > 0 && (
              <View
                style={{
                  margin: 15,
                  marginBottom: 10,
                  flex: 1,
                  justifyContent: "center",
                }}
              >
                <FlatList
                  data={selectedImages}
                  renderItem={renderImageItem}
                  keyExtractor={(item, index) => index.toString()}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            )}
            <Button title="Fotoğraf Seçiniz" onPress={pickImages} />
            <Input
              placeholder={"Otel adı giriniz"}
              value={hotelName}
              onChangeText={(inputText) => setHotelName(inputText)}
            />
            <Input
              placeholder={"Kapasite giriniz"}
              value={capacity}
              onChangeText={(inputText) => setCapacity(inputText)}
            />
            <Text style={{ padding: 10 }}>
              1 Kişilik Oda Numara Aralığını Giriniz:
            </Text>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Input
                placeholder={"Başlangıç Numarası"}
                value={birkisilikodabaslangic}
                keyboardType={"number-pad"}
                onChangeText={(inputText) =>
                  setBirkisilikodabaslangic(inputText)
                }
              />
              <Input
                placeholder={"Bitiş Numarası"}
                value={birkisilikodabitis}
                keyboardType={"number-pad"}
                onChangeText={(inputText) => setBirkisilikodabitis(inputText)}
              />
            </View>
            <Text style={{ padding: 10 }}>
              2 Kişilik Oda Numara Aralığını Giriniz:
            </Text>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Input
                placeholder={"Başlangıç Numarası"}
                value={ikikisilikodabaslangic}
                keyboardType={"number-pad"}
                onChangeText={(inputText) =>
                  setIkikisilikodabaslangic(inputText)
                }
              />
              <Input
                placeholder={"Bitiş Numarası"}
                value={ikikisilikodabitis}
                keyboardType={"number-pad"}
                onChangeText={(inputText) => setIkikisilikodabitis(inputText)}
              />
            </View>
            <Text style={{ padding: 10 }}>
              3 Kişilik Oda Numara Aralığını Giriniz:
            </Text>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Input
                placeholder={"Başlangıç Numarası"}
                value={uckisilikodabaslangic}
                keyboardType={"number-pad"}
                onChangeText={(inputText) =>
                  setUckisilikodabaslangic(inputText)
                }
              />
              <Input
                placeholder={"Bitiş Numarası"}
                value={uckisilikodabitis}
                keyboardType={"number-pad"}
                onChangeText={(inputText) => setUckisilikodabitis(inputText)}
              />
            </View>
            <Picker
              selectedValue={city}
              onValueChange={(itemValue) => setCity(itemValue)}
            >
              <Picker.Item label="Şehir seçiniz" value={null} />
              {citiesInTurkey.map((city, index) => (
                <Picker.Item key={index} label={city} value={city} />
              ))}
            </Picker>
            <View
              style={{ margin: 15, alignItems: "center", flexDirection: "row" }}
            >
              <Text style={{ marginRight: 10 }}>Yıldız Seçiniz: </Text>
              <Stars
                default={2}
                update={(val) => {
                  setHotelStar(val);
                }}
                count={5}
                half={false}
                starSize={40}
                fullStar={
                  <AntDesign name="star" style={[styles.myStarStyle]} />
                }
                emptyStar={
                  <AntDesign
                    name="staro"
                    style={[styles.myStarStyle, styles.myEmptyStarStyle]}
                  />
                }
              />
            </View>

            <Button title="Otelinizi Ekleyin" onPress={AddNewHotel} />
          </View>
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
  myStarStyle: {
    color: "yellow",
    backgroundColor: "transparent",
    textShadowColor: "black",
    fontSize: 30,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  myEmptyStarStyle: {
    color: "white",
  },
  imageItem: {
    width: 300,
    height: 250,
    resizeMode: "cover",
    borderRadius: 15,
    marginRight: 10,
  },
});
