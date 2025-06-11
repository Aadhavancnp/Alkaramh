import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react"; // Ensure React is imported for useContext
import {
  ActivityIndicator, // For loading state on button
  Alert,
  Image,
  Modal,
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
import apiConfig from "../../api.json";
import AuthContext from "../../context/AuthContext"; // Import AuthContext
import Footer from "@/Utils/Footer/Footer";

// Define an interface for the product within a cart item
interface Product {
  _id: string;
  name: { en: string; ar?: string };
  description: { en: string; ar?: string }; // Assuming description can be used for weight/details
  price: number;
  image: string[];
}

// Define an interface for a cart item
interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
  // Add other cart item specific fields if necessary
}

const Cart = () => {
  const navigation: any = useNavigation();
  const [deletemodal, setdeletemodal] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // For initial cart loading
  const [error, setError] = useState<string | null>(null); // For initial cart loading error

  // States for remove action
  const [productToDeleteId, setProductToDeleteId] = useState<string | null>(
    null
  );
  const [removingProductId, setRemovingProductId] = useState<string | null>(
    null
  ); // Tracks the currently processing product ID for removal
  const [removeError, setRemoveError] = useState<string | null>(null); // Error specific to remove action

  // State for quantity update
  const [updatingQuantityProductId, setUpdatingQuantityProductId] = useState<
    string | null
  >(null);

  const authContext = useContext(AuthContext);
  const { user, token } = authContext || {}; // Destructure with default empty object if context is null

  // New state for selected items
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        // Try to get userId from context, fallback to AsyncStorage
        let userId = user?._id;
        if (!userId) {
          userId = await AsyncStorage.getItem("userId");
        }
        if (!userId) {
          setError("User ID is missing. Please login.");
          setLoading(false);
          return;
        }
        setLoading(true);
        setError(null);
        // POST to /cart with userId in body
        const response = await axios.post(`${apiConfig.API_URL}/cart`, {
          userId,
        });
        // Use response.data.data as per your sample
        setCartItems(response.data.data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCartItems();
  }, [user?._id, authContext?.isLoading]);

  const openDeleteModal = (productId: string) => {
    setProductToDeleteId(productId);
    setRemoveError(null); // Clear previous errors when opening modal
    setdeletemodal(true);
  };

  const handleRemoveFromCart = async () => {
    if (!productToDeleteId || !user?._id || !token) {
      setRemoveError("User not authenticated. Cannot remove item.");
      Alert.alert("Error", "User not authenticated. Cannot remove item.");
      return;
    }

    setRemovingProductId(productToDeleteId);
    setRemoveError(null);

    try {
      const response = await fetch(
        "https://alkarmah-backend.onrender.com/api/cart/remove",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: user._id,
            productId: productToDeleteId,
          }),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || "Failed to remove item from cart."
        );
      }

      // Update cart items locally
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.product._id !== productToDeleteId)
      );
      Alert.alert("Success", responseData.message || "Item removed from cart.");
      setdeletemodal(false);
      setProductToDeleteId(null); // Reset after successful removal
    } catch (err: any) {
      setRemoveError(err.message);
      // Modal remains open to show error
    } finally {
      setRemovingProductId(null);
    }
  };

  // Toggle selection for a cart item
  const toggleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  // Only allow checkout if at least one item is selected
  const handlecheckout = () => {
    if (selectedItems.length === 0) {
      Alert.alert("Select at least one product to checkout.");
      return;
    }
    // Pass selectedItems to checkout screen if needed
    navigation.navigate("Checkout", { selectedItems });
  };

  const handleUpdateQuantity = async (productId: string, amount: number) => {
    const currentItem = cartItems.find(
      (item) => item.product._id === productId
    );
    if (!currentItem) return;

    if (currentItem.quantity + amount <= 0) {
      openDeleteModal(productId);
      return;
    }

    if (!user?._id || !token) {
      Alert.alert("Error", "User not authenticated. Cannot update quantity.");
      return;
    }

    setUpdatingQuantityProductId(productId);

    try {
      const response = await fetch(
        "https://alkarmah-backend.onrender.com/api/cart/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: user._id,
            productId: productId,
            quantity: amount,
          }),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to update quantity.");
      }

      // Backend returns the updated cart in responseData.cart
      if (responseData.cart && responseData.cart.items) {
        setCartItems(responseData.cart.items);
      } else {
        // Fallback if cart structure is not as expected, though less ideal
        console.warn(
          "Cart structure in response was not as expected. Full cart update preferred."
        );
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.product._id === productId
              ? { ...item, quantity: item.quantity + amount }
              : item
          )
        );
      }
      // Alert.alert("Success", "Quantity updated."); // Optional: Can be noisy
    } catch (err: any) {
      Alert.alert("Error", err.message || "Could not update quantity.");
    } finally {
      setUpdatingQuantityProductId(null);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Ionicons name="chevron-back" size={24} />
            <Text style={styles.headerTitle}>Your order</Text>
          </View>

          <TouchableOpacity style={styles.addressRow}>
            <Ionicons name="location-sharp" size={18} color="#3B82F6" />
            <Text style={styles.addressText}>Abu Nakhlah, Qatar...</Text>
            <Ionicons name="chevron-down" size={18} color="#3B82F6" />
          </TouchableOpacity>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: hp("22%") }} // Increased padding for button+footer
          >
            {loading && (
              <Text style={styles.loadingText}>Loading cart items...</Text>
            )}
            {error && <Text style={styles.errorText}>Error: {error}</Text>}
            {!loading && !error && cartItems.length === 0 && (
              <Text style={styles.emptyCartText}>Your cart is empty.</Text>
            )}
            {!loading &&
              !error &&
              cartItems.map((item) => (
                <View key={item._id} style={styles.cartCard}>
                  <View style={styles.cardTopRow}>
                    <TouchableOpacity
                      style={styles.radioBtn}
                      onPress={() => toggleSelectItem(item._id)}
                    >
                      {selectedItems.includes(item._id) ? (
                        <Ionicons
                          name="radio-button-on"
                          size={22}
                          color="#1D4ED8"
                        />
                      ) : (
                        <Ionicons
                          name="radio-button-off"
                          size={22}
                          color="#bbb"
                        />
                      )}
                    </TouchableOpacity>
                    <Image
                      source={{
                        uri:
                          Array.isArray(item.product.image) &&
                          item.product.image.length > 0
                            ? item.product.image[0]
                            : "https://via.placeholder.com/200",
                      }}
                      style={styles.cartImage}
                      resizeMode="cover"
                    />
                    <View style={styles.cardActionBtns}>
                      <TouchableOpacity
                        style={styles.editBtn}
                        onPress={() => {
                          /* Add your edit logic here */
                        }}
                      >
                        <MaterialIcons name="edit" size={20} color="#3B82F6" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deleteBtn}
                        onPress={() => openDeleteModal(item.product._id)}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={20}
                          color="#EF4444"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.cartInfo}>
                    <Text style={styles.cartName} numberOfLines={1}>
                      {item.product.name.en}
                    </Text>
                    {/* <Text style={styles.cartDesc} numberOfLines={2}>
                      {item.product.description.en}
                    </Text> */}
                    <View style={styles.cartRow}>
                      <Text style={styles.cartLabel}>Category:</Text>
                      <Text style={styles.cartValue}>
                        {item.product.category}
                      </Text>
                    </View>
                    <View style={styles.cartRow}>
                      <Text style={styles.cartLabel}>Price:</Text>
                      <Text style={styles.cartPrice}>
                        {item.product.price} QAR
                      </Text>
                    </View>
                    <View style={styles.cartRow}>
                      <Text style={styles.cartLabel}>Qty:</Text>
                      <Text style={styles.cartValue}>{item.quantity}</Text>
                      <Text style={styles.cartLabel}>Total:</Text>
                      <Text style={styles.cartTotal}>
                        {item.product.price * item.quantity} QAR
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
          </ScrollView>
        </View>
        {/* Checkout button fixed above footer */}
        <View style={styles.checkoutBtnUltraWrapper}>
          <TouchableOpacity
            style={[
              styles.checkoutBtnUltra,
              (loading || !!error || selectedItems.length === 0) &&
                styles.checkoutBtnDisabled,
            ]}
            onPress={handlecheckout}
            disabled={loading || !!error || selectedItems.length === 0}
          >
            <Text style={styles.checkoutText}>Check out</Text>
          </TouchableOpacity>
        </View>
        {/* <Footer /> */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={deletemodal}
          onRequestClose={() => {
            setdeletemodal(false);
            setRemoveError(null); // Clear error when closing modal manually
            setProductToDeleteId(null);
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.trashIconContainer}>
                <Ionicons name="trash" size={wp("6%")} color="#f87171" />
              </View>
              <Text style={styles.modalTitle}>
                Are you sure you want to delete this item from your cart?
              </Text>

              {removeError && (
                <Text style={styles.modalErrorText}>{removeError}</Text>
              )}

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => {
                    setdeletemodal(false);
                    setRemoveError(null);
                    setProductToDeleteId(null);
                  }}
                  disabled={removingProductId === productToDeleteId}
                >
                  <Text style={styles.cancelText}>No, keep it</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.confirmBtn,
                    removingProductId === productToDeleteId &&
                      styles.confirmBtnDisabled,
                  ]}
                  onPress={handleRemoveFromCart}
                  disabled={removingProductId === productToDeleteId}
                >
                  {removingProductId === productToDeleteId ? (
                    <ActivityIndicator size="small" color="#374151" />
                  ) : (
                    <Text style={styles.confirmText}>Yes, delete</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      <Footer/>
    </SafeAreaView>
  );
};

export default Cart;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    paddingHorizontal: wp("4%"),
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("1.5%"),
    marginTop: hp("4%"),
  },
  headerTitle: {
    fontSize: wp("5%"),
    fontWeight: "600",
    marginLeft: wp("2%"),
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    padding: wp("3%"),
    marginBottom: hp("2%"),
  },
  addressText: {
    marginHorizontal: wp("2%"),
    color: "#3B82F6",
    fontWeight: "500",
    flex: 1,
  },
  loadingText: {
    textAlign: "center",
    marginTop: hp("5%"),
    fontSize: wp("4%"),
  },
  errorText: {
    textAlign: "center",
    marginTop: hp("5%"),
    fontSize: wp("4%"),
    color: "red",
  },
  emptyCartText: {
    textAlign: "center",
    marginTop: hp("5%"),
    fontSize: wp("4%"),
    color: "gray",
  },
  cartCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginVertical: hp("1%"),
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    alignItems: "flex-start",
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    width: "100%",
  },
  radioBtn: {
    marginRight: 8,
  },
  cartImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: "#f4f4f4",
    marginRight: 10,
  },
  cardActionBtns: {
    flexDirection: "row",
    marginLeft: "auto",
    gap: 8,
  },
  editBtn: {
    padding: 4,
    marginRight: 4,
  },
  deleteBtn: {
    padding: 4,
  },
  cartInfo: {
    width: "100%",
    marginTop: 2,
  },
  cartHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  cartName: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#222",
    flex: 1,
    marginRight: 8,
  },
  cartDesc: {
    fontSize: 13,
    color: "#666",
    marginBottom: 6,
  },
  cartRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
    gap: 6,
  },
  cartLabel: {
    fontSize: 13,
    color: "#888",
    marginRight: 4,
    fontWeight: "500",
  },
  cartValue: {
    fontSize: 13,
    color: "#444",
    marginRight: 12,
  },
  cartPrice: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#2A3B8F",
    marginRight: 12,
  },
  cartTotal: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1D4ED8",
    marginLeft: 4,
  },
  checkoutBtnUltraWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: hp("8%"),
    backgroundColor: "#fff",
    paddingHorizontal: wp("4%"),
    paddingTop: 10,
    paddingBottom: 8,
    zIndex: 10,
  },
  checkoutBtnUltra: {
    backgroundColor: "#1D4ED8",
    paddingVertical: hp("2.2%"),
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 0,
  },
  checkoutBtnDisabled: {
    backgroundColor: "#A0A0A0",
  },
  checkoutText: {
    color: "#fff",
    fontSize: wp("4.2%"),
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: wp("5%"),
    width: wp("85%"),
    paddingTop: hp("6%"),
    paddingBottom: hp("3%"),
    paddingHorizontal: wp("5%"),
    alignItems: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  trashIconContainer: {
    position: "absolute",
    top: -wp("5%"),
    backgroundColor: "white",
    borderRadius: wp("10%"),
    padding: wp("2.5%"),
    borderWidth: 2,
    borderColor: "#f87171",
    elevation: 6,
  },
  modalTitle: {
    fontSize: wp("4.5%"),
    fontWeight: "600",
    textAlign: "center",
    marginBottom: hp("1.5%"),
    color: "#333",
  },
  modalErrorText: {
    color: "red",
    textAlign: "center",
    marginBottom: hp("1.5%"),
    fontSize: wp("3.8%"),
  },
  modalButtons: {
    width: "100%",
    marginTop: hp("2%"),
  },
  cancelBtn: {
    backgroundColor: "#E5E7EB",
    paddingVertical: hp("1.8%"),
    borderRadius: wp("2.5%"),
    alignItems: "center",
    marginBottom: hp("1.2%"),
  },
  cancelText: {
    color: "#374151",
    fontWeight: "600",
    fontSize: wp("4%"),
  },
  confirmBtn: {
    backgroundColor: "#EF4444",
    paddingVertical: hp("1.8%"),
    borderRadius: wp("2.5%"),
    alignItems: "center",
  },
  confirmBtnDisabled: {
    backgroundColor: "#FCA5A5",
  },
  confirmText: {
    color: "white",
    fontWeight: "600",
    fontSize: wp("4%"),
  },
});
