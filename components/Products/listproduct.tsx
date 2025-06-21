import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { API_URL } from '../../api.json';

type RootStackParamList = {
  ProductIndetail: { product: Product };
};

type Product = {
  id: string;
  name: { en: string; ar?: string };
  image: string;
  rating: number;
  price: number;
  reviews?: string;
  description: { en?: string; ar?: string } | string;
};

type Props = {
  categoryId?: string;       // Category name in `en` like "Feed", "Salt"
  searchQuery?: string;
};

const renderStars = (rating: number) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const icon =
      i <= Math.floor(rating)
        ? 'star'
        : rating >= i - 0.5
        ? 'star-half'
        : 'star-outline';
    stars.push(<Ionicons key={i} name={icon as any} size={16} color="#FFC107" />);
  }
  return stars;
};

const ListProduct: React.FC<Props> = ({ categoryId = 'all', searchQuery = '' }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  console.log(categoryId);
  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

 const fetchProducts = async () => {
  try {
    setLoading(true);
    let data: Product[] = [];

    if (categoryId === 'All products') {
      // GET all products
      const res = await fetch(`${API_URL}/products`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) data = json.data;
    } else {
      // POST to category filter endpoint with trimmed category name
      const res = await fetch(`${API_URL}/categories/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: categoryId.trim() }),
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) data = json.data;
    }

    const mapped: Product[] = data.map((item: any) => ({
      id: item._id,
      name: item.name || { en: 'Unnamed' },
      image: typeof item.image === 'string' ? item.image : item.image?.[0] || 'https://via.placeholder.com/150',
      price: item.price,
      rating: item.rating || 4.5,
      reviews: item.ratingCount || '10',
      description: item.description || {},
    }));

    const filtered = searchQuery
      ? mapped.filter((item) =>
          item.name.en.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : mapped;

    setProducts(filtered);
  } catch (error) {
    console.error('Error fetching products:', error);
    setProducts([]);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchProducts();
  }, [categoryId, searchQuery]);

  if (loading) return null;
  if (!products.length) return null;

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate('ProductIndetail', { product: item })}
        >
          <View style={styles.card}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <TouchableOpacity
                onPress={() => toggleFavorite(item.id)}
                style={styles.heartIcon}
              >
                <Ionicons
                  name={favorites.includes(item.id) ? 'heart' : 'heart-outline'}
                  size={20}
                  color={favorites.includes(item.id) ? 'red' : 'gray'}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.content}>
              <Text style={styles.name}>{item.name.en}</Text>
              <View style={styles.ratingRow}>
                {renderStars(item.rating)}
                <Text style={styles.reviews}> ({item.reviews})</Text>
              </View>
              <Text style={styles.price}>{item.price} QAR</Text>
              <Text style={styles.description}>
                {typeof item.description === 'string'
                  ? item.description
                  : item.description?.en || item.description?.ar || 'Not Available'}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
    />
  );
};

export default ListProduct;
const styles = StyleSheet.create({
  container: {},
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderBottomColor: '#D9D9D9',
    borderBottomWidth: hp('0.1%'),
  },
  imageContainer: {
    position: 'relative',
    backgroundColor: '#DADADA',
    borderRadius: 12,
    alignItems: 'center',
  },
  image: {
    width: wp('30%'),
    height: hp('15%'),
    borderRadius: 12,
  },
  heartIcon: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
    elevation: 2,
  },
  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviews: {
    marginLeft: 4,
    fontSize: 12,
    color: '#555',
  },
  price: {
    color: '#283593',
    fontWeight: '700',
    fontSize: 14,
    marginVertical: 4,
  },
  description: {
    fontSize: 12,
    color: '#666',
  },
});
