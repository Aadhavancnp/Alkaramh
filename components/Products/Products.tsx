import React, { useState, useEffect, useContext } from 'react'; // Import useContext
import { View, StyleSheet, Text, TouchableOpacity, TextInput, ScrollView, FlatList, Image, Alert } from 'react-native';
import Footer from '../../Utils/Footer/Footer';
import AuthContext from '../../context/AuthContext'; // Import AuthContext
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Ionicons } from '@expo/vector-icons';

const Products = () => {
  const [selectedTab, setSelectedTab] = useState<string>("All products");
  const [allProducts, setAllProducts] = useState<any[]>([]); // To store all fetched products
  const [products, setProducts] = useState<any[]>([]); // For displayed/filtered products
  const [searchQuery, setSearchQuery] = useState<string>(""); // For search input

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Wishlist states
  const [wishlistedItems, setWishlistedItems] = useState<Set<string>>(new Set());
  const [wishlistLoadingProductId, setWishlistLoadingProductId] = useState<string | null>(null);

  const authContext = useContext(AuthContext);
  const { user, token } = authContext || {};


  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null); // Clear previous errors
      try {
        const response = await fetch('http://localhost:3000/api/products');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAllProducts(data); // Store all fetched products
        // setProducts(data); // Initially display all products, will be handled by combined filter effect
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Combined effect for filtering based on selectedTab and searchQuery
  useEffect(() => {
    let tempFilteredProducts = [...allProducts];

    // Category Filtering
    if (selectedTab !== "All products") {
      tempFilteredProducts = tempFilteredProducts.filter(
        (product) => product.category === selectedTab // Assuming product.category exists
      );
    }

    // Search Filtering
    if (searchQuery.trim() !== "") {
      tempFilteredProducts = tempFilteredProducts.filter((product) =>
        product.name.en.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setProducts(tempFilteredProducts);
  }, [allProducts, selectedTab, searchQuery]);


  const handleAddToWishlist = async (productId: string) => {
    if (!user || !token) {
      Alert.alert("Authentication Error", "Please login to add items to your wishlist.");
      return;
    }
    if (wishlistedItems.has(productId)) {
      Alert.alert("Info", "This item is already in your wishlist.");
      return;
    }

    setWishlistLoadingProductId(productId);

    try {
      const response = await fetch('http://localhost:3000/api/wishlist/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user._id,
          productId: productId,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to add to wishlist.");
      }

      setWishlistedItems(prev => new Set(prev).add(productId));
      Alert.alert("Success", responseData.message || "Added to wishlist!");

    } catch (err: any) {
      // Handle error, e.g., show an alert or set a specific error state
      Alert.alert("Wishlist Error", err.message || "Could not add to wishlist.");
    } finally {
      setWishlistLoadingProductId(null);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: hp("10%") }}>
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

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsContainer}
        >
          {[
            "All products",
            "Aala Feed",
            "Alfalfa",
            "Corn",
            "Date",
            "all is well",
            "good",
          ].map((tab, index) => (
            <Text
              key={index}
              onPress={() => setSelectedTab(tab)}
              style={[styles.tab, selectedTab === tab && styles.activeTab]}
            >
              {tab}
            </Text>
          ))}
        </ScrollView>

        <View style={styles.productList}>
          <Text style={styles.selectedTabText}>
            <Text style={{ fontWeight: "bold" }}>{selectedTab}</Text>
          </Text>

          {loading && <Text>Loading products...</Text>}
          {error && <Text>Error fetching products: {error}</Text>}
          {!loading && !error && products.map((item) => {
            const isCurrentItemWishlisted = wishlistedItems.has(item._id);
            return (
            <View key={item._id} style={styles.productCard}>
              <View style={styles.imageContainer}>
                <Image source={{ uri: item.image[0] }} style={styles.productImage} />
                <TouchableOpacity 
                  style={styles.heartButton} // Added style for better touch area
                  onPress={() => handleAddToWishlist(item._id)} 
                  disabled={wishlistLoadingProductId === item._id}
                >
                  <Ionicons 
                    name={isCurrentItemWishlisted ? "heart" : "heart-outline"} 
                    size={24} // Slightly increased size
                    color={isCurrentItemWishlisted ? "red" : "#888"} // Adjusted default color
                    style={styles.heartIcon} // Renamed from styles.heart for clarity
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name.en}</Text>
                {/* Assuming rating and reviews are not available from backend for now */}
                {/* <Text style={styles.productRating}>★★★★☆ ({item.reviews})</Text> */}
                <Text style={styles.productPrice}>{item.price} QAR</Text>
                <Text style={styles.productDesc}>
                  Al Karamh is renowned for its high-quality products.
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
    marginTop:hp("5%"),
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
    borderRadius: 10,
    elevation: 1,
    padding: 10,
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
  heartIcon: { // New style for just the icon, if needed, or merge with heartButton
    // No specific styles needed here if heartButton handles positioning and padding
  },
});
