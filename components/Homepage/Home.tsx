import { AntDesign, Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Image,
  NativeSyntheticEvent,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TextInputFocusEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Footer from '../../Utils/Footer/Footer';
import FilterPopup from './filterui';
import TradingCard from './spotlighcard';

type NavigationProps = {
  navigation: {
    navigate: (screen: string, params?: any) => void;
  };
};

const categories = [
  { id: 1, name: 'All', active: true, image: require('../../assets/all.png') },
  { id: 2, name: 'Feed', active: false, image: require('../../assets/feed.png') },
  { id: 3, name: 'Protein', active: false, image: require('../../assets/protein.jpg') },
  { id: 4, name: 'Salts', active: false, image: require('../../assets/salts.jpg') },
  { id: 5, name: 'Millet', active: false, image: require('../../assets/millet.png') },
  { id: 6, name: 'Alfalfa', active: false, image: require('../../assets/alfalfa.jpg') },
  { id: 7, name: 'Tibin', active: false, image: require('../../assets/tibin.png') },
  { id: 8, name: 'Rodhes', active: false, image: require('../../assets/feed.png') },
];

const Home: React.FC<NavigationProps> = ({ navigation }) => {
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    previouslyOrdered: false,
    ratings: false,
    offers: false,
  });

  const [products, setProductsList] = useState([
    {
      id: 1,
      image: require('../../assets/wheat.png'),
      name: 'Wheat Straw',
      price: 'QAR 12',
      rating: 4.7,
      liked: false,
    },
    {
      id: 2,
      image: require('../../assets/wheat.png'),
      name: 'Wheat Straw ',
      price: 'QAR 12',
      rating: 4.7,
      liked: false,
    },
    {
      id: 3,
      image: require('../../assets/wheat.png'),
      name: 'Wheat Straw',
      price: 'QAR 12',
      rating: 4.7,
      liked: false,
    },
  ]);

  const toggleFavourite = (id: number) => {
    const updated = products.map(product =>
      product.id === id ? { ...product, liked: !product.liked } : product
    );
    setProductsList(updated);
  };

  const handleProductNavigation = () => {
    navigation.navigate('Products');
  };

  const handleNotification = () => {
    navigation.navigate('NotificationScreen');
  };

  const toggleFilter = (key: keyof typeof filters) => {
    setFilters(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleInputFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    navigation.navigate('SearchScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <AntDesign style={styles.searchIcon} name="search1" />
            <TextInput
              placeholder="Search deals, products & more..."
              style={styles.searchInput}
              placeholderTextColor="#999"
              onFocus={handleInputFocus}
            />
          </View>
          <TouchableOpacity style={styles.notificationButton} onPress={handleNotification}>
            <View style={styles.notificationIcon}>
              <AntDesign style={styles.notificationText} name="bells" />
              <View style={styles.notificationDot} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.categoriesContainer}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Explore category</Text>
              <TouchableOpacity onPress={handleProductNavigation}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {categories.map(category => (
                <TouchableOpacity
                  key={category.id}
                  style={[styles.categoryItem, category.active && styles.categoryItemActive]}
                >
                  <View style={styles.categoryIcon}>
                    <Image style={styles.categoryIconText} source={category.image} />
                  </View>
                  <Text
                    style={[styles.categoryName, category.active && styles.categoryNameActive]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        <View style={styles.filterBar}>
          <ScrollView showsHorizontalScrollIndicator={false} horizontal>
            <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilter(true)}>
              <Feather name="sliders" color="black" style={styles.filterIcon} />
              <Text style={styles.filterText}>Filters</Text>
              <Text style={styles.filterArrow}>▼</Text>
            </TouchableOpacity>
            <FilterPopup visible={showFilter} onClose={() => setShowFilter(false)} />

            {Object.entries(filters).map(([key, value]) => (
              <TouchableOpacity
                key={key}
                style={value ? styles.filterOptionclicked : styles.filterOption}
                onPress={() => toggleFilter(key as keyof typeof filters)}
              >
                <Text style={styles.filterOptionText}>
                  {key === 'previouslyOrdered'
                    ? 'Previously Ordered'
                    : key === 'ratings'
                    ? 'Ratings 4.0+'
                    : 'Great offers'}
                </Text>
                {value && <AntDesign name="close" style={styles.XArrow} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>RECOMMENDED FOR YOU</Text>
            <TouchableOpacity onPress={handleProductNavigation}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productsScrollView}>
            {products.map(product => (
              <TouchableOpacity
                key={product.id}
                style={styles.productCard}
                onPress={() => navigation.navigate('ProductIndetail', { product })}
              >
                <TouchableOpacity style={styles.likeButton} onPress={() => toggleFavourite(product.id)}>
                  <AntDesign
                    name={product.liked ? 'heart' : 'hearto'}
                    style={styles.likeIcon}
                    color={product.liked ? 'red' : 'black'}
                  />
                </TouchableOpacity>

                <View style={styles.productImageContainer}>
                  <Image source={product.image} style={styles.productimage} />
                  <View style={styles.ratingContainer}>
                    <Text style={styles.rating}>{product.rating}</Text>
                    <AntDesign style={styles.star} name="star" />
                  </View>
                </View>

                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productPrice}>{product.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View>
          <Text style={styles.spotlightTitle}>IN THE SPOTLIGHT</Text>
          <TradingCard 
            imageSource={require('../../assets/wheat.png')}
           
          />
        </View>
      </ScrollView>

      <Footer />
    </SafeAreaView>
  );
};

export default Home;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
    paddingTop: hp('1%'),
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    fontSize: wp('5%'),
    fontWeight: '600',
    color: '#4A90E2',
  },
  time: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#000',
    position: 'absolute',
    left: wp('45%'),
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signalBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginRight: wp('2%'),
  },
  bar: {
    width: wp('0.8%'),
    backgroundColor: '#000',
    marginRight: wp('0.3%'),
  },
  bar1: { height: hp('0.8%') },
  bar2: { height: hp('1.2%') },
  bar3: { height: hp('1.6%') },
  bar4: { height: hp('2%') },
  battery: {
    width: wp('6%'),
    height: hp('1.5%'),
    backgroundColor: '#000',
    borderRadius: wp('0.5%'),
  },
  content: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth:1,
    borderColor: '#C0C0C0',
    borderRadius: wp('2%'),
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
  },
  searchIcon: {
    fontSize: wp('4%'),
    marginRight: wp('2%'),
  },
  searchInput: {
    flex: 1,
    fontSize: wp('3.5%'),
    color: '#333',
  },
  notificationButton: {
    marginLeft: wp('3%'),
  },
  notificationIcon: {
    borderWidth:1,
    borderRadius:wp('10%'),
    padding:wp('1%'),
    position: 'relative',
    borderColor:'#E7E7E7'
  },
  notificationText: {
    color:'#4959AE',
    fontSize: wp('6%'),
  },
  notificationDot: {
    position: 'absolute',
    top: hp('.5%'),
    right: wp('1%'),
    width: wp('2.5%'),
    height: wp('2.5%'),
    backgroundColor: '#4959AE',
    borderRadius: wp('2%'),
  },
  section: {
    paddingHorizontal: wp('5%'),
    marginBottom: hp('3%'),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  sectionTitle: {
    fontSize: wp('4%'),
    fontWeight: '600',
    color: '#333',
  },
  spotlightTitle: {
    fontSize: wp('3.5%'),
    fontWeight: '500',
    color: '#999',
    marginBottom: hp('2%'),
    paddingLeft:wp("4%")
  },
  seeAll: {
    fontSize: wp('3.5%'),
    color: '#283593',
    fontWeight: '500',
  },
  categoriesContainer: {
    flexDirection: 'row',
    overflow: 'hidden',
   
  },
  categoryItem: {
    marginHorizontal:wp('3%'),
    alignItems: 'center',
    flex: 1,
  },
  categoryItemActive: {
    // Active category styling handled by text color
  },
  categoryIcon: {
    width: wp('17%'),
    height: wp('17%'),
    borderRadius: wp('9.5%'),
    
    backgroundColor: '#fffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  categoryIconText: {
    borderRadius:wp('9.5'),
    width:wp('18%'),
    height:wp('18%')
  },
  categoryName: {
    fontSize: wp('3%'),
    color: '#666',
    fontWeight: '500',
  },
  categoryNameActive: {
    color: '#333',
    fontWeight: '600',
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1%'),
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth:wp('.3%'),
    borderColor: '#EFEFEF',
    
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('1%'),
    borderRadius: wp('2%'),
    marginRight: wp('3%'),
  },
  filterIcon: {
    fontSize: wp('3%'),
    marginRight: wp('1%'),

  },
  filterText: {
    fontSize: wp('3%'),
    color: '#333',
    marginRight: wp('1%'),
  },
  filterArrow: {
    fontSize: wp('2%'),
    color: '#666',
  },
  XArrow:{
    fontSize: wp('5%'),
    color: '#666',
    
  },
  filterOption: {
    borderRadius:wp('2%'),
    borderWidth:wp('.3%'),
    borderColor: '#EFEFEF',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('1%'),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginRight: wp('3%'),
   
  },
  filterOptionclicked: {
    borderRadius:wp('2%'),
    borderWidth:wp('.3%'),
    borderColor: '#283593',
    backgroundColor: '#E5E8F8',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('1%'),
    alignItems: 'center',
    flexDirection: 'row',
  },
  filterOptionText: {
    fontSize: wp('3%'),
    color: '#666',
    paddingRight: wp('5%'),
  },
  productsScrollView: {
    marginHorizontal: -wp('5%'),
    paddingHorizontal: wp('5%'),
  },
  productimage:{
    marginTop:wp('10%'),
    width:wp('30%'),
    height:hp('20%'),
    zIndex:1

  },
  productCard: {
    width: wp('40%'),
    backgroundColor: '#fff',
    borderRadius: 30,
    marginRight: wp('8%'),
   
  },
  likeButton: {
    
    position: 'absolute',
    top: hp('1%'),
    right: wp('3%'),
    zIndex: 2,
    padding:wp('1%'),
    opacity:0.5,
    backgroundColor:'#ffff',
    borderRadius:100,
  },
  likeIcon: {
    
    fontSize: wp('4%'),
  },
  productImageContainer: {
    height: hp('20%'),
    width:hp("20%"),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:wp('4%'),
    backgroundColor: '#e8e8e8',
  },
  productImagePlaceholder: {
    fontSize: wp('12%'),
  },
  productInfo: {
    backgroundColor:'',
    padding: wp('3%'),
  },
  ratingContainer: {
    zIndex:3,
    borderRadius:5,
    flexDirection:'row',
    backgroundColor:'#ffff',
    padding:wp('2%'),
    marginBottom:hp('4%'),
    right:wp('12%'),
    bottom:hp('3%')
  },
  rating: {
    fontSize: wp('3%'),
    fontWeight: '600',
    color: '#333',
    
  },
  star: {
    fontSize: wp('3%'),
    color:'#1E653D'
  },
  productName: {
    fontSize: wp('3.5%'),
    fontWeight: '600',
    color: '#333',
    marginBottom: hp('0.5%'),
  },
  productPrice: {
    fontSize: wp('3%'),
    color: '#666',
  },
  spotlightImageContainer: {
    height: hp('20%'),
    backgroundColor: '#e8f5e8',
    borderRadius: wp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  spotlightImagePlaceholder: {
    fontSize: wp('4%'),
    color: '#4CAF50',
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('5%'),
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: hp('1%'),
  },
  navItemActive: {
    // Active nav styling
  },
  navIcon: {
    fontSize: wp('5%'),
    marginBottom: hp('0.5%'),
  },
  navText: {
    fontSize: wp('2.5%'),
    color: '#666',
  },
  navTextActive: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  homeIndicator: {
    width: wp('35%'),
    height: hp('0.5%'),
    backgroundColor: '#000',
    borderRadius: wp('1%'),
    alignSelf: 'center',
    marginBottom: hp('1%'),
  },
});
