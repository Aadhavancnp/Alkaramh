import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react'; // Import useContext
import {
    ActivityIndicator,
    FlatList,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AuthContext from '../../context/AuthContext'; // Import AuthContext
import Footer from '@/Utils/Footer/Footer';
// Interface for Product data within a wishlist item
interface WishlistedProduct {
  _id: string;
  name: {
    en: string;
    ar?: string;
  };
  price: number;
  image: string[];
  description?: { // Optional, but good to have for consistency if navigating to ProductDetail
    en: string;
    ar?: string;
  };
  // Add any other relevant product fields you expect
}


const WishlistScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const authContext = useContext(AuthContext);
  const { user, token, isLoading: isAuthLoading } = authContext || {};

  const [wishlistItems, setWishlistItems] = useState<WishlistedProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // For wishlist data loading
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user?._id || !token) {
        if (!isAuthLoading) { // Only set error if auth loading is complete
            setError("Please login to view your wishlist.");
        }
        setLoading(false);
        setWishlistItems([]); // Clear any existing items
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://alkarmah-backend.onrender.com/api/wishlist?userId=${user._id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch wishlist.');
        }
        
        // The prompt mentions the backend populates 'favorites'
        // Adjust based on the actual structure: data.favorites or data directly if it's the array
        setWishlistItems(data.favorites || data || []);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    if (!isAuthLoading) { // Wait for auth state to be loaded
        fetchWishlist();
    }
  }, [user?._id, token, isAuthLoading]);

  const renderProductItem = ({ item }: { item: WishlistedProduct }) => (
    <TouchableOpacity
      style={styles.productItemContainer}
      onPress={() => navigation.navigate('ProductDetail', { productId: item._id })} // Ensure 'ProductDetail' route exists
    >
      <Image 
        source={{ uri: item.image && item.image.length > 0 ? item.image[0] : 'https://via.placeholder.com/100' }} 
        style={styles.productImage} 
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name.en}</Text>
        <Text style={styles.productPrice}>{item.price} QAR</Text>
      </View>
    </TouchableOpacity>
  );

  if (isAuthLoading || loading) { // Show loading if either auth state or wishlist data is loading
    return (
      <SafeAreaView style={styles.centeredView}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ fontSize: wp('4%'), color: '#666', textAlign: 'center' }}>Loading wishlist...</Text>
      </SafeAreaView>
    );
  }
  
  return (
    <View style={{flex: 1, justifyContent: 'space-between'}}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={wp('6%')} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Wishlist</Text>
          <View style={{ width: wp('6%') }} />
        </View>
        {error && (
           <View style={styles.centeredView}>
              <Text style={styles.errorText}>{error}</Text>
           </View>
        )}
        {!error && wishlistItems.length === 0 && (
          <View style={styles.centeredView}>
            <Ionicons name="heart-outline" size={wp('20%')} color="#ccc" />
            <Text style={styles.emptyWishlistText}>Your wishlist is empty</Text>
          </View>
        )}
        {!error && wishlistItems.length > 0 && (
          <FlatList
            data={wishlistItems}
            renderItem={renderProductItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContentContainer}
          />
        )}
      </SafeAreaView>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingBottom: 80, // Add enough padding for the footer height
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 5,
  },
  backButtonHeader: { // For error screen back button
    position: 'absolute',
    top: hp('2%'),
    left: wp('4%'),
    padding: 5,
    zIndex: 1, // Ensure it's clickable
  },
  headerTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: '#333',
  },
  listContentContainer: {
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),
  },
  productItemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: wp('3%'),
    marginBottom: hp('1.5%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  productImage: {
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: 6,
    marginRight: wp('3%'),
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#444',
    marginBottom: hp('0.5%'),
  },
  productPrice: {
    fontSize: wp('3.8%'),
    color: '#007bff',
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: wp('4%'),
    color: 'red',
    textAlign: 'center',
  },
  emptyWishlistText: {
    fontSize: wp('4.5%'),
    color: '#666',
  },
});

export default WishlistScreen;
