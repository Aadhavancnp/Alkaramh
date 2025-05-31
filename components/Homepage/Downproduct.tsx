import React, { useState } from "react";
import { View, Text, StyleSheet, Image, SafeAreaView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
type SpotlightProduct = {
  id: string;
  title: string;
  image: string;
  deliveryTime: string;
  rating: number;
  tags: string[];
}[];

const Downproduct: React.FC = () => {
    const navigation:any=useNavigation();
  const handlecontinue = (): void => {
    navigation.navigate("Products");
}
  const [spotlightData] = useState<SpotlightProduct>([
    {
      id: "1",
      title: "Al Karamh Trading",
      image:
        "https://www.advancingnortheast.in/wp-content/uploads/2021/07/1408603089-1024x1024-1.jpg",
      deliveryTime: "120 - 150 mins",
      rating: 4.8,
      tags: [
        "Last 100 Orders Without Complaints",
        "Bestseller",
        "Frequently Reordered",
      ],
    },
    {
      id: "2",
      title: "Al Karamh Trading",
      image:
        "https://www.advancingnortheast.in/wp-content/uploads/2021/07/1408603089-1024x1024-1.jpg",
      deliveryTime: "120 - 150 mins",
      rating: 4.8,
      tags: [
        "Last 100 Orders Without Complaints",
        "Bestseller",
        "Frequently Reordered",
      ],
    },
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.sectionTitle}>IN THE SPOTLIGHT</Text>

      {spotlightData.map((product) => (
        <TouchableOpacity onPress={handlecontinue} key={product.id} style={styles.card}>
          <Image source={{ uri: product.image }} style={styles.image} />
          {/* Delivery time */}
          <View style={styles.timeWrapper}>
            <Text style={styles.timeText}>⏱ {product.deliveryTime}</Text>
          </View>
          <View style={styles.content}>
            <Text style={styles.title}>{product.title}</Text>
            <View style={styles.rating}>
              <Text style={styles.ratingText}>{product.rating} ★</Text>
            </View>
            <View style={styles.tagsContainer}>
              {product.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>✓ {tag}</Text>
                </View>
              ))}
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
  image: {
    width: "100%",
    height: hp("24%"),
    resizeMode: "cover",
  },
  timeWrapper: {
    position: "absolute",
    top: hp("22%"),
    // left: wp("3%"),
    backgroundColor: "#ffffff",
    paddingVertical: hp("0.3%"),
    // paddingHorizontal: wp("2%"),

    borderTopRightRadius: wp("9%"),
    width: wp("40%"),
    height: hp("5%"),
  },
  timeText: {
    color: "#444",
    fontSize: hp("1.7%"),
    // textAlign:"center",
    marginLeft: wp("1%"),
    // justifyContent:"center",
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
