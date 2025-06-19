// No change in imports
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import { Ionicons } from "@expo/vector-icons";
import { heightPercentageToDP as hp , widthPercentageToDP as wp} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

const Checkoutpage = () => {
  const navigation = useNavigation();
  const [selectedPayment, setSelectedPayment] = useState('debit');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={wp('6%')} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
      </View>

      <View style={styles.content}>
        {/* Pay with Section */}
        <View style={styles.section}>
          <View style={styles.paymentOptions}>
            <View style={styles.sectionHeader}>
              <View style={styles.blueLine} />
              <Text style={styles.sectionTitle}>Pay with</Text>
            </View>
            
            {/* Payment Methods */}
            {['debit', 'credit', 'cash'].map(method => (
              <TouchableOpacity
                key={method}
                style={styles.paymentOption}
                onPress={() => setSelectedPayment(method)}
              >
                <View style={styles.paymentOptionLeft}>
                  {method === 'cash' ? (
                    <Image
                      style={styles.paymentIconImage}
                      source={require('../../assets/Vector.png')}
                    />
                  ) : (
                    <FontAwesome style={styles.paymentIcon} name="credit-card" />
                  )}
                  <Text style={styles.paymentLabel}>
                    {method === 'debit' ? 'Debit Card' :
                     method === 'credit' ? 'Credit Card' :
                     'Cash on delivery'}
                  </Text>
                </View>
                <View style={styles.radioContainer}>
                  <View style={[
                    styles.radioButton,
                    selectedPayment === method && styles.radioButtonSelected
                  ]}>
                    {selectedPayment === method && <View style={styles.radioButtonInner} />}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Price Details */}
        <View style={styles.section}>
          <View style={styles.priceDetails}>
            <View style={styles.sectionHeader}>
              <View style={styles.blueLine} />
              <Text style={styles.sectionTitle}>Price details</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Basket Total</Text>
              <Text style={styles.priceValue}>24 QAR</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Delivery Fee</Text>
              <Text style={styles.priceValue}>50 QAR</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.priceRow}>
              <Text style={styles.totalLabel}>Total amount</Text>
              <Text style={styles.totalValue}>74 QAR</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Place Order */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.placeOrderButton} onPress={() => navigation.navigate('Dashboard')}>
          <Text style={styles.placeOrderText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Responsive styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    marginRight: wp('3%'),
  },
  headerTitle: {
    fontSize: wp('5.5%'),
    fontWeight: '600',
    color: '#333333',
  },
  content: {
    flex: 1,
    paddingHorizontal: wp('5%'),
  },
  section: {
    marginTop: hp('2.5%'),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'),
    paddingTop: hp('2%'),
  },
  blueLine: {
    width: wp('1.2%'),
    height: hp('2.5%'),
    backgroundColor: '#283593',
    marginRight: wp('3%'),
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: wp('4.5%'),
    fontWeight: '600',
    color: '#283593',
  },
  paymentOptions: {
    backgroundColor: '#ffffff',
    borderRadius: wp('3%'),
    paddingVertical: hp('1%'),
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2.5%'),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  paymentOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIcon: {
    fontSize: wp('5.5%'),
    marginRight: wp('3%'),
    color: '#333',
  },
  paymentIconImage: {
    width: wp('5.5%'),
    height: wp('5.5%'),
    resizeMode: 'contain',
    marginRight: wp('3%'),
  },
  paymentLabel: {
    fontSize: wp('4.2%'),
    color: '#333333',
    fontWeight: '400',
  },
  radioContainer: {
    padding: wp('1%'),
  },
  radioButton: {
    width: wp('5%'),
    height: wp('5%'),
    borderRadius: wp('2.5%'),
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#283593',
  },
  radioButtonInner: {
    width: wp('2.5%'),
    height: wp('2.5%'),
    borderRadius: wp('1.25%'),
    backgroundColor: '#283593',
  },
  priceDetails: {
    backgroundColor: '#ffffff',
    borderRadius: wp('3%'),
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('2%'),
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp('1.5%'),
  },
  priceLabel: {
    fontSize: wp('4%'),
    color: '#6b7280',
    fontWeight: '400',
  },
  priceValue: {
    fontSize: wp('4%'),
    color: '#333333',
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: hp('1%'),
  },
  totalLabel: {
    fontSize: wp('4.2%'),
    color: '#333333',
    fontWeight: '600',
  },
  totalValue: {
    fontSize: wp('4.2%'),
    color: '#333333',
    fontWeight: '600',
  },
  buttonContainer: {
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2.5%'),
  },
  placeOrderButton: {
    backgroundColor: '#283593',
    borderRadius: wp('3%'),
    paddingVertical: hp('2.2%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeOrderText: {
    color: '#ffffff',
    fontSize: wp('4.5%'),
    fontWeight: '600',
  },
});

export default Checkoutpage;
