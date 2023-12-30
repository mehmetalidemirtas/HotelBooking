import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ReservationCard from "../components/Card/ReservationCard";

const getUserHotels = async () => {
  try {
    const uid = await AsyncStorage.getItem("uid");
    const db = getFirestore();
    const hotelsCollectionRef = collection(db, "reservations");
    const userReservationsQuery = query(
      hotelsCollectionRef,
      where("bookerUID", "==", uid)
    );
    const querySnapshot = await getDocs(userReservationsQuery);
    const reservationsData = [];

    for (const doc of querySnapshot.docs) {
      const hotelData = doc.data();
      const reservationID = doc.id;
      const firestoreTimestamp = hotelData.enterDate;
      const firestoreTimestampExit = hotelData.exitDate;

      const timestamp = Timestamp.fromMillis(
        firestoreTimestamp.seconds * 1000 +
          firestoreTimestamp.nanoseconds / 1000000
      );
      const timestampExit = Timestamp.fromMillis(
        firestoreTimestampExit.seconds * 1000 +
          firestoreTimestampExit.nanoseconds / 1000000
      );
      const date = timestamp.toDate();
      const dateExit = timestampExit.toDate();
      const formattedEnterDate = date.toLocaleString("tr-TR");
      const formattedExitDate = dateExit.toLocaleString("tr-TR");

      reservationsData.push({
        id: reservationID,
        city: hotelData.Jcity,
        hotelName: hotelData.JhotelName,
        hotelOwnerUID: hotelData.JHotelOwnerUID,
        bedCount: hotelData.bedCount,
        bookerEmail: hotelData.bookerEmail,
        bookerName: hotelData.bookerName,
        bookerSurname: hotelData.bookerSurname,
        bookerUID: hotelData.bookerUID,
        enterDate: formattedEnterDate,
        exitDate: formattedExitDate,
        status: hotelData.status,
        roomNo: hotelData.roomNo,
      });
    }
    return reservationsData;
  } catch (error) {
    console.error(
      "Error retrieving user hotels and photos from Firestore:",
      error
    );
    throw error;
  }
};
export default function ReservationsScreen({ navigation }) {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    const fetchHotels = async () => {
      try {
        const fetchedHotels = await getUserHotels();
        setHotels(fetchedHotels || []);
      } catch (error) {
        console.error("Error fetching hotels:", error);
        setHotels([]);
      }
    };
    fetchHotels();
    setTimeout(() => {
      setRefreshing(false);
    }, 3000);
  }, []);
  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);

      try {
        const fetchedHotels = await getUserHotels();
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
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      const fetchHotels = async () => {
        try {
          const fetchedHotels = await getUserHotels();
          setHotels(fetchedHotels || []);
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
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
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
                Rezervasyonlarınız sunucudan getiriliyor, Lütfen bekleyiniz...
              </Text>
            </>
          ) : hotels.length === 0 ? (
            <Text style={{ textAlign: "center", marginTop: 300 }}>
              Rezervasyonunuz bulunmuyor
            </Text>
          ) : (
            <View>
              {hotels.map((hotel) => (
                <ReservationCard
                  key={hotel.id}
                  status={hotel.status}
                  hotelName={hotel.hotelName}
                  city={hotel.city}
                  enterDate={hotel.enterDate}
                  exitDate={hotel.exitDate}
                  roomNo={hotel.roomNo}
                />
              ))}
            </View>
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
