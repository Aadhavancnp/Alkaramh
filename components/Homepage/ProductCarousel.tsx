import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { homeStyles as styles } from "./Homestyles"; // Assuming styles are defined in Home.tsx
type ProductProps = {
  onSeeAllPress?: () => void;
};

const ProductCarousel: React.FC<ProductProps> = ({ onSeeAllPress }) => {
  const navigation = useNavigation();

  const [productsList, setProductsList] = useState([
    {
      id: 1,
      image: require("../../assets/wheat.png"),
      name: "Wheat Straw",
      price: "QAR 12",
      rating: 4.7,
      liked: false,
    },
    {
      id: 2,
      image: require("../../assets/wheat.png"),
      name: "Wheat Straw ",
      price: "QAR 12",
      rating: 4.7,
      liked: false,
    },
    {
      id: 3,
      image: require("../../assets/wheat.png"),
      name: "Wheat Straw",
      price: "QAR 12",
      rating: 4.7,
      liked: false,
    },
  ]);

  const toggleFavourite = (id: number) => {
    const updated = productsList.map((product) =>
      product.id === id ? { ...product, liked: !product.liked } : product
    );
    setProductsList(updated);
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>RECOMMENDED FOR YOU</Text>
        <TouchableOpacity onPress={onSeeAllPress}>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.productsScrollView}
      >
        {productsList.map((product) => (
          <TouchableOpacity
            key={product.id}
            style={styles.productCard}
            onPress={() => navigation.navigate("ProductIndetail", { product })}
      
          >
            <View style={styles.productImageContainer}>
              <TouchableOpacity
                style={styles.likeButton}
                onPress={() => toggleFavourite(product.id)}
              >
                <AntDesign
                  name={product.liked ? "heart" : "hearto"}
                  style={styles.likeIcon}
                  color={product.liked ? "red" : "black"}
                />
              </TouchableOpacity>
              <Image source={product.image} style={styles.productimage} />
              <View style={styles.ratingContainer}>
                <Text style={styles.rating}>{product.rating}</Text>
                <AntDesign style={styles.star} name="star" />
              </View>
            </View>

            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productPrice}>{product.price}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default ProductCarousel;
