import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const SpotlightCard = ({
  imageSource,
  deliveryTime = '120 - 150 mins',
  businessName = 'Al Karamh Trading',
  rating = '4.8',
  hasNoComplaints = true,
  isBestseller = true,
  isFrequentlyReordered = true,
  OnSellAll
}) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={styles.card} onPress={OnSellAll}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/green.jpeg')}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.timeBadge}>
          <Text style={styles.timeIcon}>⏱</Text>
          <Text style={styles.timeText}>{deliveryTime}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.businessName}>{businessName}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>{rating}</Text>
            <Text style={styles.star}>★</Text>
          </View>
        </View>

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
    borderRadius: wp('4%'),
    marginHorizontal: wp('4%'),
    marginVertical: hp('1%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: hp('25%'),
  },
  image: {
    width: '100%',
    height: '100%',
  },
  timeBadge: {
    position: 'absolute',
    bottom: hp('1.5%'),
    left: wp('3%'),
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.8%'),
    borderRadius: wp('6%'),
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  timeIcon: {
    fontSize: wp('4%'),
    marginRight: wp('1.5%'),
  },
  timeText: {
    fontSize: wp('3.5%'),
    fontWeight: '600',
    color: '#333',
  },
  content: {
    padding: wp('4%'),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1.5%'),
  },
  businessName: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: '#1a1a1a',
    flex: 1,
  },
  ratingContainer: {
    backgroundColor: '#2d5a2d',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.8%'),
    borderRadius: wp('5%'),
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    color: '#FFFFFF',
    fontSize: wp('4%'),
    fontWeight: 'bold',
    marginRight: wp('1%'),
  },
  star: {
    color: '#FFFFFF',
    fontSize: wp('4%'),
  },
  statusContainer: {
    gap: hp('1%'),
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('1%'),
    borderRadius: wp('2%'),
  },
  checkmark: {
    color: '#22c55e',
    fontSize: wp('4%'),
    fontWeight: 'bold',
    marginRight: wp('2%'),
  },
  statusText: {
    fontSize: wp('3.5%'),
    color: '#6b7280',
    fontWeight: '500',
  },
  bottomBadges: {
    flexDirection: 'row',
    gap: wp('2%'),
    flexWrap: 'wrap',
  },
});

export default SpotlightCard;
