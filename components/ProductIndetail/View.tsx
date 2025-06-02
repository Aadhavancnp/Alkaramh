import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RouteProp, useRoute } from "@react-navigation/native";
import axios from "axios";
import * as React from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import apiConfig from "../../api.json";

type Variant = "10kg" | "20kg" | "30kg";

interface Product {
  _id: string;
  name?: { en: string; ar?: string };
  title?: string;
  description?: { en: string; ar?: string } | string;
  price: number;
  image: string[] | string;
  category?: string;
  stock?: number;
  rating?: number;
}

type ProductDetailsRouteParams = {
  product: Product | Product[];
};
const VARIANTS: Variant[] = ["10kg", "20kg", "30kg"];

const ProductDetails: React.FC = () => {
  const route =
    useRoute<RouteProp<{ params: ProductDetailsRouteParams }, "params">>();
  // Support array or single product
  const productParam = route.params?.product;
  const product = Array.isArray(productParam) ? productParam[0] : productParam;
  console.log(
    "ProductDetailsRouteParams",
    JSON.stringify(route.params, null, 2)
  );

  const [selectedVariant, setSelectedVariant] = React.useState<Variant>("10kg");
  const [quantity, setQuantity] = React.useState<string>("1");
  const [lang, setLang] = React.useState<"en" | "ar">("en");
  const [addingToCart, setAddingToCart] = React.useState(false);

  if (!product) {
    return (
      <View style={styles.centered}>
        <Text>No product data available.</Text>
      </View>
    );
  }

  // Support both array and string for image
  const productImage =
    Array.isArray(product.image) && product.image.length > 0
      ? product.image[0]
      : typeof product.image === "string"
      ? product.image
      : "https://via.placeholder.com/300";

  // Support both name/title and description structures, with language toggle
  const productTitle =
    (typeof product.name === "object" && product.name?.[lang]) ||
    product.title ||
    "No Title";
  const productDescription =
    typeof product.description === "string"
      ? product.description
      : (product.description?.[lang] as string) ||
        "No description available for this product.";

  // Price fallback
  const productPrice =
    typeof product.price === "number" && !isNaN(product.price)
      ? product.price
      : "N/A";

  const handleAddToCart = async () => {
    setAddingToCart(true);
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        alert("Please login to add items to your cart.");
        setAddingToCart(false);
        return;
      }
      console.log("Data requested for add to cart:", {
        userId,
        productid: product._id,
        quantity: Number(quantity) || 1,
        price: Number(productPrice) * Number(quantity),
      });
      const response = await axios.post(
        `${apiConfig.API_URL}/cart/add`,
        {
          userId,
          productId: product._id,
          quantity: Number(quantity) || 1,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(
        "Add to cart response:",
        JSON.stringify(response.data, null, 2)
      );
      if (response.data && response.data.success) {
        alert(response.data.message || "Added to cart successfully!");
      } else {
        alert(response.data.message || "Failed to add to cart.");
      }
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
          err.message ||
          "An error occurred while adding to cart."
      );
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <ScrollView
              style={styles.container}
              contentContainerStyle={{ paddingBottom: 140 }} // Make room for footer
              keyboardShouldPersistTaps="handled"
            >
              {/* Product Image */}
              <Image
                source={{
                  uri: productImage,
                }}
                style={styles.productImage}
                resizeMode="contain"
              />

              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    lang === "en" && styles.toggleSelected,
                  ]}
                  onPress={() => setLang("en")}
                >
                  <Text
                    style={
                      lang === "en"
                        ? styles.toggleTextSelected
                        : styles.toggleText
                    }
                  >
                    EN
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    lang === "ar" && styles.toggleSelected,
                  ]}
                  onPress={() => setLang("ar")}
                >
                  <Text
                    style={
                      lang === "ar"
                        ? styles.toggleTextSelected
                        : styles.toggleText
                    }
                  >
                    AR
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Product Title */}
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{productTitle}</Text>
                <TouchableOpacity>
                  <Ionicons name="heart-outline" size={24} color="#888" />
                </TouchableOpacity>
              </View>

              {/* Rating and Price */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: hp("1%"),
                }}
              >
                <Ionicons name="star" size={wp("4.5%")} color="#f5c518" />
                <Text style={styles.ratingText}>{product.rating ?? 4.5} ★</Text>
                <Text style={styles.reviewText}>(1.24K Reviews)</Text>
              </View>
              <Text style={styles.priceText}>{productPrice} QAR</Text>

              {/* Variants */}
              <Text style={styles.sectionTitle}>Variants</Text>
              <View style={styles.variantsContainer}>
                {VARIANTS.map((variant) => (
                  <TouchableOpacity
                    key={variant}
                    style={[
                      styles.variantButton,
                      selectedVariant === variant && styles.variantSelected,
                    ]}
                    onPress={() => setSelectedVariant(variant)}
                  >
                    <Text
                      style={[
                        styles.variantText,
                        selectedVariant === variant && { color: "#fff" },
                      ]}
                    >
                      {variant}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Description */}
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.descriptionText}>{productDescription}</Text>

              {/* Quantity */}
              <Text style={styles.sectionTitle}>Choose Quantity</Text>
              <View style={styles.quantityInputContainer}>
                <TextInput
                  style={styles.quantityInput}
                  keyboardType="numeric"
                  value={quantity}
                  onChangeText={setQuantity}
                  placeholder="Enter quantity"
                  maxLength={4}
                  returnKeyType="done"
                />
              </View>
            </ScrollView>
            {/* Footer always visible, not overlapping */}
            <View style={styles.footerFixed}>
              <TouchableOpacity
                style={styles.addToCartButton}
                onPress={handleAddToCart}
                disabled={addingToCart}
              >
                <Text style={styles.buttonText}>
                  {addingToCart ? "Adding..." : "Add to cart"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buyNowButton}>
                <Text style={[styles.buttonText, { color: "#fff" }]}>
                  Buy Now
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: wp("5%"),
  },
  productImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#f5f5f5",
  },
  toggleContainer: {
    flexDirection: "row",
    alignSelf: "flex-end",
    marginBottom: 8,
    marginTop: -8,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 4,
    backgroundColor: "#f0f0f0",
  },
  toggleSelected: {
    backgroundColor: "#373fd4",
  },
  toggleText: {
    color: "#373fd4",
    fontWeight: "bold",
  },
  toggleTextSelected: {
    color: "#fff",
    fontWeight: "bold",
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
    flex: 1,
    marginRight: 8,
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
    marginRight: wp("2%"),
  },
  variantSelected: {
    backgroundColor: "#373fd4",
  },
  variantText: {
    fontSize: wp("4%"),
    color: "#333",
  },
  quantityInputContainer: {
    marginTop: hp("2%"),
    flexDirection: "row",
    alignItems: "center",
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: wp("2%"),
    padding: 10,
    width: wp("30%"),
    fontSize: wp("4%"),
    color: "#333",
    backgroundColor: "#fafafa",
  },
  footerFixed: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    padding: 16,
    justifyContent: "space-between",
    alignItems: "center",
    // Remove any absolute/fixed positioning!
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
