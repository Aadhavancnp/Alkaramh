import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import apiConfig from "../../api.json"; // Import the JSON file for API URL

const Downproduct: React.FC = () => {
  const navigation: any = useNavigation();
  const [spotlightData, setSpotlightData] = useState<any[]>([]); // Use any[] to store original API data

  const handleContinue = (product: any): void => {
    navigation.navigate("ProductIndetail", {
      product, // Pass the entire original product object
    });
  };

  const fetchSpotlightProducts = async () => {
    try {
      const response = await axios.get(`${apiConfig.API_URL}/products`);
      if (response.data.success) {
        setSpotlightData(response.data.data); // Store the original data array
      } else {
        console.error("Failed to fetch spotlight products: ", response.data);
      }
    } catch (error) {
      console.error("Error fetching spotlight products:", error);
    }
  };

  useEffect(() => {
    fetchSpotlightProducts();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.sectionTitle}>IN THE SPOTLIGHT</Text>
      {spotlightData.map((product) => (
        <TouchableOpacity
          onPress={() => handleContinue(product)} // Pass the original product object
          key={product._id}
          style={styles.card}
        >
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: Array.isArray(product.image)
                  ? product.image[0]
                  : product.image,
              }}
              style={styles.image}
              resizeMode="contain" // <-- This will fit the image
            />
            <View style={styles.rating}>
              <Text style={styles.ratingText}>{product.rating ?? 4.8} ★</Text>
            </View>
          </View>
          {/* Delivery time */}
          <View style={styles.timeWrapper}>
            <Text style={styles.timeText}>⏱ 120 - 150 mins</Text>
          </View>
          <View style={styles.content}>
            <Text style={styles.title}>
              {product.name?.en || product.title}
            </Text>
            <Text style={styles.categoryText}>{product.category}</Text>
            <Text style={styles.priceText}>
              {product.price ? `${product.price} QAR` : ""}
            </Text>
            <View style={styles.tagsContainer}>
              {/* Optional: Render tags if present */}
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp("4%"),
    backgroundColor: "#ffffff",
  },
  sectionTitle: {
    fontSize: hp("2.2%"),
    fontWeight: "600",
    marginBottom: hp("1.5%"),
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: wp("4%"),
    overflow: "hidden",
    elevation: 4,
    marginBottom: hp("2%"),
    position: "relative",
  },
  imageContainer: {
    width: "100%",
    height: hp("24%"),
    backgroundColor: "#f4f4f4",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  image: {
    width: "100%",
    height: hp("24%"),
    resizeMode: "cover",
  },
  timeWrapper: {
    position: "absolute",
    top: hp("22%"),
    backgroundColor: "#ffffff",
    paddingVertical: hp("0.3%"),
    borderTopRightRadius: wp("9%"),
    width: wp("40%"),
    height: hp("5%"),
  },
  timeText: {
    color: "#444",
    fontSize: hp("1.7%"),
    marginLeft: wp("1%"),
  },
  content: {
    padding: wp("4%"),
    paddingTop: hp("2%"),
  },
  title: {
    fontSize: hp("2.2%"),
    fontWeight: "600",
    color: "#222",
    marginBottom: hp("1%"),
  },
  categoryText: {
    fontSize: hp("1.7%"),
    color: "#888",
    marginBottom: hp("0.5%"),
  },
  priceText: {
    fontSize: hp("2%"),
    color: "#2A3B8F",
    fontWeight: "bold",
    marginBottom: hp("0.5%"),
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: "#e6f4f1",
    borderRadius: wp("3%"),
    paddingVertical: hp("0.5%"),
    paddingHorizontal: wp("3%"),
    marginRight: wp("2%"),
    marginBottom: hp("1%"),
  },
  tagText: {
    fontSize: hp("1.5%"),
    color: "#333",
  },
  rating: {
    position: "absolute",
    top: hp("1%"),
    right: wp("3%"),
    backgroundColor: "#4CAF50",
    borderRadius: wp("3%"),
    paddingHorizontal: wp("2.5%"),
    paddingVertical: hp("0.5%"),
  },
  ratingText: {
    color: "white",
    fontSize: hp("1.5%"),
    fontWeight: "bold",
  },
});

export default Downproduct;
