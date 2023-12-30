import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
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
    return flattenedPhotoURLs;
  } catch (error) {
    console.error("Error getting hotel photos:", error);
    throw error;
  }
};
const getAllHotels = async () => {
  try {
    const db = getFirestore();
    const hotelsCollectionRef = collection(db, "hotels");
    const querySnapshot = await getDocs(hotelsCollectionRef);
    const hotelsData = [];

    for (const doc of querySnapshot.docs) {
      const hotelData = doc.data();
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
        birkisilikodabaslangic: hotelData.birkisilikodabaslangic,
        birkisilikodabitis: hotelData.birkisilikodabitis,
        ikikisilikodabaslangic: hotelData.ikikisilikodabaslangic,
        ikikisilikodabitis: hotelData.ikikisilikodabitis,
        uckisilikodabaslangic: hotelData.uckisilikodabaslangic,
        uckisilikodabitis: hotelData.uckisilikodabitis,
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
        ) : hotels.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 300 }}>
            Otel bulunmuyor
          </Text>
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
              Jbirkisilikodabaslangic={hotel.birkisilikodabaslangic}
              Jbirkisilikodabitis={hotel.birkisilikodabitis}
              Jikikisilikodabaslangic={hotel.ikikisilikodabaslangic}
              Jikikisilikodabitis={hotel.ikikisilikodabitis}
              Juckisilikodabaslangic={hotel.uckisilikodabaslangic}
              Juckisilikodabitis={hotel.uckisilikodabitis}
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
