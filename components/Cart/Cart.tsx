import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
  ActivityIndicator, // For loading state on button
  Alert, // For simple success/error messages
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Footer from '../../Utils/Footer/Footer';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useContext } from 'react'; // Ensure React is imported for useContext
import AuthContext from '../../context/AuthContext'; // Import AuthContext

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
  const [productToDeleteId, setProductToDeleteId] = useState<string | null>(null);
  const [removingProductId, setRemovingProductId] = useState<string | null>(null); // Tracks the currently processing product ID for removal
  const [removeError, setRemoveError] = useState<string | null>(null); // Error specific to remove action

  // State for quantity update
  const [updatingQuantityProductId, setUpdatingQuantityProductId] = useState<string | null>(null);

  const authContext = useContext(AuthContext);
  const { user, token } = authContext || {}; // Destructure with default empty object if context is null

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!user?._id) { // Check for user and user._id
        setError("User ID is missing. Please login.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null); // Clear previous errors
      try {
        const response = await fetch(`http://localhost:3000/api/cart?userId=${user._id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCartItems(data.items || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user?._id) { // Only fetch if user ID is available
        fetchCartItems();
    } else if (!authContext?.isLoading) { // Don't show error while initial context is loading
        setError("Please login to view your cart.");
        setLoading(false);
    }
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
      const response = await fetch('http://localhost:3000/api/cart/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user._id,
          productId: productToDeleteId,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to remove item from cart.");
      }

      // Update cart items locally
      setCartItems(prevItems => prevItems.filter(item => item.product._id !== productToDeleteId));
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

  const handlecheckout = () => {
    navigation.navigate("Checkout");
  };

  const handleUpdateQuantity = async (productId: string, amount: number) => {
    const currentItem = cartItems.find(item => item.product._id === productId);
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
      const response = await fetch('http://localhost:3000/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user._id,
          productId: productId,
          quantity: amount, 
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to update quantity.");
      }

      // Backend returns the updated cart in responseData.cart
      if (responseData.cart && responseData.cart.items) {
        setCartItems(responseData.cart.items);
      } else {
        // Fallback if cart structure is not as expected, though less ideal
        console.warn("Cart structure in response was not as expected. Full cart update preferred.");
        setCartItems(prevItems =>
          prevItems.map(item =>
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
        <View style={styles.datacontainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: hp("20%") }}
          >
            {loading && <Text style={styles.loadingText}>Loading cart items...</Text>}
            {error && <Text style={styles.errorText}>Error: {error}</Text>}
            {!loading && !error && cartItems.length === 0 && <Text style={styles.emptyCartText}>Your cart is empty.</Text>}
            {!loading && !error && cartItems.map((item) => (
              <View key={item._id} style={styles.card}>
                <Image
                  source={{ uri: item.product.image && item.product.image.length > 0 ? item.product.image[0] : 'https://via.placeholder.com/70' }}
                  style={styles.productImage}
                />
                <View style={styles.productInfo}>
                  <Text style={styles.productTitle}>{item.product.name.en}</Text>
                  <Text style={styles.productWeight}>{item.product.description.en || 'N/A'}</Text>
                  <Text style={styles.productPrice}>{item.product.price} QAR</Text>
                  <View style={styles.quantityRow}>
                    <TouchableOpacity 
                      onPress={() => handleUpdateQuantity(item.product._id, -1)} 
                      disabled={updatingQuantityProductId === item.product._id || removingProductId === item.product._id}
                      style={styles.quantityButton}
                    >
                      <Ionicons name="remove-circle-outline" size={wp('6%')} color={updatingQuantityProductId === item.product._id ? '#ccc' : '#555'} />
                    </TouchableOpacity>
                    
                    {updatingQuantityProductId === item.product._id ? (
                      <ActivityIndicator size="small" color="#007bff" style={styles.quantityLoader} />
                    ) : (
                      <Text style={styles.quantityText}>{item.quantity}</Text>
                    )}

                    <TouchableOpacity 
                      onPress={() => handleUpdateQuantity(item.product._id, 1)} 
                      disabled={updatingQuantityProductId === item.product._id || removingProductId === item.product._id}
                      style={styles.quantityButton}
                    >
                      <Ionicons name="add-circle-outline" size={wp('6%')} color={updatingQuantityProductId === item.product._id ? '#ccc' : '#555'} />
                    </TouchableOpacity>
                    <Ionicons
                      name="trash"
                      size={22}
                      color="red"
                      style={styles.trashIcon}
                      onPress={() => openDeleteModal(item.product._id)}
                    />
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
        <TouchableOpacity 
          style={[styles.checkoutBtn, (loading || !!error || cartItems.length === 0) && styles.checkoutBtnDisabled]} 
          onPress={handlecheckout} 
          disabled={loading || !!error || cartItems.length === 0}
        >
          <Text style={styles.checkoutText}>Check out</Text>
        </TouchableOpacity>
      </View>
      <Footer />
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
              <Ionicons name="trash" size={wp('6%')} color="#f87171" />
            </View>
            <Text style={styles.modalTitle}>Are you sure you want to delete this item from your cart?</Text>
            
            {removeError && <Text style={styles.modalErrorText}>{removeError}</Text>}

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
                style={[styles.confirmBtn, removingProductId === productToDeleteId && styles.confirmBtnDisabled]}
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


      
    </SafeAreaView>
  );
};

export default Cart;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingText: {
    textAlign: 'center',
    marginTop: hp('5%'),
    fontSize: wp('4%'),
  },
  errorText: {
    textAlign: 'center',
    marginTop: hp('5%'),
    fontSize: wp('4%'),
    color: 'red',
  },
  emptyCartText: {
    textAlign: 'center',
    marginTop: hp('5%'),
    fontSize: wp('4%'),
    color: 'gray',
  },
  checkoutBtnDisabled: {
    backgroundColor: '#A0A0A0', // Disabled color for checkout button
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
  card: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: wp("3%"),
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: hp("2%"),
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: wp("3%"),
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: wp("4%"),
    fontWeight: "600",
  },
  productWeight: {
    color: "#6B7280",
    fontSize: wp("3.5%"),
  },
  productPrice: {
    fontSize: wp("4%"),
    fontWeight: "bold",
    marginTop: hp("0.5%"),
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp("1%"),
  },
  quantityText: {
    marginHorizontal: wp("3%"), // Increased margin
    fontSize: wp("4.5%"), // Increased font size
    fontWeight: "600", // Bolder
    minWidth: wp('6%'), // Ensure it has some width for alignment
    textAlign: 'center',
  },
  quantityButton: { // Style for the TouchableOpacity around icons
    padding: wp('1%'),
  },
  quantityLoader: {
    marginHorizontal: wp("3%"),
    width: wp('6%'), // Match approx width of quantity text
  },
  trashIcon: {
    marginLeft: wp("4%"),
    width: 30,
    height: 30,
    tintColor: "#f87171",
  },
  checkoutBtn: {
    backgroundColor: "#1D4ED8",
    paddingVertical: hp("1.8%"),
    borderRadius: 10,
    alignItems: "center",
    position: "absolute",
    bottom: hp("3%"),
    left: wp("4%"),
    right: wp("4%"),
    marginBottom: hp("8%"),
  },
  checkoutText: {
    color: "#fff",
    fontSize: wp("4.2%"),
    fontWeight: "bold",
  },
  datacontainer: {
    height: hp("65%"),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: wp('5%'), // Responsive border radius
    width: wp("85%"), // Slightly wider modal
    paddingTop: hp('6%'), // Responsive padding
    paddingBottom: hp('3%'),
    paddingHorizontal: wp('5%'),
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
    top: -wp('5%'), // Adjust based on icon size
    backgroundColor: "white",
    borderRadius: wp('10%'), // Make it circular
    padding: wp('2.5%'),
    borderWidth: 2,
    borderColor: "#f87171",
    elevation: 6, // Shadow for the icon container
  },
  modalTitle: {
    fontSize: wp("4.5%"),
    fontWeight: "600",
    textAlign: "center",
    marginBottom: hp('1.5%'), // Responsive margin
    color: '#333',
  },
  modalErrorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: hp('1.5%'),
    fontSize: wp('3.8%'),
  },
  modalButtons: {
    width: "100%",
    marginTop: hp('2%'), // Add some space before buttons
  },
  cancelBtn: {
    backgroundColor: "#E5E7EB", // Lighter cancel button
    paddingVertical: hp('1.8%'), // Responsive padding
    borderRadius: wp('2.5%'),
    alignItems: "center",
    marginBottom: hp('1.2%'),
  },
  cancelText: {
    color: "#374151", // Darker text for better contrast
    fontWeight: "600",
    fontSize: wp('4%'),
  },
  confirmBtn: {
    backgroundColor: "#EF4444", // More prominent delete color
    paddingVertical: hp('1.8%'),
    borderRadius: wp('2.5%'),
    alignItems: "center",
  },
  confirmBtnDisabled: {
    backgroundColor: "#FCA5A5", // Lighter red when disabled
  },
  confirmText: {
    color: "white",
    fontWeight: "600",
    fontSize: wp('4%'),
  },
});
