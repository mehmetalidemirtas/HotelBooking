import React, { useState } from "react";
import { auth } from "./firebaseConfig";
import Router from "./src/Router";
import FlashMessage from "react-native-flash-message";

function App() {
  return <Router />;
}

export default App;
