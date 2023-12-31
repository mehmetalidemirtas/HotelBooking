import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import Button from "../components/Button/Button";

const RoomsStatuses = ({ route }) => {
  const {
    birkisilikodabaslangic,
    birkisilikodabitis,
    ikikisilikodabaslangic,
    ikikisilikodabitis,
    Juckisilikodabaslangic,
    uckisilikodabitis,
    reservedRooms,
  } = route.params;

  const [selectedRoomData, setSelectedRoomData] = useState(null);
  const [isEmpty, setIsEmpty] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const reservedRoomNumbers = reservedRooms.map((item) => item.reservedRoomNo);

  const renderSquares = (baslangic, bitis) => {
    const baslangicNumber = parseInt(baslangic, 10);
    const bitisNumber = parseInt(bitis, 10);

    const squares = [];
    for (let i = baslangicNumber; i <= bitisNumber; i++) {
      const isReserved = reservedRoomNumbers.includes(i);

      const handleSquarePress = async () => {
        setLoading(true);
        setModalVisible(true);
        if (!isReserved) {
          setIsEmpty("ODA BOŞ");
          setLoading(false);
        }
        if (isReserved) {
          try {
            const db = getFirestore();
            const reservedRoom = reservedRooms.find(
              (item) => item.reservedRoomNo === i
            );
            const bookerUID = reservedRoom?.bookerUID;
            if (bookerUID) {
              const userRef = doc(db, "users", bookerUID);
              const userDoc = await getDoc(userRef);

              if (userDoc.exists()) {
                const userData = userDoc.data();
                setSelectedRoomData(userData);
                setIsEmpty(null);
                setModalVisible(true);
              }
            }
            setLoading(false);
          } catch (error) {
            setLoading(false);
            console.error("Firebase Hata:", error);
          }
        }
      };

      squares.push(
        <TouchableOpacity
          key={i}
          style={[styles.square, isReserved && styles.reservedSquare]}
          onPress={handleSquarePress}
        >
          <Text style={styles.squareText}>{i}</Text>
          {isReserved && <Text style={styles.reservedText}>DOLU</Text>}
        </TouchableOpacity>
      );
    }
    return squares;
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedRoomData(null);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={{ padding: 10, fontWeight: "bold", fontSize: 16 }}>
        Tek Kişilik Odalar
      </Text>
      <View style={styles.gridContainer}>
        {renderSquares(birkisilikodabaslangic, birkisilikodabitis)}
      </View>

      <Text style={{ padding: 10, fontWeight: "bold", fontSize: 16 }}>
        İki Kişilik Odalar
      </Text>
      <View style={styles.gridContainer}>
        {renderSquares(ikikisilikodabaslangic, ikikisilikodabitis)}
      </View>

      <Text style={{ padding: 10, fontWeight: "bold", fontSize: 16 }}>
        Üç Kişilik Odalar
      </Text>
      <View style={styles.gridContainer}>
        {renderSquares(Juckisilikodabaslangic, uckisilikodabitis)}
      </View>
      <View style={styles.centeredView}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {loading ? (
                <>
                  <ActivityIndicator size="large" color="red" />
                  <Text style={{ textAlign: "center" }}>
                    Odada kalan müşterinin bilgileri getiriliyor, Lütfen
                    bekleyiniz...
                  </Text>
                </>
              ) : (
                <>
                  {selectedRoomData && (
                    <View>
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontSize: 20,
                          padding: 10,
                          textAlign: "center",
                        }}
                      >
                        Müşteri Bilgileri
                      </Text>
                      <Text style={styles.modalText}>
                        Adı: {selectedRoomData.name}
                      </Text>
                      <Text style={styles.modalText}>
                        Soyadı: {selectedRoomData.surname}
                      </Text>
                      <Text style={styles.modalText}>
                        İletişim Adresi: {selectedRoomData.email}
                      </Text>
                    </View>
                  )}
                  {isEmpty && (
                    <View>
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontSize: 20,
                          padding: 10,
                        }}
                      >
                        Oda Boş
                      </Text>
                    </View>
                  )}
                  <Button title={"KAPAT"} onPress={closeModal} />
                </>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    marginLeft: 8,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  square: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  reservedSquare: {
    backgroundColor: "red",
  },
  squareText: {
    fontSize: 18,
  },
  reservedText: {
    color: "white",
    fontWeight: "bold",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default RoomsStatuses;
