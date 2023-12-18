import React from "react";
import { View } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const StarRating = ({ rating }) => {
  const filledStars = Math.floor(rating);
  const stars = [];
  for (let i = 0; i < filledStars; i++) {
    stars.push(<AntDesign key={i} name="star" size={24} color="gold" />);
  }

  return <View style={{ flexDirection: "row" }}>{stars}</View>;
};

export default StarRating;
