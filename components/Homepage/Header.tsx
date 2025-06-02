import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
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
import apiConfig from "../../api.json"; // Make sure this has your API_URL

const Header = () => {
  const navigation: any = useNavigation();
  const [categories, setCategories] = useState<any[]>([]);

  const handelseall = (): void => {
    navigation.navigate("Products");
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${apiConfig.API_URL}/categories`);
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else if (Array.isArray(response.data.data)) {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <View style={styles.container}>
      <Ionicons
        name="search"
        color={"#000000"}
        size={20}
        style={{ position: "relative", top: hp("4.3%"), left: wp("2%") }}
      />
      <View style={styles.headertop}>
        <View style={styles.inputfield}>
          <TextInput
            style={styles.searchInput}
            placeholder="     Search deals, products & more..."
            placeholderTextColor="#888"
          />
        </View>
        <Ionicons
          name="notifications"
          size={20}
          style={{ marginTop: hp("1.9%"), marginLeft: wp("5%") }}
        />
      </View>
      <View style={styles.starter}>
        <Text style={{ fontWeight: "700" }}>Explore Categories</Text>
        <TouchableOpacity onPress={handelseall}>
          <Text style={{ color: "blue" }}>See All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.productRow}
      >
        {categories.map((category, index) => (
          <TouchableOpacity
            key={category._id || index}
            style={styles.productItem}
            onPress={() =>
              navigation.navigate("Products", { category: category.name?.en })
            }
          >
            <Image
              source={{ uri: category.image }}
              style={styles.productImage}
            />
            <Text style={styles.categoryText}>
              {category.name?.en || "No Name"}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: hp("2%"),
    marginTop: hp("5%"),
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headertop: {
    flexDirection: "row",
    // paddingTop:hp("5%")
  },
  inputfield: {
    width: wp("80%"),
  },
  searchInput: {
    height: hp("6%"),
    borderRadius: hp("1%"),
    borderColor: "black",
    borderWidth: 0.2,
    paddingHorizontal: wp("5%"),
    fontSize: hp("2%"),
  },
  starter: {
    marginTop: hp("1.5%"),
    marginBottom: hp("1%"),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  productRow: {
    marginTop: hp("2%"),
  },
  productItem: {
    alignItems: "center",
    marginRight: wp("5%"),
  },
  productImage: {
    width: hp("8%"),
    height: hp("8%"),
    borderRadius: hp("4%"),
    marginBottom: hp("1%"),
    borderWidth: 1,
    borderColor: "#ddd",
  },
  categoryText: {
    fontSize: hp("1.8%"),
    color: "#333",
    textAlign: "center",
  },
});

export default Header;
