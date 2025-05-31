import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
type Product = {
  name: string;
  imageurl: string;
};

const Header = () => {
  const navigation: any = useNavigation();
  const [products, setProducts] = useState<Product[]>([]);
  const categories = ["All", "Feed", "Protein", "Salts"];
  const handlecontinue = (): void => {
    navigation.navigate("ProductIndetail");
  };
  const handelseall = (): void => {
    navigation.navigate("Products");
  };

  useEffect(() => {
    setProducts([
      {
        name: "Wheat",
        imageurl:
          "https://www.ulamart.com/pub/media/catalog/product/cache/7fbcc9caab5fbb2832d4dd01a9cbb8ed/t/h/thinai-min_optimized.png",
      },
      {
        name: "Barley",
        imageurl:
          "https://www.ulamart.com/pub/media/catalog/product/cache/7fbcc9caab5fbb2832d4dd01a9cbb8ed/t/h/thinai-min_optimized.png",
      },
      {
        name: "Millet",
        imageurl:
          "https://www.ulamart.com/pub/media/catalog/product/cache/7fbcc9caab5fbb2832d4dd01a9cbb8ed/t/h/thinai-min_optimized.png",
      },
      {
        name: "Wheat",
        imageurl:
          "https://www.ulamart.com/pub/media/catalog/product/cache/7fbcc9caab5fbb2832d4dd01a9cbb8ed/t/h/thinai-min_optimized.png",
      },
      {
        name: "Barley",
        imageurl:
          "https://www.ulamart.com/pub/media/catalog/product/cache/7fbcc9caab5fbb2832d4dd01a9cbb8ed/t/h/thinai-min_optimized.png",
      },
      {
        name: "Millet",
        imageurl:
          "https://www.ulamart.com/pub/media/catalog/product/cache/7fbcc9caab5fbb2832d4dd01a9cbb8ed/t/h/thinai-min_optimized.png",
      },
    ]);
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
        {products.map((product, index) => (
          <View key={index} style={styles.productItem}>
            <Image
              source={{ uri: product.imageurl }}
              style={styles.productImage}
            />
            <Text style={styles.categoryText}>{product.name}</Text>
          </View>
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
