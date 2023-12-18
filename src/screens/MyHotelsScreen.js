import React, { useState, useEffect } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, app } from "../../firebaseConfig";
import { SafeAreaView, StyleSheet, Text, View, ScrollView } from "react-native";
import Button from "../components/Button/Button";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HotelCard from "../components/Card/HotelCard";

const getUserHotels = async () => {
  try {
    const uid = await AsyncStorage.getItem("uid");
    console.log("user credentials:", uid);

    const db = getFirestore();
    const storage = getStorage();
    const hotelsCollectionRef = collection(db, "hotels");
    const userHotelsQuery = query(hotelsCollectionRef, where("uid", "==", uid));
    const querySnapshot = await getDocs(userHotelsQuery);
    const hotelsData = [];

    for (const doc of querySnapshot.docs) {
      const hotelData = doc.data();
      console.log("Hotel Data:", hotelData);
      const hotelId = doc.id;

      const storageRef = ref(storage, `images/${hotelId}/${uid}`);
      const photoList = await listAll(storageRef);
      const photoURLs = await Promise.all(
        photoList.items.map(async (photoRef) => {
          return await getDownloadURL(photoRef);
        })
      );

      console.log("Photo URLs for Hotel", hotelId, ":", photoURLs);
      hotelsData.push({
        id: hotelId,
        hotelName: hotelData.hotelName,
        capacity: hotelData.capacity,
        city: hotelData.city,
        hotelStar: hotelData.hotelStar,
        photoURLs: photoURLs,
      });
    }

    console.log("User hotels and photos retrieved from Firestore successfully");

    return hotelsData;
  } catch (error) {
    console.error(
      "Error retrieving user hotels and photos from Firestore:",
      error
    );
    throw error;
  }
};
export default function MyHotelsScreen({ navigation }) {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const fetchedHotels = await getUserHotels();
        setHotels(fetchedHotels || []);
        console.log("hotels", hotels);
      } catch (error) {
        console.error("Error fetching hotels:", error);
        setHotels([]);
      }
    };

    fetchHotels();
  }, []);
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      const fetchHotels = async () => {
        try {
          const fetchedHotels = await getUserHotels();
          setHotels(fetchedHotels || []);
          console.log("hotels", hotels);
        } catch (error) {
          console.error("Error fetching hotels:", error);
          setHotels([]);
        }
      };
      fetchHotels();
    });
    return unsubscribe;
  }, [navigation, hotels]);
  return (
    <SafeAreaView style={styles.container}>
      <Button
        title="Otel Ekle"
        onPress={() => navigation.navigate("AddNewHotel")}
      />
      <ScrollView style={styles.container}>
        <View>
          <View>
            {hotels.map((hotel) => (
              <HotelCard
                key={hotel.id}
                city={hotel.city}
                hotelName={hotel.hotelName}
                hotelStar={hotel.hotelStar}
                photoURLs={hotel.photoURLs}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
