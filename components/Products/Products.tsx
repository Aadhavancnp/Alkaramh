import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react"; // Import useContext
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Footer from "../../Utils/Footer/Footer";
import apiConfig from "../../api.json";
import AuthContext from "../../context/AuthContext"; // Import AuthContext
import ListProduct from "./listproduct";
import { useNavigation } from "expo-router";

const Products = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Wishlist states
  const [wishlistedItems, setWishlistedItems] = useState<Set<string>>(
    new Set()
  );
  const [wishlistLoadingProductId, setWishlistLoadingProductId] = useState<
    string | null
  >(null);

  const authContext = useContext(AuthContext);
  const { user, token } = authContext || {};

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let data;
        if (route.params?.category) {
          const response = await axios.post(
            `${apiConfig.API_URL}/categories/products`,
            { category: route.params.category }
          );
          if (response.data && response.data.data) {
            data = response.data.data;
          } else {
            throw new Error("Invalid response from server");
          }
        } else {
          const response = await axios.get(`${apiConfig.API_URL}/products`);
          if (response.data && response.data.data) {
            data = response.data.data;
          } else {
            throw new Error("Invalid response from server");
          }
        }
        setAllProducts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [route.params?.category]);

  // Only filter by search query now
  useEffect(() => {
    let tempFilteredProducts = [...allProducts];
    if (searchQuery.trim() !== "") {
      tempFilteredProducts = tempFilteredProducts.filter((product) =>
        product.name.en.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setProducts(tempFilteredProducts);
  }, [allProducts, searchQuery]);

  const handleAddToWishlist = async (productId: string) => {
    if (!user || !token) {
      Alert.alert(
        "Authentication Error",
        "Please login to add items to your wishlist."
      );
      return;
    }
    if (wishlistedItems.has(productId)) {
      Alert.alert("Info", "This item is already in your wishlist.");
      return;
    }

    setWishlistLoadingProductId(productId);

    try {
      const response = await fetch(
        "https://alkarmah-backend.onrender.com/api/wishlist/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: user._id,
            productId: productId,
          }),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to add to wishlist.");
      }

      setWishlistedItems((prev) => new Set(prev).add(productId));
      Alert.alert("Success", responseData.message || "Added to wishlist!");
    } catch (err: any) {
      // Handle error, e.g., show an alert or set a specific error state
      Alert.alert(
        "Wishlist Error",
        err.message || "Could not add to wishlist."
      );
    } finally {
      setWishlistLoadingProductId(null);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={24} onPress={() => navigation.goBack()}/>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Al Karamh Trading</Text>
        <View style={styles.ratingBox}>
          <Text style={styles.ratingText}>4.8 ★</Text>
        </View>
        <Text style={styles.ratingText2}> 5k Ratings</Text>
      </View>
            
     <View style={styles.timeContainer}>
  <Ionicons name="time-outline" size={16} color="#666" style={{ marginRight: 5 }} />
  <Text style={styles.subtext}>120 - 150 mins</Text>
</View>

      <View style={styles.badgeContainer}>
        <View style={styles.badge}>
          <Ionicons name="checkmark" size={16} color="#4CAF50" />
          <Text style={styles.badgeText}> Last 100 Orders Without Complaints</Text>
        </View>
        <View style={styles.badge}>
          <Ionicons name="checkmark" size={16} color="#4CAF50" />
          <Text style={styles.badgeText}> Bestseller</Text>
        </View>
        <View style={styles.badge}>
          <Ionicons name="checkmark" size={16} color="#4CAF50" />
          <Text style={styles.badgeText}> Frequently Reordered</Text>
        </View>
      </View>

      <View style={styles.searchheder}>
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="gray" />
        <TextInput
          placeholder="Search products here..."
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

      </View>
      </View>
      <View style={styles.tabsContainers}>
  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingVertical: hp("0%") }}>
  {[
    "All products",
    "Aala Feed",
    "Alfalfa",
    "Corn",
    "Dates",
    "Hay",
    "Hen Feed",
    "Milets",
    "Rodhes",
    "Mineral Salt",
  ].map((category, index) => (
    <Text
      key={index}
      style={[styles.tabs, category === "All products" && styles.activeTabs]}
    >
      {category}
    </Text>
  ))}
</ScrollView>

      </View>
      <Text style={{ fontSize: 20, fontWeight: "bold", margin: 16 }}>All Products</Text>
      <ScrollView style={styles.productList}>
        {products.map((product) => (
          <View key={product._id} style={styles.productCard}>
            <Image source={{ uri: product.image }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productRating}>{product.rating} ★</Text>
              <Text style={styles.productPrice}>${product.price}</Text>
              <Text style={styles.productDesc}>{product.description}</Text>
            </View>
              
          </View>
        ))}
      </ScrollView>
      <ListProduct/>
      <View style={{ height: hp("7%") }} />

      <Footer />
    </View>
  );
};

export default Products;

const styles = StyleSheet.create({
  container: {
    marginTop: hp("5%"),
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp("8%"),
    marginHorizontal: wp("3%"),
  },
  selectedTabText: {
    fontSize: 20,
    marginBottom: hp("2%"),
    color: "#333",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    marginLeft: wp("1%"),
  },
  ratingBox: {
    backgroundColor: "#156739",
    borderRadius: 5,
    padding: 5,
    left: wp("12%"),
    color: "#6D7079",
  },
  ratingText: {
    color: "white",
    fontWeight: "bold",
  }
  ,
   ratingText2: {
    fontSize: 8,
    top: hp("2.5%"),
  },
  clockicon: {
    top: hp("2.3%"),
    left: wp("5%"),
  },
 subtext: {
  fontSize: 14,
  color: "gray",
},
  badgeText:{
   fontSize: 12,
   color:"#6D717C"
  },
  badgeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    margin: wp("5%"),
  },
  badge: {
    backgroundColor: "#F1F1F1",
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 8,
    flexDirection: "row",
  },
 
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    borderRadius: 10,
    marginHorizontal: wp("2%"),
    paddingVertical:wp('4%') ,
    paddingHorizontal: wp("4%"),
    borderWidth: .5,
    borderColor: "#C0C0C0",
  },
  searchInput: {
    backgroundColor: "#FFFFF",
    marginLeft: 10,
    flex: 1,
  
  },
  tabsContainers: {
    marginVertical: hp("2%"),
    paddingHorizontal: wp("5%"),
       
    backgroundColor: "#ffffffd8",
    width: wp("94%"),
  },
  tabs: {
    marginRight: 20,
    color: "#555",
  },
  activeTabs: {
    fontWeight: "bold",
    borderBottomWidth: 2,
    borderColor: "#007bff",
    paddingBottom: hp("2%"),
  },
  productList: {
    paddingHorizontal: wp("5%"),
    
  },
  
  productCard: {
    flexDirection: "row",
    marginBottom: hp("2%"),
    backgroundColor: "#fff",
    borderRadius: 16,
    elevation: 4,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  productImage: {
    width: 80,
    height: 70,
    borderRadius: 8,
    marginRight: 10,
  },
  imageContainer: {
    position: "relative",
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  productRating: {
    fontSize: 12,
    color: "#b0aa05",
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    marginVertical: 2,
  },
  productDesc: {
    fontSize: 12,
    color: "#666",
  },
  searchheder:{

    color:"#F3F4F8",
    backgroundColor:"#F3F4F8",
    paddingVertical: hp("2%"),
    paddingHorizontal: wp("2%"),
  },
  heart: {
    position: "absolute",
    top: hp("1.1%"),
    right: wp("6%"),
    zIndex: 1,
    padding: 5, // Added padding to make it easier to press
  },
  heartIcon: {
    // New style for just the icon, if needed, or merge with heartButton
    // No specific styles needed here if heartButton handles positioning and padding
  },
  ultraProductCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    marginBottom: hp("2.5%"),
    marginTop: hp("2%"),
    marginHorizontal: wp("0%"),
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    padding: 0,
    width: "100%",
    alignSelf: "center",
    overflow: "hidden",
  },
  ultraImageContainer: {
    width: "100%",
    height: hp("22%"),
    backgroundColor: "#f4f4f4",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  ultraProductImage: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  ultraHeart: {
    position: "absolute",
    top: 12,
    right: 16,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  ultraProductInfo: {
    padding: 16,
  },
  ultraProductName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 4,
  },
  ultraRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
    gap: 6,
  },
  ultraProductPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2A3B8F",
    marginLeft: 6,
  },
  ultraProductCategory: {
    fontSize: 13,
    color: "#888",
    marginLeft: 6,
  },
  ultraProductRating: {
    fontSize: 13,
    color: "#f5c518",
    marginLeft: 6,
    fontWeight: "bold",
  },
  ultraProductStock: {
    fontSize: 13,
    color: "#888",
    marginLeft: 8,
  },
  ultraProductDesc: {
    fontSize: 13,
    color: "#666",
    marginTop: 6,
  },
  timeContainer: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: hp("2%"),
  marginLeft: wp("5%"),
},


});