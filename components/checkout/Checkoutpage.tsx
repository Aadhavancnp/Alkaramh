import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react"; // Ensure React is imported
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import AuthContext from "../../context/AuthContext"; // Import AuthContext

// Define structure for cart items passed via route params
interface CartItemProduct {
  _id: string;
  name: { en: string };
  price: number;
  // other product fields if necessary
}
interface CartItem {
  product: CartItemProduct;
  quantity: number;
}

const DELIVERY_FEE = 50; // Fixed delivery fee

const Checkoutpage = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const authContext = useContext(AuthContext);
  const { user, token } = authContext || {};

  const [selectedPaymentOption, setSelectedPaymentOption] = useState<number>(3);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [basketTotal, setBasketTotal] = useState<number>(0);
  const [totalAmountToPay, setTotalAmountToPay] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (route.params?.cartItems) {
      const items: CartItem[] = route.params.cartItems;
      setCartItems(items);

      let currentBasketTotal = 0;
      items.forEach((item) => {
        currentBasketTotal += item.product.price * item.quantity;
      });
      setBasketTotal(currentBasketTotal);
      setTotalAmountToPay(currentBasketTotal + DELIVERY_FEE);
    } else {
      // Handle case where cartItems are not passed or are empty
      Alert.alert("Error", "No items in cart to checkout.");
      // Potentially navigate back or disable functionality
    }
  }, [route.params?.cartItems]);

  const handleSelectPaymentMethod = (index: number): void => {
    setSelectedPaymentOption(index);
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      Alert.alert("Error", "Your cart is empty.");
      return;
    }
    if (selectedPaymentOption === 0) {
      Alert.alert("Payment Required", "Please select a payment method.");
      return;
    }
    if (!user || !token) {
      Alert.alert(
        "Authentication Error",
        "You must be logged in to place an order."
      );
      setError("User not authenticated.");
      return;
    }

    setLoading(true);
    setError(null);
    setOrderSuccess(false);

    const orderPayload = {
      user: user._id, // Use user._id from context
      items: cartItems.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      totalAmount: totalAmountToPay,
    };

    try {
      const response = await fetch(
        "https://alkarmah-backend.onrender.com/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Use token from context
          },
          body: JSON.stringify(orderPayload),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        // Check for non-2xx status codes
        throw new Error(responseData.message || "Failed to place order.");
      }

      // Assuming 201 is the success status from backend for order creation
      if (response.status === 201) {
        setOrderSuccess(true);
        Alert.alert(
          "Success",
          responseData.message || "Order placed successfully!"
        );
        // Here you might want to clear the cart or navigate
        // For now, just display success and disable button
        // navigation.navigate('Home'); // Example navigation
      } else {
        // Handle other non-error but not ideal statuses if necessary
        throw new Error(
          responseData.message ||
            "Order placement resulted in an unexpected status."
        );
      }
    } catch (err: any) {
      setError(err.message);
      Alert.alert("Order Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const canPlaceOrder =
    !loading && !orderSuccess && selectedPaymentOption !== 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={wp("6%")} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Checkout</Text>
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}
        {orderSuccess && (
          <Text style={styles.successText}>Order placed successfully!</Text>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pay with</Text>
          {[
            { id: 1, label: "💳 Debit Card" },
            { id: 2, label: "💳 Credit Card" },
            { id: 3, label: "💵 Cash on delivery" },
          ].map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.option}
              onPress={() => handleSelectPaymentMethod(option.id)}
            >
              <Text style={styles.optionText}>{option.label}</Text>
              <Ionicons
                name={
                  selectedPaymentOption === option.id
                    ? "radio-button-on"
                    : "radio-button-off"
                }
                size={wp("5.5%")}
                color={selectedPaymentOption === option.id ? "#2A3B8F" : "#ccc"}
              />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price details</Text>
          <View style={styles.row}>
            <Text>Basket Total</Text>
            <Text>{basketTotal.toFixed(2)} QAR</Text>
          </View>
          <View style={styles.row}>
            <Text>Delivery Fee</Text>
            <Text>{DELIVERY_FEE.toFixed(2)} QAR</Text>
          </View>
          <View style={[styles.row, styles.totalRow]}>
            <Text style={styles.totalAmountText}>Total amount</Text>
            <Text style={styles.totalAmountText}>
              {totalAmountToPay.toFixed(2)} QAR
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, !canPlaceOrder && styles.buttonDisabled]}
          onPress={handlePlaceOrder}
          disabled={!canPlaceOrder}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Place Order</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Checkoutpage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp("4%"),
    backgroundColor: "#f9f9f9", // Light background for the whole page
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("2%"),
    marginTop: hp("2%"), // Adjusted margin
    gap: wp("2.5%"),
  },
  headerText: {
    fontSize: wp("5.5%"), // Slightly larger
    fontWeight: "bold", // Bolder
    color: "#333",
  },
  section: {
    backgroundColor: "#fff", // White cards for sections
    borderRadius: wp("3%"), // More pronounced border radius
    padding: wp("5%"), // Adjusted padding
    marginVertical: hp("1.5%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    color: "#2A3B8F",
    fontWeight: "bold", // Bolder
    marginBottom: hp("2%"), // More space
    fontSize: wp("4.5%"), // Slightly larger
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: hp("2%"), // Adjusted padding
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0", // Lighter border
  },
  optionText: {
    fontSize: wp("4%"),
    color: "#444", // Darker text
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: hp("1.5%"), // Adjusted padding
    alignItems: "center",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0", // Slightly darker border
    marginTop: hp("1.5%"),
    paddingTop: hp("1.5%"),
  },
  totalAmountText: {
    fontSize: wp("4.2%"),
    fontWeight: "bold",
    color: "#2A3B8F",
  },
  button: {
    backgroundColor: "#2A3B8F",
    paddingVertical: hp("1.8%"), // Adjusted padding
    borderRadius: wp("2.5%"), // Consistent border radius
    alignItems: "center",
    marginTop: hp("3%"), // More space above button
    marginBottom: hp("2%"), // Space at the bottom
  },
  buttonDisabled: {
    backgroundColor: "#A9A9A9", // Grey out when disabled
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold", // Bolder
    fontSize: wp("4.5%"),
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: hp("1%"),
    fontSize: wp("3.8%"),
  },
  successText: {
    color: "green",
    textAlign: "center",
    marginBottom: hp("1%"),
    fontSize: wp("3.8%"),
    fontWeight: "bold",
  },
});
