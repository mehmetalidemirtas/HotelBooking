import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { ref, getDownloadURL, getStorage, uploadBytes } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

import StarRating from "../components/Card/StarRating";
import Button from "../components/Button/Button";
import Input from "../components/Input/Input";
import { Picker } from "@react-native-picker/picker";
import citiesInTurkey from "../../assets/cities";
import Stars from "react-native-stars";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

export default function EditHotelScreen({ navigation, route }) {
  const {
    JhotelName,
    Jcity,
    JhotelStar,
    JphotoURLs,
    Jcapacity,
    Jbirkisilikodabaslangic,
    Jbirkisilikodabitis,
    Jikikisilikodabaslangic,
    Jikikisilikodabitis,
    Juckisilikodabaslangic,
    Juckisilikodabitis,
  } = route.params;
  const [city, setCity] = useState(Jcity);
  const [hotelName, setHotelName] = useState(JhotelName);
  const [capacity, setCapacity] = useState(Jcapacity);
  const [hotelStar, setHotelStar] = useState(JhotelStar);
  const [selectedImages, setSelectedImages] = useState(JphotoURLs);
  const [loading, setLoading] = useState(false);
  const [birkisilikodabaslangic, setBirkisilikodabaslangic] = useState(
    Jbirkisilikodabaslangic
  );
  const [ikikisilikodabaslangic, setIkikisilikodabaslangic] = useState(
    Jikikisilikodabaslangic
  );
  const [uckisilikodabaslangic, setUckisilikodabaslangic] = useState(
    Juckisilikodabaslangic
  );
  const [birkisilikodabitis, setBirkisilikodabitis] =
    useState(Jbirkisilikodabitis);
  const [ikikisilikodabitis, setIkikisilikodabitis] =
    useState(Jikikisilikodabitis);
  const [uckisilikodabitis, setUckisilikodabitis] =
    useState(Juckisilikodabitis);

  const renderImageItem = ({ item }) => (
    <Image source={{ uri: item }} style={styles.imageItem} />
  );

  const deleteHotel = async () => {
    setLoading(true);
    try {
      await deleteHotelByName(JhotelName);
      setLoading(false);
      navigation.goBack();
    } catch (error) {
      setLoading(false);
      console.error(
        "deleteHotelByName fonksiyonu çağrılırken bir hata oluştu:",
        error
      );
    }
  };
  const deleteHotelByName = async (hotelName) => {
    hotelName = JhotelName;
    try {
      const db = getFirestore();
      const collectionName = "hotels";

      const hotelsQuery = query(
        collection(db, collectionName),
        where("hotelName", "==", hotelName)
      );

      const querySnapshot = await getDocs(hotelsQuery);

      querySnapshot.forEach(async (document) => {
        const hotelIdToDelete = document.id;
        await deleteDoc(doc(db, collectionName, hotelIdToDelete));
      });
    } catch (error) {
      console.error("Otel belgesi silinirken bir hata oluştu:", error);
    }
  };
  const getReservedRooms = async () => {
    try {
      const uid = await AsyncStorage.getItem("uid");
      const db = getFirestore();
      const storage = getStorage();
      const hotelsCollectionRef = collection(db, "reservedRooms");
      const userHotelsQuery = query(
        hotelsCollectionRef,
        where("uid", "==", uid),
        where("hotelName", "==", JhotelName)
      );
      const querySnapshot = await getDocs(userHotelsQuery);
      const reservedRoomsList = [];

      for (const doc of querySnapshot.docs) {
        const reservedData = doc.data();
        reservedRoomsList.push({
          reservedRoomNo: reservedData.reservedRoomNo,
        });
      }

      console.log(
        "User hotels and photos retrieved from Firestore successfully"
      );
      const reservedRooms = reservedRoomsList.map(
        (item) => item.reservedRoomNo
      );

      return reservedRooms;
    } catch (error) {
      console.error(
        "Error retrieving user hotels and photos from Firestore:",
        error
      );
      throw error;
    }
  };
  const [reservedRooms, setReservedRooms] = useState([]);

  useEffect(() => {
    const fetchReservedRooms = async () => {
      setLoading(true);
      try {
        const fetchedReservedRooms = await getReservedRooms();
        setReservedRooms(fetchedReservedRooms || []);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching reserved rooms:", error);
        setReservedRooms([]);
      }
    };

    fetchReservedRooms();
  }, []);
  const updateHotel = async () => {
    setLoading(true);
    try {
      await deleteHotelByName(JhotelName);
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

      await uploadImagesToFirebase(hotelId);

      console.log("Hotel data and images added to Firestore successfully");
      setLoading(false);
      navigation.navigate("My Hotels");
    } catch (error) {
      console.error("Error adding hotel data and images to Firestore:", error);
    }
  };
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
            İşlem gerçekleştiriliyor, Lütfen bekleyiniz...
          </Text>
        </>
      ) : (
        <>
          <View
            style={{ backgroundColor: "#eee", margin: 10, borderRadius: 20 }}
          >
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
            <View style={{ margin: 15 }}>
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

          <Input
            placeholder={"Yeni otel adı giriniz"}
            value={hotelName}
            onChangeText={(inputText) => setHotelName(inputText)}
          />
          <Input
            placeholder={"Yeni kapasite giriniz"}
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
              onChangeText={(inputText) => setBirkisilikodabaslangic(inputText)}
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
              onChangeText={(inputText) => setIkikisilikodabaslangic(inputText)}
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
              onChangeText={(inputText) => setUckisilikodabaslangic(inputText)}
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
              default={hotelStar}
              update={(val) => {
                setHotelStar(val);
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

          <Button
            title="Rezervasyon Durumunu Görüntüle"
            onPress={() =>
              navigation.navigate("RoomsStatuses", {
                birkisilikodabaslangic,
                birkisilikodabitis,
                ikikisilikodabaslangic,
                ikikisilikodabitis,
                Juckisilikodabaslangic,
                uckisilikodabitis,
                reservedRooms,
              })
            }
          />
          <Button title=" Yeni Fotoğraf Seçiniz" onPress={pickImages} />
          <Button title="Bilgileri Güncelle" onPress={updateHotel} />
          <Button title="Oteli Sil" onPress={deleteHotel} />
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
});
