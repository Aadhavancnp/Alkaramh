import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { LogBox, StyleSheet, Text, View } from "react-native";
import MobileLoginScreen from "./components/Login/Login"; 
import Otp from "./components/Login/otp/Otp";
import Profile from "./components/Profile/Profile";
import Products from "./components/Products/Products";
import Footer from "./Utils/Footer/Footer";
import Cart from "./components/Cart/Cart";
import Checkoutpage from "./components/checkout/Checkoutpage";
import { NavigationContainer } from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import Home from "./components/Homepage/Home";
import ProductDetails from "./components/ProductIndetail/View";
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider
import WishlistScreen from "./components/Profile/WishlistScreen"; // Assuming this was added from previous tasks
import OrderHistoryScreen from "./components/Profile/OrderHistoryScreen"; // Assuming this was added

const Stack = createStackNavigator();
export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Routers />
        <StatusBar style="auto" />
      </NavigationContainer>
    </AuthProvider>
  );
}
const Routers = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={MobileLoginScreen} />
      <Stack.Screen name="otp" component={Otp} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Products" component={Products} />
      <Stack.Screen name="Cart" component={Cart} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="ProductIndetail" component={ProductDetails} />
      <Stack.Screen name="Checkout" component={Checkoutpage}/>
      <Stack.Screen name="WishlistScreen" component={WishlistScreen} /> 
      <Stack.Screen name="OrderHistoryScreen" component={OrderHistoryScreen} />
    </Stack.Navigator>
  );
};

