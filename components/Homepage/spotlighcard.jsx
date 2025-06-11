import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';

// Replace this with your actual navigation param list
type RootStackParamList = {
  ProductIndetail: { product: Product };
};

const TradingCard = ({
  imageSource,
  deliveryTime = '120 - 150 mins',
  businessName = 'Al Karamh Trading',
  rating = '4.8',
  hasNoComplaints = true,
  isBestseller = true,
  isFrequentlyReordered = true,
  onPress,
}) => {
  return (
    
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* Image Container */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/green.jpeg') || { uri: 'https://via.placeholder.com/300x200' }}
          style={styles.image}
          resizeMode="cover"
        />
        
        {/* Delivery Time Badge */}
        <View style={styles.timeBadge}>
          <Text style={styles.timeIcon}>⏱</Text>
          <Text style={styles.timeText}>{deliveryTime}</Text>
        </View>
      </View>

      {/* Content Container */}
      <View style={styles.content}>
        {/* Business Name and Rating */}
        <View style={styles.header}>
          <Text style={styles.businessName}>{businessName}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>{rating}</Text>
            <Text style={styles.star}>★</Text>
          </View>
        </View>

        {/* Status Badges */}
        <View style={styles.statusContainer}>
          {hasNoComplaints && (
            <View style={styles.statusBadge}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.statusText}>Last 100 Orders Without Complaints</Text>
            </View>
          )}
          
          <View style={styles.bottomBadges}>
            {isBestseller && (
              <View style={styles.statusBadge}>
                <Text style={styles.checkmark}>✓</Text>
                <Text style={styles.statusText}>Bestseller</Text>
              </View>
            )}
            
            {isFrequentlyReordered && (
              <View style={styles.statusBadge}>
                <Text style={styles.checkmark}>✓</Text>
                <Text style={styles.statusText}>Frequently Reordered</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  timeBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  timeIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  businessName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    flex: 1,
  },
  ratingContainer: {
    backgroundColor: '#2d5a2d',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 4,
  },
  star: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  statusContainer: {
    gap: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  checkmark: {
    color: '#22c55e',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  bottomBadges: {
    flexDirection: 'row',
    gap: 8,
  },
});

// Example usage component
const ExampleUsage = () => {
  const handleCardPress = () => {
    console.log('Card pressed!');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0000', paddingTop: 100 , elevation:100 }}>
      <TradingCard
        deliveryTime="120 - 150 mins"
        businessName="Al Karamh Trading"
        rating="4.8"
        hasNoComplaints={true}
        isBestseller={true}
        isFrequentlyReordered={true}
        onPress={handleCardPress}
      />
    </View>
  );
};

export default TradingCard;
