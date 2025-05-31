import { Ionicons } from "@expo/vector-icons";
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
import AuthContext from "../../context/AuthContext"; // Import AuthContext
import {  useRoute } from "@react-navigation/native";

type Variant = "10kg" | "20kg" | "30kg";
type Quantity = 10 | 20 | 30 | 40; // Keep for now

interface Product {
  _id: string;
  name: { en: string; ar?: string };
  description: { en: string; ar?: string };
  price: number;
  image: string[];
  // Add other fields if necessary, like variants, stock, etc.
  category?: string; // Optional, if needed
  stock?: number; // Optional, if needed
  rating?: number; // Optional, if needed
  
}

const ProductDetails: React.FC = () => {
  // Assume productId is passed as a prop or from route params
  // const productId = '65ca9bf20357795719945494'; // Placeholder ID
  const route = useRoute();
  const productId = route.params?.productId || ''; // Get productId from route params

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedVariant, setSelectedVariant] = useState<Variant>("10kg");
  const [selectedQuantity, setSelectedQuantity] = useState<Quantity | null>(null);
  const [customQuantity, setCustomQuantity] = useState<string>("");

  // State for Wishlist
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [wishlistLoading, setWishlistLoading] = useState<boolean>(false);
  const [wishlistError, setWishlistError] = useState<string | null>(null);

  const authContext = useContext(AuthContext);
  const { user, token } = authContext || {};


  useEffect(() => {
    if (!productId) {
      setError("Product ID is missing.");
      setLoading(false);
      return;
    }

    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://alkarmah-backend.onrender.com/api/products/${productId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProduct(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleAddToWishlist = async () => {
    if (!user || !token) {
      Alert.alert("Authentication Error", "You need to be logged in to add items to your wishlist.");
      setWishlistError("User not authenticated.");
      return;
    }
    if (!product || !product._id) {
      Alert.alert("Error", "Product details not available.");
      return;
    }
    if (isWishlisted) {
      Alert.alert("Info", "This item is already in your wishlist.");
      return;
    }

    setWishlistLoading(true);
    setWishlistError(null);

    try {
      const response = await fetch('https://alkarmah-backend.onrender.com/api/wishlist/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user._id,
          productId: product._id,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to add to wishlist.");
      }

      setIsWishlisted(true);
      Alert.alert("Success", responseData.message || "Added to wishlist!");

    } catch (err: any) {
      setWishlistError(err.message);
      Alert.alert("Wishlist Error", err.message || "Could not add to wishlist.");
    } finally {
      setWishlistLoading(false);
    }
  };

  if (loading) {
    return <View style={styles.centered}><Text>Loading product details...</Text></View>;
  }

  if (error) {
    return <View style={styles.centered}><Text>Error: {error}</Text></View>;
  }

  if (!product) {
    return <View style={styles.centered}><Text>Product not found.</Text></View>;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Product Image */}
      <Image
        source={{ uri: product.image && product.image.length > 0 ? product.image[0] : "https://via.placeholder.com/300" }}
        style={styles.productImage}
        resizeMode="contain"
      />

      {/* Product Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{product.name.en}</Text>
        <TouchableOpacity onPress={handleAddToWishlist} disabled={wishlistLoading}>
          <Ionicons
            name={isWishlisted ? "heart" : "heart-outline"}
            size={wp("6%")}
            color={isWishlisted ? "red" : "#666"}
          />
        </TouchableOpacity>
      </View>
      
      {wishlistError && <Text style={styles.wishlistErrorText}>{wishlistError}</Text>}

      {/* Rating - Assuming not available from backend for now */}
      <View style={styles.ratingContainer}>
        <Ionicons name="star" size={wp("4.5%")} color="#f5c518" />
        <Text style={styles.ratingText}>N/A</Text>
        <Text style={styles.reviewText}>(No reviews yet)</Text>
      </View>

      {/* Price */}
      <Text style={styles.priceText}>{product.price} QAR</Text>

      {/* Variants - Keep existing UI for now, will need backend integration later */}
      <View style={styles.variantsContainer}>
        <TouchableOpacity
          style={[
            styles.variantButton,
            selectedVariant === "10kg" && styles.variantSelected,
          ]}
          onPress={() => setSelectedVariant("10kg")}
        >
          <Text style={styles.variantText}>10 kg</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.variantButtonDisabled]}>
          <Text style={styles.variantTextDisabled}>20 kg</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.variantButtonDisabled]}>
          <Text style={styles.variantTextDisabled}>30 kg</Text>
        </TouchableOpacity>
      </View>

      {/* Description */}
      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.descriptionText}>
        {product.description.en}
      </Text>

      {/* Choose Quantity - Keep existing UI for now, will need backend integration later */}
      <Text style={styles.sectionTitle}>Choose Quantity</Text>
      <View style={styles.quantityContainer}>
        {[10, 20, 30, 40].map((qty) => (
          <TouchableOpacity
            key={qty}
            style={[
              styles.quantityButton,
              selectedQuantity === qty && styles.quantitySelected,
            ]}
            onPress={() => setSelectedQuantity(qty as Quantity)}
          >
            <Text style={styles.quantityText}>{qty}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Custom Quantity */}
      <TextInput
        placeholder="Custom"
        keyboardType="numeric"
        value={customQuantity}
        onChangeText={(text) => setCustomQuantity(text)}
        style={styles.customInput}
      />

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.addToCartButton}>
          <Text style={styles.buttonText}>Add to cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyNowButton}>
          <Text style={styles.buttonText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: wp("5%"),
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp("5%"),
  },
  wishlistErrorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: hp("1%"),
  },
  productImage: {
    width: "100%",
    height: hp("30%"),
    marginBottom: hp("2%"),
    borderRadius: wp("2%"),
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: wp("5%"),
    fontWeight: "bold",
    color: "#333",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp("1%"),
  },
  ratingText: {
    marginLeft: wp("1%"),
    fontSize: wp("4%"),
    fontWeight: "600",
    color: "#333",
  },
  reviewText: {
    marginLeft: wp("2%"),
    fontSize: wp("3.5%"),
    color: "#777",
  },
  priceText: {
    marginTop: hp("1%"),
    fontSize: wp("5%"),
    fontWeight: "bold",
    color: "#373fd4",
  },
  variantsContainer: {
    flexDirection: "row",
    marginTop: hp("2%"),
    gap: wp("2%"),
  },
  variantButton: {
    paddingVertical: hp("1%"),
    paddingHorizontal: wp("5%"),
    backgroundColor: "#f0f0f0",
    borderRadius: wp("2%"),
  },
  variantSelected: {
    backgroundColor: "#373fd4",
  },
  variantText: {
    fontSize: wp("4%"),
    color: "#333",
  },
  variantButtonDisabled: {
    paddingVertical: hp("1%"),
    paddingHorizontal: wp("5%"),
    backgroundColor: "#e0e0e0",
    borderRadius: wp("2%"),
  },
  variantTextDisabled: {
    fontSize: wp("4%"),
    color: "#aaa",
  },
  sectionTitle: {
    marginTop: hp("3%"),
    fontSize: wp("4.5%"),
    fontWeight: "bold",
    color: "#333",
  },
  descriptionText: {
    marginTop: hp("1%"),
    fontSize: wp("3.8%"),
    color: "#666",
  },
  quantityContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: hp("2%"),
    gap: wp("2%"),
  },
  quantityButton: {
    width: wp("15%"),
    height: hp("5%"),
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: wp("2%"),
    alignItems: "center",
    justifyContent: "center",
  },
  quantitySelected: {
    backgroundColor: "#373fd4",
    borderColor: "#373fd4",
  },
  quantityText: {
    fontSize: wp("4%"),
    color: "#333",
  },
  customInput: {
    marginTop: hp("2%"),
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: wp("2%"),
    padding: wp("3%"),
    fontSize: wp("4%"),
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp("4%"),
  },
  addToCartButton: {
    flex: 1,
    marginRight: wp("2%"),
    backgroundColor: "#fff",
    borderColor: "#373fd4",
    borderWidth: 1,
    paddingVertical: hp("1.5%"),
    borderRadius: wp("2%"),
    alignItems: "center",
  },
  buyNowButton: {
    flex: 1,
    marginLeft: wp("2%"),
    backgroundColor: "#373fd4",
    paddingVertical: hp("1.5%"),
    borderRadius: wp("2%"),
    alignItems: "center",
  },
  buttonText: {
    fontSize: wp("4%"),
    fontWeight: "bold",
    color: "#000000",
  },
});
