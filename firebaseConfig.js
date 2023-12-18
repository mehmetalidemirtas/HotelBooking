import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
const firebaseConfig = {
  apiKey: "AIzaSyAGu25G3_-BqMTf-wfIO1R9LYjTjsVn79c",
  authDomain: "hotelbooking-875e9.firebaseapp.com",
  projectId: "hotelbooking-875e9",
  storageBucket: "hotelbooking-875e9.appspot.com",
  messagingSenderId: "385039183429",
  appId: "1:385039183429:web:ddd9169569430e7a75bd2c",
};
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const storage = getStorage(app);
const storageRef = storage.ref();

export { app, auth, storageRef };
