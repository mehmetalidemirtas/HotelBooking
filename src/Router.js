import React, { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import SettingsScreen from "./screens/SettingsScreen";
import HomeScreen from "./screens/HomeScreen";
import AllHotelsScreen from "./screens/AllHotelsScreen";
import ReservationsScreen from "./screens/ReservationsScreen";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import LoginScreen from "./screens/LoginScreen";
import MyHotelsScreen from "./screens/MyHotelsScreen";
import RegisterScreen from "./screens/RegisterScreen";
import { signOut } from "firebase/auth";
import { auth, app } from "../firebaseConfig";
import AddNewHotelScreen from "./screens/AddNewHotelScreen";
import HotelDetailsScreen from "./screens/HotelDetailsScreen";
import EditHotelScreen from "./screens/EditHotelScreen";
import SettingsModalScreen from "./screens/SettingsModalScreen";
import ConfirmReservationScreen from "./screens/ConfirmReservationScreen";
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
export default function Router() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const MyHotelsStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="My Hotels"
          options={{
            title: "Otellerim",
            presentation: "transparentModal",
          }}
          component={MyHotelsScreen}
        />
        <Stack.Screen
          name="AddNewHotel"
          options={{
            title: "Yeni Otel Ekle",
            presentation: "transparentModal",
          }}
          component={AddNewHotelScreen}
        />
        <Stack.Screen
          name="HotelDetails"
          options={{
            title: "Rezervasyon Yap",
            presentation: "transparentModal",
          }}
          component={HotelDetailsScreen}
        />
        <Stack.Screen
          name="EditHotel"
          options={{
            title: "Otel Düzenle",
            presentation: "transparentModal",
          }}
          component={EditHotelScreen}
        />
      </Stack.Navigator>
    );
  };
  const AllHotelsStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="AllHotels"
          options={{
            title: "Oteller",
            presentation: "transparentModal",
          }}
          component={AllHotelsScreen}
        />
        <Stack.Screen
          name="HotelDetails"
          options={{
            title: "Rezervasyon Yap",
            presentation: "transparentModal",
          }}
          component={HotelDetailsScreen}
        />
        <Stack.Screen
          name="EditHotel"
          options={{
            title: "Otel Düzenle",
            presentation: "transparentModal",
          }}
          component={EditHotelScreen}
        />
      </Stack.Navigator>
    );
  };
  const LoginStack = () => {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="LoginScreen">
          {(props) => (
            <LoginScreen
              {...props}
              handleLogin={handleLogin}
              setIsAdmin={setIsAdmin}
              options={{
                presentation: "transparentModal",
              }}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="RegisterScreen"
          options={{
            presentation: "transparentModal",
          }}
          component={RegisterScreen}
        />
      </Stack.Navigator>
    );
  };
  const SettingsStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="SettingsScreen"
          options={{
            title: "Ayarlar",
            presentation: "transparentModal",
            headerRight: () => (
              <MaterialIcons
                name="logout"
                size={25}
                color="black"
                onPress={onLogout}
              />
            ),
          }}
          component={SettingsScreen}
        />
        <Stack.Screen
          name="EditProfile"
          options={{
            title: "Profili Düzenle",
            presentation: "transparentModal",
          }}
          component={SettingsModalScreen}
        />
      </Stack.Navigator>
    );
  };
  const handleLogin = async () => {
    try {
      await AsyncStorage.setItem("isLoggedIn", "true");
      setIsLoggedIn(true);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const MainTabsForUser = () => {
    return (
      <Tab.Navigator>
        <Tab.Screen
          name="PopularHotels"
          component={HomeScreen}
          options={{
            tabBarShowLabel: true,
            title: "Popüler Oteller",
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="star" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="AllHotelsStack"
          component={AllHotelsStack}
          options={{
            headerShown: false,
            tabBarShowLabel: true,
            tabBarLabel: "Oteller",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="hotel" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Reservations"
          component={ReservationsScreen}
          options={{
            tabBarShowLabel: true,
            title: "Rezervasyonlarım",
            tabBarLabel: "Rezervasyonlarım",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="book" size={size} color={color} />
            ),
          }}
        />

        <Tab.Screen
          name="Settings"
          component={SettingsStack}
          options={{
            tabBarShowLabel: true,
            headerShown: false,
            tabBarLabel: "Ayarlar",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  };

  const MainTabsForAdmin = () => {
    return (
      <Tab.Navigator>
        <Tab.Screen
          name="MyHotelsTab"
          component={MyHotelsStack}
          options={{
            tabBarShowLabel: true,
            headerShown: false,
            tabBarLabel: "Otellerim",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="hotel" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="ConfirmReservation"
          component={ConfirmReservationScreen}
          options={{
            tabBarShowLabel: true,
            title: "Rezervasyon Talepleri",
            tabBarLabel: "Rezervasyon Talepleri",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="book" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsStack}
          options={{
            tabBarShowLabel: true,
            headerShown: false,
            tabBarLabel: "Ayarlar",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings" size={size} color={color} />
            ),
            headerRight: () => (
              <MaterialIcons
                name="logout"
                size={25}
                color="black"
                onPress={onLogout}
                style={{ marginRight: 10 }}
              />
            ),
          }}
        />
      </Tab.Navigator>
    );
  };

  const onLogout = async () => {
    signOut(auth)
      .then(() => {
        console.log("signout");
        setIsLoggedIn(false);
      })
      .catch((error) => {
        // An error happened.
      });
  };

  const getIsSignedIn = async () => {
    const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
    return isLoggedIn;
  };

  /* useEffect(() => {
    const checkIsSignedIn = async () => {
      const signedIn = await getIsSignedIn();
      setIsLoggedIn(signedIn);
    };

    checkIsSignedIn();
  }, [isLoggedIn]);
 */

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {isLoggedIn ? (
          isAdmin ? (
            <Stack.Screen
              name="MainTabsForAdmin"
              component={MainTabsForAdmin}
              options={{ headerShown: false }}
            />
          ) : (
            <Stack.Screen
              name="MainTabsForUser"
              component={MainTabsForUser}
              options={{ headerShown: false }}
            />
          )
        ) : (
          <Stack.Screen
            name="LoginStack"
            component={LoginStack}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
