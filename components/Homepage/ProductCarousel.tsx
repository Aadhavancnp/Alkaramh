import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { homeStyles as styles } from "./Homestyles";
import {API_URL} from '../../api.json';
type ProductProps = {
  onSeeAllPress?: () => void;
};

type Product = {
  id: string;
  image: string;
  name: {
    en: string;
    ar?: string;
  };
  price: number;
  rating?: number;
  description:{
   en: string;
    ar?: string;
  }
  liked: boolean;
};

const ProductCarousel: React.FC<ProductProps> = ({ onSeeAllPress }) => {
  const navigation = useNavigation<any>();
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProducts = async () => {
    try {
     // const response = await fetch("http://localhost:8000/api/products"); 
      const response = await fetch(`${API_URL}/products`); // Replace with IP if testing on device
      const json = await response.json();
     // console.log("Fetched products:", json.data[0]);
      if (json.success) {
        const products: Product[] = json.data.map((item: any) => ({
          id: item._id,
          image: item.image?.[0] || "https://via.placeholder.com/150",
          name: item.name,
          price: item.price,
          description:item.description,
          rating: item.rating || 4.5, // fallback rating if not present
          liked: false,
        }));
        setProductsList(products);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleFavourite = (id: string) => {
    const updated = productsList.map((product) =>
      product.id === id ? { ...product, liked: !product.liked } : product
    );
    setProductsList(updated);
  };

  if (loading) {
    return (
      <View style={{ padding: 20 }}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

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
              <Image source={{ uri: product.image }} style={styles.productimage} />
              <View style={styles.ratingContainer}>
                <Text style={styles.rating}>{product.rating}</Text>
                <AntDesign style={styles.star} name="star" />
              </View>
            </View>

            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product.name.en}</Text>
              <Text style={styles.productPrice}>QAR {product.price}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default ProductCarousel;
