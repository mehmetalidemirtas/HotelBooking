import React, { useState, useEffect } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, app } from "../../firebaseConfig";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  setDoc,
} from "firebase/firestore";
import {
  ref,
  uploadString,
  listAll,
  getDownloadURL,
  getStorage,
  uploadBytes,
} from "firebase/storage";

import {
  Dimensions,
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
const { width } = Dimensions.get("window");

export default function AddNewHotelScreen({ navigation }) {
  const [city, setCity] = useState(null);
  const [hotelName, setHotelName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [hotelStar, setHotelStar] = useState(2);
  const [selectedImages, setSelectedImages] = useState([]);

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
    } catch (error) {
      console.error("Error uploading images to Firebase:", error);
    }
  };

  const AddNewHotel = async () => {
    try {
      const uid = await AsyncStorage.getItem("uid");
      console.log("user credentials:", uid);
      const db = getFirestore();

      const hotelsCollectionRef = collection(db, "hotels");

      const newHotelRef = await addDoc(hotelsCollectionRef, {
        uid,
        hotelName,
        capacity,
        hotelStar,
        city,
      });

      const hotelId = newHotelRef.id;
      console.log("New hotel added with ID:", hotelId);

      await uploadImagesToFirebase(hotelId);

      console.log("Hotel data and images added to Firestore successfully");
    } catch (error) {
      console.error("Error adding hotel data and images to Firestore:", error);
    }
  };
  const renderImageItem = ({ item }) => (
    <Image source={{ uri: item }} style={styles.imageItem} />
  );
  return (
    <ScrollView style={styles.container}>
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
              console.log(val);
            }}
            count={5}
            half={false}
            starSize={40}
            fullStar={<AntDesign name="star" style={[styles.myStarStyle]} />}
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
    width,
    height: 250,
    resizeMode: "cover",
  },
});
