import { Cartstyles as styles } from './CartStyleSheet';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { EmptyCart } from './EmptyCart';
import { API_URL } from '../../api.json';

interface Product {
  _id: string;
  name: { en: string; ar?: string };
  description: { en: string; ar?: string };
  price: number;
  image: string[];
  stock: number;
}

interface CartItem {
  _id: string;
  product: Product;
  varient?: string;
  priceFromRoute: number;
}

const Cart = () => {
  const navigation: any = useNavigation();
  const route: any = useRoute();
  const [deletemodal, setdeletemodal] = useState<boolean>(false);
  const [showLocations, setShowLocations] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<string>("Abu Nakhlah, Qatar...");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const locations = [
    "Abu Nakhlah, Qatar",
    "Al Hilal, Qatar",
    "Al Sadd, Qatar",
    "West Bay, Qatar",
    "Pearl Qatar",
    "Lusail, Qatar"
  ];

  useEffect(() => {
    const { productId, varient, price } = route?.params || {};
    console.log(productId,varient,price)
    if (productId) {
      fetch(`${API_URL}/products/${productId}`)
        .then((res) => res.json())
        .then((data) => {
          const cartItem: CartItem = {
            _id: `cart-${data._id}`,
            product: {
              _id: data._id,
              name: data.name,
              description: data.description,
              price: data.price,
              image: data.image,
              stock: data.stock,
            },
            varient: varient || "default",
            priceFromRoute: price || data.price,
          };
          setCartItems([cartItem]);
        })
        .catch((error) => {
          console.error("Error fetching product:", error);
          setCartItems([]);
        });
    } else {
      setCartItems([]);
    }
  }, [route.params]);

  const [productToDeleteId, setProductToDeleteId] = useState<string | null>(null);

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

  const handlecheckout = () => {
    navigation.navigate("Checkout", { cartItems });
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
            {cartItems.length === 0 ? (
              <EmptyCart/>
            ) : (
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
                        {item.priceFromRoute} QAR
                      </Text>
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
              <Ionicons name="trash" size={wp("6%") } color="#f87171" />
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