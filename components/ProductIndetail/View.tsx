import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useNavigation } from "expo-router";

// ✅ Single Product Data
const product = {
  name: "Wheat Straw – 6kg",
  description:
    "Al Karamh is renowned for its high-quality products. This product showcases their dedication to excellence. Customers trust Al Karamh for reliable and superior goods.",
  price: "12 QAR",
  rating: 4.5,
  ratingCount: "1.24K Reviews",
  image: require("../../assets/g-wheat.png"),
  variants: ["10 kg", "20 kg", "30 kg"],
  quantityOptions: ["10", "20", "30", "40"],
};

const ProductDetails = ( { navigation }:any ) => {
  const [customModalVisible, setCustomModalVisible] = useState(false);
  const [customQty, setCustomQty] = useState("");
 
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [isFavorite, setIsFavorite] = useState(false);

  const renderStars = (rati: any) => {
    const fullStars = Math.floor(rati);
    const hasHalfStar = rati % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={`full-${i}`} name="star" size={18} color="#FFD700" />
      );
    }
    if (hasHalfStar) {
      stars.push(
        <Ionicons key={`half`} name="star-half" size={18} color="#FFD700" />
      );
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons key={`empty-${i}`} name="star-outline" size={18} color="#FFD700" />
      );
    }

    return stars;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Ionicons name="chevron-back" size={24} onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Product details</Text>
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={product.image}
            style={styles.productImage}
            resizeMode="contain"
          />
          <TouchableOpacity style={styles.shareIcon}>
            <Ionicons name="arrow-redo-outline" size={20} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.productTitle}>{product.name}</Text>
            <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={24}
                color={isFavorite ? "red" : "#888"}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.ratingRow}>
            <View style={styles.starRow}>{renderStars(product.rating)}</View>
            <Text style={styles.ratingValue}>{product.rating}</Text>
            <Text style={styles.ratingCount}>({product.ratingCount})</Text>
          </View>

          <Text style={styles.price}>{product.price}</Text>

          <Text style={styles.sectionTitle}>Variants</Text>
          <View style={styles.variantRow}>
            {product.variants.map((variant) => (
              <TouchableOpacity
                key={variant}
                onPress={() => setSelectedVariant(variant)}
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
          <Text style={styles.description}>{product.description}</Text>

          <Text style={styles.sectionTitle}>Choose Quantity</Text>
          <View style={styles.quantityRow}>
            {product.quantityOptions.map((qty) => (
              <TouchableOpacity
                key={qty}
                style={styles.quantityButton}
                onPress={() => console.log(`Selected quantity: ${qty}`)}
              >
                <Text style={styles.quantityText}>{qty}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.customButton}
              onPress={() => setCustomModalVisible(true)}
            >
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
                  console.log("Custom quantity entered:", customQty);
                }}
              >
                <Text style={styles.modalButtonTextPrimary}>Add to cart</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <View style={styles.footer}>
        <TouchableOpacity style={styles.cartButton} onPress={()=>navigation.navigate('Cart',{showEmpty: true})}>
          <Text style={styles.cartButtonText}>Add to cart</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buyButton}
          onPress={()=>navigation.navigate('Cart',{showEmpty: true})}
        >
          <Text style={styles.buyButtonText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { paddingBottom: hp("20%") },
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
    color: "#2731d2",
    fontSize: hp("2.2%"),
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
  height:'20%',
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


});
