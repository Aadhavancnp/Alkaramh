import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Footer from '@/Utils/Footer/Footer';

// Replace this with your actual navigation param list
type RootStackParamList = {
  ProductIndetail: { product: Product };
};

type Product = {
  id: string;
  name: string;
  image: any;
  rating: number;
  price: number;
  reviews: string;
  description: string;
};

const products: Product[] = [
  {
    id: '1',
    name: 'Wheat straw',
    image: require('../../assets/wheat.png'),
    rating: 4.5,
    price: 12,
    reviews: '1.24K',
    description: 'Al Karamh is renowned for its high-quality products.',
  },
  {
    id: '2',
    name: 'Wheat straw',
    image: require('../../assets/wheat.png'),
    rating: 4.0,
    price: 12,
    reviews: '850',
    description: 'Premium wheat straw from trusted farms.',
  },
  {
    id: '3',
    name: 'Wheat straw',
    image: require('../../assets/wheat.png'),
    rating: 4.8,
    price: 12,
    reviews: '2.1K',
    description: 'Top-rated product among farmers.',
  },
  {
    id: '4',
    name: 'Wheat straw',
    image: require('../../assets/wheat.png'),
    rating: 4.8,
    price: 12,
    reviews: '2.1K',
    description: 'Top-rated product among farmers.',
  },
  {
    id: '5',
    name: 'Wheat straw',
    image: require('../../assets/wheat.png'),
    rating: 4.8,
    price: 12,
    reviews: '2.1K',
    description: 'Top-rated product among farmers.',
  },
  {
    id: '6',
    name: 'Wheat straw',
    image: require('../../assets/wheat.png'),
    rating: 4.8,
    price: 12,
    reviews: '2.1K',
    description: 'Top-rated product among farmers.',
  },

];

const renderStars = (rating: number) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    let icon =
      i <= Math.floor(rating)
        ? 'star'
        : rating >= i - 0.5
        ? 'star-half'
        : 'star-outline';
    stars.push(<Ionicons key={i} name={icon as any} size={16} color="#FFC107" />);
  }
  return stars;
};

const ListProduct: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

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
              <Image source={item.image} style={styles.image} />
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
              <Text style={styles.name}>{item.name}</Text>
              <View style={styles.ratingRow}>
                {renderStars(item.rating)}
                <Text style={styles.reviews}> ({item.reviews})</Text>
              </View>
              <Text style={styles.price}>{item.price} QAR</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        
        </TouchableWithoutFeedback>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    //padding: 16,
  },
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

export default ListProduct;
