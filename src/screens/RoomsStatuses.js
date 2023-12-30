import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

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

  const renderSquares = (baslangic, bitis) => {
    const baslangicNumber = parseInt(baslangic, 10);
    const bitisNumber = parseInt(bitis, 10);
    const squares = [];
    for (let i = baslangicNumber; i <= bitisNumber; i++) {
      const isReserved = reservedRooms.includes(i);
      squares.push(
        <View
          key={i}
          style={[styles.square, isReserved && styles.reservedSquare]}
        >
          <Text style={styles.squareText}>{i}</Text>
          {isReserved && <Text style={styles.reservedText}>DOLU</Text>}
        </View>
      );
    }
    return squares;
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
});

export default RoomsStatuses;
