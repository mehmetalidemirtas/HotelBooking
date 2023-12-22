import React, { useState, useEffect } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, app } from "../../firebaseConfig";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";
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
const getHotelPhotos = async (hotelId) => {
  try {
    const storage = getStorage();
    const storageRef = ref(storage, `images/${hotelId}`);
    const allItems = await listAll(storageRef);

    const subfolders = allItems.prefixes;

    const photoURLs = await Promise.all(
      subfolders.map(async (subfolder) => {
        const photoList = await listAll(subfolder);
        return await Promise.all(
          photoList.items.map(async (photoRef) => {
            return await getDownloadURL(photoRef);
          })
        );
      })
    );

    const flattenedPhotoURLs = photoURLs.flat();

    console.log("Photo URLs for Hotel", hotelId, ":", flattenedPhotoURLs);

    return flattenedPhotoURLs;
  } catch (error) {
    console.error("Error getting hotel photos:", error);
    throw error;
  }
};
const getAllHotels = async () => {
  try {
    const db = getFirestore();
    const storage = getStorage();
    const hotelsCollectionRef = collection(db, "hotels");
    const querySnapshot = await getDocs(hotelsCollectionRef);
    const hotelsData = [];

    for (const doc of querySnapshot.docs) {
      const hotelData = doc.data();
      console.log("Hotel Data:", hotelData);
      const hotelId = doc.id;

      const photoURLs = await getHotelPhotos(hotelId);

      console.log("Photo URLs for Hotel", hotelId, ":", photoURLs);
      hotelsData.push({
        id: hotelId,
        hotelName: hotelData.hotelName,
        capacity: hotelData.capacity,
        city: hotelData.city,
        hotelStar: hotelData.hotelStar,
        photoURLs: photoURLs,
        hotelOwnerUID: hotelData.uid,
      });
    }

    console.log("All hotels and photos retrieved from Firestore successfully");

    return hotelsData;
  } catch (error) {
    console.error(
      "Error retrieving all hotels and photos from Firestore:",
      error
    );
    throw error;
  }
};

export default function AllHotelsScreen({ navigation }) {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      try {
        const fetchedHotels = await getAllHotels();
        setHotels(fetchedHotels || []);
        console.log("hotels", hotels);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching hotels:", error);
        setHotels([]);
      }
    };

    fetchHotels();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View>
        {loading ? (
          <>
            <ActivityIndicator
              size="large"
              color="red"
              style={{ marginTop: 300 }}
            />
            <Text style={{ textAlign: "center" }}>
              Oteller sunucudan getiriliyor, Lütfen bekleyiniz...
            </Text>
          </>
        ) : (
          hotels.map((hotel) => (
            <HotelCard
              navigation={navigation}
              key={hotel.id}
              Jcity={hotel.city}
              JhotelName={hotel.hotelName}
              JhotelStar={hotel.hotelStar}
              JphotoURLs={hotel.photoURLs}
              Jcapacity={hotel.capacity}
              JhotelOwnerUID={hotel.hotelOwnerUID}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
