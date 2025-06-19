import React from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Optional icon
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Footer from '@/Utils/Footer/Footer';
import { NavigationContainer } from '@react-navigation/native';

const SearchScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.fullScreenWhite}>
      <View style={styles.container}>
        <View style={styles.searchBar}>
          <TextInput
            placeholder="Search"
            placeholderTextColor="#999"
            style={styles.searchInput}
            autoFocus
          />
        </View>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
     {/* <View style={{top: hp('80%'), flex: 1}}>
        <Footer />
      </View> */}
    </SafeAreaView>
  );
};

export default SearchScreen;
const styles = StyleSheet.create({
  fullScreenWhite: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: hp('2%'),
    paddingHorizontal: wp('4%'),
  },
  container: {
    flexDirection: 'row',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('4%'),
    alignItems: 'center',
  },
  searchBar: {
    backgroundColor: '#F4F5F9',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: wp('0.5%'),
    borderColor: '#C0C0C0',
    borderRadius: wp('2%'),
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1%'),
  },
  searchIcon: {
    fontSize: wp('4%'),
    marginRight: wp('2%'),
  },
  searchInput: {
    flex: 1,
    fontSize: wp('4.5%'),
    color: '#000',
  },
  cancelText: {
    marginLeft: wp('3%'),
    color: '#2d46eb',
    fontSize: wp('4%'),
    fontWeight: '500',
  },
});
