import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
const CombinedProductPage = () => {
    const navigation:any=useNavigation();
  const handlecontinue = (productId: string): void => {
    navigation.navigate("ProductIndetail", {
      productId 
    });
}
const handelseall = (): void => {
  navigation.navigate("Products");
}
  const categories = ["All", "Feed", "Protein", "Salts"];
  const filters = ["Previously Ordered", "Rating 4.0+"];
  const [products, setProducts] = useState([
    {
      id: "1",
      name: "Sample Product",
      rating: "4.7★",
      price: "QAR 66",
      image: "https://vatsanfoods.com/adminln/uploads/product-images/1655987267_Jowar_-_Red_1.jpg",
      category: "Electronics",
      description: { ar: "وصف المنتج", en: "Product description" },
      stock: 74
    },
    {
      id: "2",
      name: "Sample Product 2 ",
      rating: "4.7★",
      price: "QAR 66",
      image: "https://vatsanfoods.com/adminln/uploads/product-images/1655987267_Jowar_-_Red_1.jpg",
      category: "Electronics",
      description: { ar: "وصف المنتج", en: "Product description" },
      stock: 74
    },
    {
      id: "3",
      name: "Sample Product 3 ",
      rating: "4.7★",
      price: "QAR 66",
      image: "https://vatsanfoods.com/adminln/uploads/product-images/1655987267_Jowar_-_Red_1.jpg",
      category: "Electronics",
      description: { ar: "وصف المنتج", en: "Product description" },
      stock: 74
    },
    {
      id: "4",
      name: "Sample Product 4 ",
      rating: "4.7★",
      price: "QAR 66",
      image: "https://vatsanfoods.com/adminln/uploads/product-images/1655987267_Jowar_-_Red_1.jpg",
      category: "Electronics",
      description: { ar: "وصف المنتج", en: "Product description" },
      stock: 74
    }
  ]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "https://alkarmah-backend.onrender.com/api/products",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Fetched products:", data);
      //  LOG  Fetched products: [{"__v": 0, "_id": "68387b9525af5d729273dc4a", "category": "Electronics", "description": {"ar": "b", "en": "n"}, "image": [], "name": {"ar": "aa", "en": "ab"}, "price": 66, "stock": 74}]
      // Update the products state with fetched data
      const transformedData = data.map((item: any) => ({
        id: item._id,
        name: item.name.en, // Using English name
        rating: "4.7★", // Default rating since not in API
        price: `QAR ${item.price}`,
        image: item.image[0] || "https://vatsanfoods.com/adminln/uploads/product-images/1655987267_Jowar_-_Red_1.jpg",
        category: item.category,
        description: {
          ar: item.description.ar,
          en: item.description.en
        },
        stock: item.stock
      }));

    setProducts(transformedData);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  useEffect(() => {
    fetchProducts();
  }
  , []);

 return (
    <ScrollView style={styles.container}>
      {/* Filter Section */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterTitle}>
          Filters<Text>{" "}</Text>
          <Ionicons
            name="funnel-outline"
            size={15}
            // style={{ marginTop: hp("24%"),position:"absolute" }}
            color={"#000000"}
          />
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterItems}
        >
          {filters.map((filter, index) => (
            <TouchableOpacity key={index} style={styles.filterItem}>
              <Text style={styles.filterText}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={styles.starter}>
        <Text style={{ fontWeight: "70" }}>RECOMMENDED FOR YOU</Text>
        <TouchableOpacity onPress={(handelseall)}>
          <Text style={{ color: "#283593" }}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.productsContainer}
      >
        {products.map((product, index) => (
          <TouchableOpacity onPress={
            () => handlecontinue(product.id)
          }
              key={index} style={styles.productCard}>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>{product.rating}</Text>
            </View>
            <View style={styles.productImage}>
              <Image
                source={{
                  uri: product.image || "https://via.placeholder.com/120",
                }}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productPrice}>{product.price}</Text>
          </TouchableOpacity>
        ))}
       
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "#fff",
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginRight: 10,
    color: "#333",
  },
  filterItems: {
    flexDirection: "row",
  },
  filterItem: {
    marginRight: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 15,
  },
  filterText: {
    fontSize: 12,
    color: "#333",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  productsContainer: {
    marginBottom: 10,
  },
  productCard: {
    width: 120,
    marginRight: 15,
  },
  starter: {
    marginTop: hp("1.5%"),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ratingContainer: {
    position: "relative",
    top: 120,
    zIndex: 7,
    backgroundColor: "#f5f5f5",
    padding: 5,
    borderRadius: 5,
    alignSelf: "flex-start",
    marginBottom: 5,
    marginLeft: 6,
  },
  ratingText: {
    fontSize: 12,
    color: "#333",
  },
  productImage: {
    width: 120,
    height: 120,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  imagePlaceholder: {
    color: "#888",
  },
  productName: {
    fontSize: 14,
    
    marginBottom: 4,
    color: "#333",
  },
  productPrice: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
  seeAllButton: {
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  seeAllText: {
    fontSize: 14,
    color: "#007bff",
  },
  image: {
    width: "70%",
    height: "70%",
    borderRadius: 10,
  },                                       
  spotlightTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
});

export default CombinedProductPage;
