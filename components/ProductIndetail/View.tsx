import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "../../api.json";

const ProductDetails = ({ navigation, route }: any) => {
  const nav = useNavigation();
  const productId = route?.params?.product?.id;

  const variants = ["10 kg", "20 kg", "30 kg"];
  const quantityOptions = ["10", "20", "30", "40"];

  const [product, setProduct] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const [basePrice, setBasePrice] = useState<number | null>(null);
  const [displayPrice, setDisplayPrice] = useState<number>(0);
  const [selectedVariant, setSelectedVariant] = useState(variants[0]);
  const [selectedQuantity, setSelectedQuantity] = useState(quantityOptions[0]);
  const [customModalVisible, setCustomModalVisible] = useState(false);
  const [customQty, setCustomQty] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  const calculatePrice = (variant: string) => {
    if (!basePrice) return 0;
    if (variant === "10 kg") return basePrice;
    if (variant === "20 kg") return basePrice * 2;
    if (variant === "30 kg") return basePrice * 3;
    return basePrice;
  };

  const handleVariantSelect = (variant: string) => {
    setSelectedVariant(variant);
    const updatedPrice = calculatePrice(variant);
    setDisplayPrice(updatedPrice);
  };

  const handleCartNavigation = () => {
    const quantityToUse = customQty || selectedQuantity;
    const data = {
      name: product.data?.name?.en || product.data?.name?.ar || "Unnamed",
      price: displayPrice,
      variant: selectedVariant,
      quantity: quantityToUse,
      image: product.data?.image,
    };
    console.log(data);
    (navigation || nav).navigate("Cart", {
      showEmpty: true,
      product: data,
    });
  };

  const renderStars = (rati: number) => {
    const fullStars = Math.floor(rati);
    const hasHalfStar = rati % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Ionicons key={`full-${i}`} name="star" size={18} color="#FFD700" />);
    }
    if (hasHalfStar) {
      stars.push(<Ionicons key={`half`} name="star-half" size={18} color="#FFD700" />);
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Ionicons key={`empty-${i}`} name="star-outline" size={18} color="#FFD700" />);
    }

    return stars;
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/products/${productId}`);
      const data = await res.json();
      setProduct(data);
      const priceFromApi = parseFloat(data.data?.price || "0");
      setBasePrice(priceFromApi);
      setDisplayPrice(priceFromApi);
    } catch (error) {
      console.error("Failed to fetch product:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      </SafeAreaView>
    );
  }

  const isImageUrl = typeof product.data?.image === "string";

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Ionicons name="chevron-back" size={24} onPress={() => (navigation || nav).goBack()} />
          <Text style={styles.headerTitle}>Product details</Text>
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={isImageUrl ? { uri: product.data.image } : product.data.image}
            style={styles.productImage}
            resizeMode="contain"
          />
          <TouchableOpacity style={styles.shareIcon}>
            <Ionicons name="arrow-redo-outline" size={20} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.productTitle}>
              {product.data?.name?.en || product.data?.name?.ar || "Unnamed"}
            </Text>
            <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={24}
                color={isFavorite ? "red" : "#888"}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.ratingRow}>
            <View style={styles.starRow}>{renderStars(product.data?.rating || 4.5)}</View>
            <Text style={styles.ratingValue}>{product.data?.rating || 4.5}</Text>
            <Text style={styles.ratingCount}>({product.data?.ratingCount || "0 Reviews"})</Text>
          </View>

          <Text style={styles.price}>{displayPrice.toFixed(0)} QAR</Text>

          <Text style={styles.sectionTitle}>Variants</Text>
          <View style={styles.variantRow}>
            {variants.map((variant) => (
              <TouchableOpacity
                key={variant}
                onPress={() => handleVariantSelect(variant)}
                style={[
                  styles.variantButton,
                  selectedVariant === variant && styles.variantSelected,
                ]}
              >
                <Text
                  style={[
                    styles.variantText,
                    selectedVariant === variant && styles.variantTextSelected,
                  ]}
                >
                  {variant}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            {product.data?.description?.en ||
              product.data?.description?.ar ||
              "No description provided."}
          </Text>

          <Text style={styles.sectionTitle}>Choose Quantity</Text>
          <View style={styles.quantityRow}>
            {quantityOptions.map((qty) => (
              <TouchableOpacity
                key={qty}
                style={[
                  styles.quantityButton,
                  selectedQuantity === qty && styles.variantSelected,
                ]}
                onPress={() => {
                  setCustomQty("");
                  setSelectedQuantity(qty);
                }}
              >
                <Text
                  style={[
                    styles.quantityText,
                    selectedQuantity === qty && styles.variantTextSelected,
                  ]}
                >
                  {qty}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.customButton} onPress={() => setCustomModalVisible(true)}>
              <Text style={styles.customText}>Custom</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {customModalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Custom quantity</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter quantity"
              keyboardType="numeric"
              value={customQty}
              onChangeText={setCustomQty}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonPrimary}
                onPress={() => {
                  setCustomModalVisible(false);
                  setSelectedQuantity(""); // clear preset quantity
                }}
              >
                <Text style={styles.modalButtonTextPrimary}>Add to cart</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <View style={styles.footer}>
        <TouchableOpacity style={styles.cartButton} onPress={handleCartNavigation}>
          <Text style={styles.cartButtonText}>Add to cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyButton} onPress={handleCartNavigation}>
          <Text style={styles.buyButtonText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProductDetails;


const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { paddingBottom: hp("13%") },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: wp("4%"),
  },
  headerTitle: {
    fontSize: hp("2.3%"),
    fontWeight: "600",
    marginLeft: wp("2%"),
  },
  imageContainer: {
    position: "relative",
    alignItems: "center",
    paddingHorizontal: wp("4%"),
    backgroundColor: "#F5F6FB",
  },
  productImage: {
    width: wp("70%"),
    height: hp("25%"),
    borderRadius: 12,
  },
  shareIcon: {
    position: "absolute",
    top: 10,
    right: 20,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 8,
    elevation: 2,
    shadowColor: "#000",
  },
  content: {
    paddingHorizontal: wp("5%"),
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: hp("2%"),
  },
  productTitle: {
    fontSize: hp("2.3%"),
    fontWeight: "600",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  starRow: {
    flexDirection: "row",
    marginRight: 6,
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: "bold",
    marginHorizontal: 4,
  },
  ratingCount: {
    fontSize: 14,
    color: "#777",
  },
  price: {
    marginTop: hp("1%"),
    color: "#283593",
    fontSize: hp("2.5%"),
    fontWeight: "bold",
  },
  sectionTitle: {
    marginTop: hp("2.5%"),
    fontSize: hp("2%"),
    fontWeight: "500",
  },
  variantRow: {
    flexDirection: "row",
    marginTop: hp("1%"),
    gap: 10,
  },
  variantButton: {
    paddingVertical: hp("1%"),
    paddingHorizontal: wp("4%"),
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
  },
  variantSelected: {
    backgroundColor: "#283593",
    borderColor: "#283593",
  },
  variantText: {
    fontSize: hp("1.9%"),
    color: "#333",
  },
  variantTextSelected: {
    color: "#fff",
  },
  description: {
    marginTop: hp("1%"),
    color: "#444",
    lineHeight: 22,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: wp("4%"),
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  cartButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#283593",
    paddingVertical: hp("1.5%"),
    borderRadius: 10,
    marginRight: wp("2%"),
    alignItems: "center",
  },
  cartButtonText: {
    color: "#2731d2",
    fontWeight: "600",
    fontSize: hp("2%"),
  },
  buyButton: {
    flex: 1,
    backgroundColor: "#283593",
    paddingVertical: hp("1.5%"),
    borderRadius: 10,
    alignItems: "center",
  },
  buyButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: hp("2%"),
  },quantityRow: {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 10,
  marginTop: hp("1%"),
},

quantityButton: {
  paddingVertical: hp("1%"),
  paddingHorizontal: wp("5%"),
  borderRadius: 10,
  backgroundColor: "#F2F2F7",
},

quantityText: {
  fontSize: hp("1.9%"),
  color: "#8E8E93",
  fontWeight: "500",
},

customButton: {
  paddingVertical: hp("1%"),
  paddingHorizontal: wp("5%"),
  borderRadius: 10,
  backgroundColor: "#F2F2F7",
},

customText: {
  fontSize: hp("1.9%"),
  color: "#8E8E93",
  fontWeight: "500",
},
modalOverlay: {
  position: "absolute",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 10,
},

modalContent: {
  width: "80%",

  backgroundColor: "#FFFFFF",
  borderRadius: 12,
  padding: 20,
  alignItems: "flex-start",
},

modalTitle: {
  fontSize: 18,
  fontWeight: "500",
  marginBottom: 12,
},

modalInput: {
  width: "100%",
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 10,
  paddingHorizontal: 10,
  paddingVertical: 8,
  fontSize: 16,
  marginBottom: 16,
},

modalButtons: {
  alignItems: "center",
  flexDirection: "row",
  justifyContent: "space-between",
  width: "50%",
},

modalButton: {
  marginLeft: wp("50%"),
  flex: 1,
  padding: 10,
  marginRight: 5,
  backgroundColor: "#283593",
  borderRadius: 8,
  alignItems: "center",
},

modalButtonPrimary: {
  flex: 1,
  padding: 10,
  marginLeft: 1,
  backgroundColor: "#283593",
  borderRadius: 8,
  alignItems: "center",
  justifyContent: "center",

},

modalButtonText: {
  color: "#333",
  fontWeight: "500",
},

modalButtonTextPrimary: {
  color: "#fff",
  fontWeight: "600",
},
 loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },


});
