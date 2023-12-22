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
const getUserHotels = async () => {
  try {
    const uid = await AsyncStorage.getItem("uid");
    console.log("user credentials:", uid);

    const db = getFirestore();
    const storage = getStorage();
    const hotelsCollectionRef = collection(db, "hotels");
    const userHotelsQuery = query(
      hotelsCollectionRef,
      where("hotelStar", "==", 5)
    );
    const querySnapshot = await getDocs(userHotelsQuery);
    const hotelsData = [];

    for (const doc of querySnapshot.docs) {
      const hotelData = doc.data();
      console.log("Hotel Data:", hotelData);
      const hotelId = doc.id;

      const photoURLs = await getHotelPhotos(hotelId);

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
export default function HomeScreen({ navigation }) {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);

      try {
        const fetchedHotels = await getUserHotels();
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
    <ScrollView style={styles.container}>
      <View>
        <View>
          {loading ? (
            <>
              <ActivityIndicator
                size="large"
                color="red"
                style={{ marginTop: 300 }}
              />
              <Text style={{ textAlign: "center" }}>
                Popüler oteller sunucudan getiriliyor, Lütfen bekleyiniz...
              </Text>
            </>
          ) : hotels.length === 0 ? (
            <Text style={{ textAlign: "center", marginTop: 300 }}>
              Popüler otel bulunmuyor
            </Text>
          ) : (
            hotels.map((hotel) => (
              <HotelCard
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
