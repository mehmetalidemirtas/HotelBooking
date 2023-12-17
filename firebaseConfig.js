import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
const firebaseConfig = {
  apiKey: "AIzaSyAGu25G3_-BqMTf-wfIO1R9LYjTjsVn79c",
  authDomain: "hotelbooking-875e9.firebaseapp.com",
  appId: "1:385039183429:web:ddd9169569430e7a75bd2c",
};
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export { app, auth };
