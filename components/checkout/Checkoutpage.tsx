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
  const [selectedPayment, setSelectedPayment] = useState('debit'); // Default selected payment method

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <View>
            <Ionicons name="chevron-back" size={24} />
          </View>
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
            
            <TouchableOpacity
              style={styles.paymentOption}
              onPress={() => setSelectedPayment('debit')}
            >
              <View style={styles.paymentOptionLeft}>
                <FontAwesome style={styles.paymentIcon} name='credit-card'/>
                <Text style={styles.paymentLabel}>Debit Card</Text>
              </View>
              <View style={styles.radioContainer}>
                <View style={[
                  styles.radioButton,
                  selectedPayment === 'debit' && styles.radioButtonSelected
                ]}>
                  {selectedPayment === 'debit' && <View style={styles.radioButtonInner} />}
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.paymentOption}
              onPress={() => setSelectedPayment('credit')}
            >
              <View style={styles.paymentOptionLeft}>
                <FontAwesome style={styles.paymentIcon} name='credit-card'/>
                <Text style={styles.paymentLabel}>Credit Card</Text>
              </View>
              <View style={styles.radioContainer}>
                <View style={[
                  styles.radioButton,
                  selectedPayment === 'credit' && styles.radioButtonSelected
                ]}>
                  {selectedPayment === 'credit' && <View style={styles.radioButtonInner} />}
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.paymentOption}
              onPress={() => setSelectedPayment('cash')}
            >
              <View style={styles.paymentOptionLeft}>
                <Image style={styles.paymentIcon} source={require('../../assets/Vector.png')} />
                <Text style={styles.paymentLabel}>Cash on delivery</Text>
              </View>
              <View style={styles.radioContainer}>
                <View style={[
                  styles.radioButton,
                  selectedPayment === 'cash' && styles.radioButtonSelected
                ]}>
                  {selectedPayment === 'cash' && <View style={styles.radioButtonInner} />}
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Price Details Section */}
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

      {/* Place Order Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.placeOrderButton}>
          <Text style={styles.placeOrderText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('2%'),
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    marginRight: 15,
  },
  backIcon: {
    fontSize: 24,
    color: '#333333',
    fontWeight: '300',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 0,
    paddingTop: 16,
  },
  blueLine: {
    width: 4,
    height: 20,
    backgroundColor: '#283593',
    marginRight: 12,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#283593',
  },
  paymentOptions: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 8,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('3%'),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  paymentOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  paymentLabel: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '400',
  },
  radioContainer: {
    padding: 4,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#283593',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#283593',
  },
  priceDetails: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 0,
    paddingVertical: hp('2%'),
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp('2%'),
  },
  priceLabel: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '400',
  },
  priceValue: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '600',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  placeOrderButton: {
    backgroundColor: '#283593',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeOrderText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default Checkoutpage;
