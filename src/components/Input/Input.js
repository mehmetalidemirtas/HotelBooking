import React, { useState } from "react";
import { TextInput, View, StyleSheet } from "react-native";

const Input = ({
  onChangeText,
  placeholder,
  value,
  isPassword,
  keyboardType,
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        onChangeText={onChangeText}
        value={value}
        secureTextEntry={isPassword}
        keyboardType={keyboardType}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  input: {
    height: 40,
    borderColor: "#d32f2f",
    borderWidth: 1,
    borderRadius: 20,
    padding: 8,
  },
});

export default Input;
