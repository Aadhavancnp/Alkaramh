import React, { useState, useEffect, useContext } from 'react'; // Import useContext
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AuthContext from '../../context/AuthContext'; // Import AuthContext

// Interfaces based on typical order structure and prompt
interface ProductInOrderItem {
  _id: string;
  name: {
    en: string;
    ar?: string;
  };
  image?: string[]; // Assuming image is an array of strings
}

interface OrderItem {
  _id: string;
  product: ProductInOrderItem;
  quantity: number;
  price: number; // Price at the time of order for this item
}

interface Order {
  _id: string;
  user: string; // User ID
  items: OrderItem[];
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'; // Example statuses
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  // Add other fields like shippingAddress, paymentMethod if available and needed
}


const OrderHistoryScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const authContext = useContext(AuthContext);
  const { user, token, isLoading: isAuthLoading } = authContext || {};

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // For order history data loading
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      if (!user?._id || !token) {
        if (!isAuthLoading) { // Only set error if auth loading is complete
            setError("Please login to view your order history.");
        }
        setLoading(false);
        setOrders([]); // Clear any existing orders
        return;
      }
      
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:3000/api/orders/user?userId=${user._id}`,
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
          throw new Error(data.message || 'Failed to fetch order history.');
        }
        setOrders(data || []);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    if (!isAuthLoading) { // Wait for auth state to be loaded
        fetchOrderHistory();
    }
  }, [user?._id, token, isAuthLoading]);

  const renderOrderItem = ({ item }: { item: Order }) => {
    const firstItemImage = item.items && item.items.length > 0 && item.items[0].product.image && item.items[0].product.image.length > 0 
      ? item.items[0].product.image[0] 
      : 'https://via.placeholder.com/80';

    return (
      <TouchableOpacity 
        style={styles.orderCard} 
        // onPress={() => navigation.navigate('OrderDetailScreen', { orderId: item._id })} // For future navigation
      >
        <View style={styles.orderCardHeader}>
          <Text style={styles.orderId}>Order ID: #{item._id.substring(0, 8)}...</Text>
          <Text style={styles.orderDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
        </View>
        
        <View style={styles.orderCardBody}>
          <Image source={{ uri: firstItemImage }} style={styles.productImage} />
          <View style={styles.orderDetails}>
            {item.items && item.items.length > 0 && (
              <Text style={styles.itemSummary}>
                {item.items[0].product.name.en}
                {item.items.length > 1 ? ` and ${item.items.length - 1} other(s)` : ''}
              </Text>
            )}
            <Text style={styles.orderStatus(item.status)}>{item.status}</Text>
          </View>
          <Text style={styles.orderTotal}>{item.totalAmount.toFixed(2)} QAR</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (isAuthLoading || loading) { // Show loading if either auth state or order data is loading
    return (
      <SafeAreaView style={styles.centeredView}>
        <ActivityIndicator size="large" color="#2A3B8F" />
        <Text style={styles.loadingText}>Loading order history...</Text>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={wp('6%')} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={{ width: wp('6%') }} />{/* Spacer for centering title */}
      </View>

      {error && ( // Display error prominently if it exists
        <View style={styles.centeredView}>
            <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {!error && orders.length === 0 && ( // Only show empty if no error
        <View style={styles.centeredView}>
          <Ionicons name="file-tray-stacked-outline" size={wp('20%')} color="#ccc" />
          <Text style={styles.emptyOrdersText}>You have no orders yet.</Text>
        </View>
      )}

      {!error && orders.length > 0 && (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContentContainer}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5', // Light grey background
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
    padding: wp('1%'),
  },
  headerTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: '#333',
  },
  loadingText: {
    marginTop: hp('1%'),
    fontSize: wp('4%'),
    color: '#555',
  },
  errorText: {
    fontSize: wp('4%'),
    color: 'red',
    textAlign: 'center',
    marginTop: hp('2%'),
  },
  emptyOrdersText: {
    fontSize: wp('4.5%'),
    color: '#666',
    marginTop: hp('2%'),
  },
  listContentContainer: {
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('2%'),
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: wp('2.5%'),
    padding: wp('4%'),
    marginBottom: hp('1.5%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: hp('1%'),
    marginBottom: hp('1%'),
  },
  orderId: {
    fontSize: wp('3.8%'),
    fontWeight: '600',
    color: '#333',
  },
  orderDate: {
    fontSize: wp('3.5%'),
    color: '#777',
  },
  orderCardBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: wp('15%'),
    height: wp('15%'),
    borderRadius: wp('1.5%'),
    marginRight: wp('3%'),
    backgroundColor: '#eee', // Placeholder background
  },
  orderDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemSummary: {
    fontSize: wp('3.8%'),
    color: '#555',
    marginBottom: hp('0.5%'),
  },
  orderStatus: (status: Order['status']) => ({
    fontSize: wp('3.5%'),
    fontWeight: 'bold',
    color: status === 'Delivered' ? '#28a745' : (status === 'Cancelled' ? '#dc3545' : '#ffc107'), // Green for delivered, Red for cancelled, Yellow for others
  }),
  orderTotal: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#2A3B8F',
    marginLeft: wp('2%'), // Space from order details
  },
});

export default OrderHistoryScreen;
