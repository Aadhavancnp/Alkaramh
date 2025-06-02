import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useContext } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import Cart from "../components/Cart/Cart";
import Checkoutpage from "../components/checkout/Checkoutpage";
import Home from "../components/Homepage/Home";
import MobileLoginScreen from "../components/Login/Login";
import Otp from "../components/Login/otp/Otp";
import ProductDetails from "../components/ProductIndetail/View";
import Products from "../components/Products/Products";
import OrderHistoryScreen from "../components/Profile/OrderHistoryScreen";
import Profile from "../components/Profile/Profile";
import WishlistScreen from "../components/Profile/WishlistScreen";
import AuthContext from "../context/AuthContext";

const Stack = createStackNavigator();

const InitialRouter = () => {
  const authContext = useContext(AuthContext);
  const { user, token, isLoading } = authContext || {};

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2A3B8F" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user && token ? (
          <>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Products" component={Products} />
            <Stack.Screen name="Cart" component={Cart} />
            <Stack.Screen name="ProductIndetail" component={ProductDetails} />
            <Stack.Screen name="Checkout" component={Checkoutpage} />
            <Stack.Screen name="WishlistScreen" component={WishlistScreen} />
            <Stack.Screen
              name="OrderHistoryScreen"
              component={OrderHistoryScreen}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={MobileLoginScreen} />
            <Stack.Screen name="otp" component={Otp} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default InitialRouter;
