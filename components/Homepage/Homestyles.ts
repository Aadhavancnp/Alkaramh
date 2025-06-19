import { StyleSheet } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";


export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: hp('2%'),
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
    paddingVertical: hp('1.2%'),
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
    fontSize: wp('3%'),
    color: '#666',
    
  },
  filterOption: {
    borderRadius:wp('2%'),
    borderWidth:wp('.3%'),
    borderColor: '#EFEFEF',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1%'),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginRight: wp('2%')
   
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
    marginRight: wp('2%'),
    
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
    marginRight: wp('5%'),
    justifyContent: 'space-between',
   
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
    right:wp('10%'),
    bottom:hp('4%')
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