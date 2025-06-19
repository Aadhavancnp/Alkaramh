import Footer from "@/Utils/Footer/Footer";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image, Modal, SafeAreaView,
  ScrollView, StatusBar, StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

// Define an interface for the product within a cart item
interface Product {
  _id: string;
  name: { en: string; ar?: string };
  description: { en: string; ar?: string };
  price: number;
  image: string[];
  stock: number;
}

// Define an interface for a cart item
interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
  varient?: string; // Optional variant field
}

const Cart = () => {
  const navigation: any = useNavigation();
  const route: any = useRoute();
  const [deletemodal, setdeletemodal] = useState<boolean>(false);
  const [showLocations, setShowLocations] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<string>("Abu Nakhlah, Qatar...");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [editingQuantities, setEditingQuantities] = useState<{ [productId: string]: string }>({});

  const locations = [
    "Abu Nakhlah, Qatar",
    "Al Hilal, Qatar",
    "Al Sadd, Qatar",
    "West Bay, Qatar",
    "Pearl Qatar",
    "Lusail, Qatar"
  ];

  // Initialize cart items based on route params
  useEffect(() => {
    const params = route.params;
    const showEmpty = params?.showEmpty === true;
    const product = params?.product;
    console.log("Route Params:", product);
    if (!showEmpty) {
      setCartItems([]);
    } else {
      // Mock cart items for UI display
      setCartItems([
        {
          _id: "cart-1",
          product: {
            _id: "prod-1",
            name: { en: "Wheat straw", ar: "قش القمح" },
            description: { en: "20 kg - Bag", ar: "حقيبة 20 كجم" },
            price: 12,
            image: ["../../assets/wheatStraw.png"],
            stock: 50,
          },
          varient: product?.variant || "default", // Use the variant from params or default
          quantity: parseInt(product.quantity || 20, 10),
          // Default to "default" if variant not provided
        }
      ]);
    }
  }, [route.params]);

  // States for UI interactions
  const [productToDeleteId, setProductToDeleteId] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const openDeleteModal = (productId: string) => {
    setProductToDeleteId(productId);
    setdeletemodal(true);
  };

  const handleRemoveFromCart = () => {
    setdeletemodal(false);
    setProductToDeleteId(null);
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.product._id !== productToDeleteId)
    );
  };

  const toggleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handlecheckout = () => {
   
    navigation.navigate("Checkout", { selectedItems });
  };

  const handleUpdateQuantity = (productId: string, change: number) => {

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.product._id === productId) {
          const newQuantity = item.quantity + change;
          
          if (newQuantity < 1) {
            Alert.alert("Invalid quantity", "Quantity cannot be less than 1");
            return item; // No change
          }
          if (newQuantity > item.product.stock) {
            Alert.alert(
              "Stock Limit",
              `Maximum available stock is ${item.product.stock}`
            );
            return item; // No change
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const handleDirectQuantityChange = (productId: string, text: string, maxStock: number) => {
    const parsedQuantity = parseInt(text, 10);
    
    if (isNaN(parsedQuantity) || parsedQuantity < 1) {
      Alert.alert("Invalid quantity", "Please enter a valid number");
      return;
    }
    
    if (parsedQuantity > maxStock) {
      Alert.alert(
        "Out of Stock",
        `Only ${maxStock} items available. Quantity set to maximum.`
      );
      return;
    }
    
    Alert.alert("Info", "Quantity update functionality removed");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar />
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Ionicons name="chevron-back" onPress={() => navigation.goBack()} size={24} style={styles.headerTitle}/>
            <Text style={styles.headerTitle}>
              {cartItems.length === 0 ? "Cart" : "Your Order"}
            </Text>
          </View>

          {/* Location Bar */}
          <View style={styles.locationContainer}>
            <TouchableOpacity 
              style={styles.addressRow}
              onPress={() => setShowLocations(!showLocations)}
            >
              <Ionicons name="location-sharp" size={18} color="#283593" />
              <Text style={styles.addressText}>{selectedLocation}</Text>
              <Ionicons 
                name={showLocations ? "chevron-up" : "chevron-down"} 
                size={18} 
                color="#3B82F6" 
              />
            </TouchableOpacity>

            {showLocations && (
              <View style={styles.locationDropdown}>
                {locations.map((location, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.locationItem}
                    onPress={() => {
                      setSelectedLocation(location);
                      setShowLocations(false);
                    }}
                  >
                    <Text style={styles.locationText}>{location}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Empty Cart View */}
            {cartItems.length === 0 && (
              <View style={styles.emptyCartContainer}>
                <View style={styles.emptyCartCard}>
                  <Image source={require("../../assets/cart_man.png")} style={styles.emptyCartImage} />
                  <Text style={styles.emptyCartTitle}>Your cart is empty</Text>
                  <Text style={styles.emptyCartSubtitle}>
                    Looks like you haven't add any items to the cart
                  </Text>
                  <TouchableOpacity
                    style={styles.exploreButton}
                    onPress={() => navigation.goBack()}
                  >
                    <Text style={styles.exploreButtonText}>Explore Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Cart items display */}
            {cartItems.length > 0 && (
              <View style={styles.cartItemBox}>
                {cartItems.map((item) => (
                  <View key={item._id} style={styles.cartCard}>
                    <View style={styles.cardImageBox}>
                      <Image
                        source={require("../../assets/wheat.png")}
                        style={styles.cartImage}
                        resizeMode="cover"
                      />
                    </View>
                    <View style={styles.productDetailsContainer}>
                      <Text style={styles.cartName} numberOfLines={1}>
                        {item.product.name.en}
                        
                      </Text>
                      <Text style={styles.productDesc} numberOfLines={1}>
                      {item.varient}  
                      </Text>
                      <Text style={styles.priceText}>
                        {item.product.price} QAR
                      </Text>

                      <View style={styles.quantityControl}>
                        <TouchableOpacity
                          onPress={() => handleUpdateQuantity(item.product._id, -1)}
                        >
                          <MaterialIcons name="remove-circle-outline" size={24} color="#666" />
                        </TouchableOpacity>
                        
                      <TextInput
  style={{
    borderWidth: 1,
    borderColor: "#ccc",
    width: 50,
    textAlign: "center",
    marginHorizontal: 8,
    padding: 4,
    borderRadius: 6,
  }}
  keyboardType="numeric"
  value={
    editingQuantities[item.product._id] !== undefined
      ? editingQuantities[item.product._id]
      : item.quantity.toString()
  }
  onChangeText={(text) => {
    // Allow only digits
    if (/^\d*$/.test(text)) {
      setEditingQuantities((prev) => ({
        ...prev,
        [item.product._id]: text,
      }));
    }
  }}
  onBlur={() => {
    const rawValue = editingQuantities[item.product._id];
    const parsedQuantity = parseInt(rawValue || "", 10);

    if (isNaN(parsedQuantity) || parsedQuantity < 1) {
      Alert.alert("Invalid Quantity", "Please enter a quantity of at least 1.");
      setEditingQuantities((prev) => ({
        ...prev,
        [item.product._id]: item.quantity.toString(), // reset to old value
      }));
      return;
    }

    if (parsedQuantity > item.product.stock) {
      Alert.alert(
        "Stock Limit",
        `Only ${item.product.stock} items available.`
      );
      setEditingQuantities((prev) => ({
        ...prev,
        [item.product._id]: item.product.stock.toString(),
      }));
      return;
    }

    // Update cart quantity
    setCartItems((prevItems) =>
      prevItems.map((cartItem) =>
        cartItem.product._id === item.product._id
          ? { ...cartItem, quantity: parsedQuantity }
          : cartItem
      )
    );

    // Remove temporary edit state
    setEditingQuantities((prev) => {
      const updated = { ...prev };
      delete updated[item.product._id];
      return updated;
    });
  }}
/>


                        
                        <TouchableOpacity
                          onPress={() => handleUpdateQuantity(item.product._id, 1)}
                        >
                          <MaterialIcons name="add-circle-outline" size={24} color="#666" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    
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
                ))}
                <View style={styles.cartItemLine}></View>
              </View>
            )}
          </ScrollView>
        </View>
       
        {cartItems.length > 0 && ( 
          <View style={styles.checkoutBtnUltraWrapper}>
            <TouchableOpacity
              style={styles.checkoutBtnUltra}
              onPress={handlecheckout}
            >
              <Text style={styles.checkoutText}>Check out</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <Modal
  animationType="fade"
  transparent={true}
  visible={deletemodal}
  onRequestClose={() => {
    setdeletemodal(false);
    setProductToDeleteId(null);
  }}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <View style={styles.modalDip} />

      <View style={styles.trashIconContainer}>
        <Ionicons name="trash" size={wp("6%")} color="#f87171" />
      </View>

      <Text style={styles.modalTitle}>Are you sure to delete?</Text>

      <View style={styles.modalButtons}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => {
            setdeletemodal(false);
            setProductToDeleteId(null);
          }}
        >
          <Text style={styles.cancelText}>No, keep it</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.confirmBtn}
          onPress={handleRemoveFromCart}
        >
          <Text style={styles.confirmText}>Yes, delete</Text>
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
    backgroundColor: "#F5F6FC",
  },
  container: {
    flex: 1,
    paddingHorizontal: wp("4%"),
    backgroundColor: "#F5F6FC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    marginTop: hp("2.5%"),
    fontSize: wp("5%"),
    fontWeight: "600",
    marginLeft: wp("2%"),
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: wp("2%"),
    padding: wp("3%"),
    marginTop: hp("2%"),
  },
  addressText: {
    marginHorizontal: wp("2%"),
    color: "#283593",
    fontWeight: "500",
    flex: 1,
  },
  cartCard: {
    borderRadius: wp("4%"),
    marginVertical: hp("1%"),
    padding: wp("3%"),
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: wp("2.5%"),
  },
  cartItemBox: {
    height: hp("67%"),
    borderRadius: wp("2%"),
    backgroundColor: "#fff",
    marginTop: hp("1.5%"),
    flex: 1,
    alignItems: "center"
  },
  cartItemLine: {
    borderWidth: 1,
    borderColor: "#e8e8e8",
    width: wp("80%")
  },
  cartImage: {
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: wp("2%"),
    backgroundColor: "#f4f4f4",
  },
  cardImageBox: {
    padding: wp("2%"),
    backgroundColor: "#fff",
    marginRight: wp("2.5%"),
    borderRadius: wp("2%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  productDetailsContainer: {
    flex: 1,
    paddingVertical: hp("1%"),
  },
  cartName: {
    justifyContent: "space-between",
    fontSize: wp("3.5%"),
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginRight: wp("3%"),
  },
  productDesc: {

    fontSize: wp("3.5%"),
    color: '#666',
    
  },
  priceText: {
    fontSize: wp("4%"),
    fontWeight: 'bold',
    color: '#2A3B8F',
  
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    columnGap: wp("5%"),
    marginTop: hp("0.5%"),
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: wp("2%"),
    paddingVertical: hp("0.5%"),
    paddingHorizontal: wp("2%"),
    fontSize: wp("4%"),
    fontWeight: '500',
    color: '#333',
    minWidth: wp("12%"),
    textAlign: 'center',
  },
  deleteBtn: {
    padding: wp("1%"),
    backgroundColor: "#fee0e3",
    borderRadius: 50
  },
  checkoutBtnUltraWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: hp("2%"),
    paddingHorizontal: wp("4%"),
    paddingTop: hp("1%"),
    paddingBottom: hp("1%"),
    zIndex: 10,
  },
  checkoutBtnUltra: {
    backgroundColor: "#283593",
    paddingVertical: hp("2%"),
    borderRadius: wp("3%"),
    alignItems: "center",
  },
  checkoutText: {
    color: "#fff",
    fontSize: wp("4.2%"),
    fontWeight: "bold",
  },
  locationContainer: {
    position: 'relative',
    zIndex: 1,
  },
  locationDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: wp("2%"),
    marginTop: hp("0.5%"),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 2,
  },
  locationItem: {
    padding: wp("4%"),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  locationText: {
    fontSize: wp("4%"),
    color: '#333',
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp("5%"),
    paddingHorizontal: wp("4%"),
  },
  emptyCartCard: {
    backgroundColor: "#fff",
    borderRadius: wp("5%"),
    paddingVertical: hp("5%"),
    paddingHorizontal: wp("5%"),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
  },
  emptyCartImage: {
    width: wp("70%"),
    height: hp("25%"),
    resizeMode: "contain",
    marginBottom: hp("2%"),
  },
  emptyCartTitle: {
    fontSize: wp("5%"),
    fontWeight: "bold",
    color: "#333",
    marginBottom: hp("1%"),
  },
  emptyCartSubtitle: {
    fontSize: wp("4%"),
    color: "#666",
    textAlign: "center",
    marginBottom: hp("3%"),
    paddingHorizontal: wp("5%"),
  },
  exploreButton: {
    backgroundColor: "#283593",
    paddingVertical: hp("1.5%"),
    borderRadius: wp("3%"),
    paddingHorizontal: wp("20%"),
    width: "100%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  exploreButtonText: {
    color: "#fff",
    fontSize: wp("4.2%"),
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
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
    overflow: 'visible',
  },
  modalDip: {
    position: 'absolute',
    top: -wp("12%"),
    left: wp("25%"),
    right: wp("50%"),
    width: wp("34%"),
    height: wp("34%"),
    borderRadius: wp("20%"),
    backgroundColor: "white",
  },
  trashIconContainer: {
    position: "absolute",
    top: -wp("10%"),
    width: wp("16%"),
    height: wp("16%"),
    borderRadius: wp("8%"),
    backgroundColor: "#FFEBEE",
    borderWidth: 2,
    borderColor: "#EF4444",
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
  modalTitle: {
    fontSize: wp("4.5%"),
    fontWeight: "600",
    textAlign: "center",
    marginBottom: hp("3%"),
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
    backgroundColor: "#EF4444",
    paddingVertical: hp("1.8%"),
    borderRadius: wp("2.5%"),
    alignItems: "center",
    marginBottom: hp("1.2%"),
  },
  cancelText: {
    color: "white",
    fontWeight: "600",
    fontSize: wp("4%"),
  },
  confirmBtn: {
    backgroundColor: "#E5E7EB",
    paddingVertical: hp("1.8%"),
    borderRadius: wp("2.5%"),
    alignItems: "center",
  },
  confirmBtnDisabled: {
    backgroundColor: "#FCA5A5",
  },
  confirmText: {
    color: "#374151",
    fontWeight: "600",
    fontSize: wp("4%"),
  },
});
