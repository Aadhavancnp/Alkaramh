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

const Products = () => {
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
          <Ionicons name="chevron-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Al Karamh Trading</Text>
        <View style={styles.ratingBox}>
          <Text style={styles.ratingText}>4.8 ★</Text>
        </View>
      </View>

      <Text style={styles.subtext}>120 - 150 mins</Text>

      <View style={styles.badgeContainer}>
        <View style={styles.badge}>
          <Text>Last 100 Orders Without Complaints</Text>
        </View>
        <View style={styles.badge}>
          <Text>Bestseller</Text>
        </View>
        <View style={styles.badge}>
          <Text>Frequently Reordered</Text>
        </View>
      </View>
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="gray" />
        <TextInput
          placeholder="Search products here..."
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.productList}>
          {loading && <Text>Loading products...</Text>}
          {error && <Text>Error fetching products: {error}</Text>}
          {!loading &&
            !error &&
            products.map((item) => {
              const isCurrentItemWishlisted = wishlistedItems.has(item._id);
              return (
                <View key={item._id} style={styles.ultraProductCard}>
                  <View style={styles.ultraImageContainer}>
                    <Image
                      source={{ uri: item.image[0] }}
                      style={styles.ultraProductImage}
                      resizeMode="cover"
                    />
                    <TouchableOpacity
                      style={styles.ultraHeart}
                      onPress={() => handleAddToWishlist(item._id)}
                      disabled={wishlistLoadingProductId === item._id}
                    >
                      <Ionicons
                        name={
                          isCurrentItemWishlisted ? "heart" : "heart-outline"
                        }
                        size={28}
                        color={isCurrentItemWishlisted ? "#e53935" : "#bbb"}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.ultraProductInfo}>
                    <Text style={styles.ultraProductName} numberOfLines={1}>
                      {item.name.en}
                    </Text>
                    <View style={styles.ultraRow}>
                      <Ionicons name="pricetag" size={18} color="#2A3B8F" />
                      <Text style={styles.ultraProductPrice}>
                        {item.price} QAR
                      </Text>
                    </View>
                    <View style={styles.ultraRow}>
                      <Ionicons name="cube-outline" size={16} color="#888" />
                      <Text style={styles.ultraProductCategory}>
                        {item.category}
                      </Text>
                    </View>
                    <View style={styles.ultraRow}>
                      <Ionicons name="star" size={16} color="#f5c518" />
                      <Text style={styles.ultraProductRating}>4.8</Text>
                      <Text style={styles.ultraProductStock}>
                        • Stock: {item.stock ?? "N/A"}
                      </Text>
                    </View>
                    <Text style={styles.ultraProductDesc} numberOfLines={2}>
                      {item.description?.en ||
                        "Al Karamh is renowned for its high-quality products."}
                    </Text>
                  </View>
                </View>
              );
            })}
        </View>
      </ScrollView>
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
    marginTop: hp("3%"),
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
    backgroundColor: "#2ECC71",
    borderRadius: 5,
    padding: 5,
  },
  ratingText: {
    color: "white",
    fontWeight: "bold",
  },
  subtext: {
    marginLeft: wp("5%"),
    color: "gray",
    marginTop: hp("0.5%"),
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
  },
  badgeText: {
    fontSize: 12,
    color: "#333",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F4F4",
    borderRadius: 10,
    marginHorizontal: wp("5%"),
    padding: 5,
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
  },
  tabsContainer: {
    marginVertical: hp("2%"),
    paddingHorizontal: wp("5%"),
    paddingTop: hp("1%"),
    paddingBottom: hp("2%"),
    backgroundColor: "#ffffffd8",
    width: wp("94%"),
  },
  tab: {
    marginRight: 20,
    color: "#555",
  },
  activeTab: {
    fontWeight: "bold",
    borderBottomWidth: 2,
    borderColor: "#007bff",
    paddingBottom: 2,
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
});
