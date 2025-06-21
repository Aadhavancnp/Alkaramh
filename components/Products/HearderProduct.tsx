import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

const HeaderSection = () => {
    const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {/* Title Row */}
      <View style={styles.rowBetween}>
        <View style={styles.row}>
          <TouchableOpacity onPress={()=> navigation.navigate("Home", { showCleared: false })}>
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Al Karamh Trading</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>4.8</Text>
          <Ionicons name="star" size={12} color="white" />
        </View>
      </View>

      {/* Time & Rating Count */}
      <View style={styles.rowBetween}>
        <View style={styles.row}>
          <Ionicons name="time-outline" size={14} color="gray" />
          <Text style={styles.timeText}>120 – 150 mins</Text>
        </View>
        <Text style={styles.ratingCount}>5k ratings</Text>
      </View>

      {/* Tags */}
      <View style={styles.tagsRow}>
  <View style={styles.tag}>
    <Ionicons name="checkmark" size={14} color="#1E9E6A" style={styles.tagIcon} />
    <Text style={styles.tagText}>Last 100 Orders Without Complaints</Text>
  </View>
  <View style={styles.tag}>
    <Ionicons name="checkmark" size={14} color="#1E9E6A" style={styles.tagIcon} />
    <Text style={styles.tagText}>Bestseller</Text>
  </View>
  <View style={styles.tag}>
    <Ionicons name="checkmark" size={14} color="#1E9E6A" style={styles.tagIcon} />
    <Text style={styles.tagText}>Frequently Reordered</Text>
  </View>
</View>


      {/* Search Box */}
    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp('4%'),
    paddingTop: hp('4%'),
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('0.8%'),
  },
  title: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    marginLeft: wp('2%'),
  },
  ratingContainer: {
    flexDirection: 'row',
    backgroundColor: '#156739',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 5,
    alignItems: 'center',
  },
  ratingText: {
    color: 'white',
    fontSize: wp('3.2%'),
    marginRight: 8,
  },
  timeText: {
    marginLeft: 4,
    fontSize: wp('3.2%'),
    color: 'gray',
  },
  ratingCount: {
    fontSize: wp('3%'),
    color: 'gray',
    
  },
  tagsRow: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginVertical: hp('1%'),
  gap: 6,
},
tag: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#F1F1F1',
  paddingVertical: 4,
  paddingHorizontal: 10,
  borderRadius: 20,
  marginRight: 6,
  marginBottom: 6,
},
tagIcon: {
  marginRight: 6,
},
tagText: {
  fontSize: wp('3.2%'),
  color: '#333',
},
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFF',
    borderColor:'#C0C0C0',
    borderRadius: wp('3%'),
    paddingVertical: hp('1%'),
    paddingHorizontal: 12,
    borderWidth:1,
    marginBottom: hp('1.5%'),
  },
  searchInput: {
    flex: 1,
    fontSize: wp('3.8%'),
  },
});

export default HeaderSection;
