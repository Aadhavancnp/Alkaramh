import React, { useState, useEffect } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  BackHandler,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  useRoute,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import ListProduct from "./listproduct";
import { API_URL } from "../../api.json";
import HeaderSection from "./HearderProduct";

const Products = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();

  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("All products");

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate("Home", { showCleared: false });
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );
      return () => backHandler.remove();
    }, [])
  );

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/categories`);
      const json = await res.json();
      const apiCategories = json.data || [];

      const defaultAll = {
        _id: "all",
        name: { en: "All products" },
        isLocal: true,
      };

      const combined = [defaultAll, ...apiCategories];
      setCategories(combined);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // 🔁 Set active category from route if passed
  useEffect(() => {
    if (route.params?.selectedCategory) {
      setActiveCategory(route.params.selectedCategory.trim());
    } else {
      setActiveCategory("All products");
    }
  }, [route.params]);

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: "#F3F4F8", flex: 1 }}>
    
   <HeaderSection/>
    <View style={styles.searchContainer}>
           <Ionicons name="search-outline" size={20} color="gray" style={{ marginRight: 6 }} />
           <TextInput
             placeholder="Search products here..."
             placeholderTextColor="#999"
             style={styles.searchInput}
           />
         </View>
   
      <View style={styles.tabsContainers}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat._id}
              onPress={() => setActiveCategory(cat.name.en)}
            >
              <Text
                style={[
                  styles.tabs,
                  activeCategory === cat.name.en && styles.activeTabs,
                ]}
              >
                {cat.name?.en}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={{backgroundColor:'white'}}>    
      <Text style={{ fontSize: 20, fontWeight: "bold", margin: hp('1%') }}>
        {activeCategory || "All Products"}
      </Text>

      <ListProduct categoryId={activeCategory} searchQuery={searchQuery} />
     </View>
    </SafeAreaView>
  );
};



// (Your styles go here — same as before)

export default Products;
const styles = StyleSheet.create({
  container: {
    marginTop: hp("5%"),
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp("3%"),
    marginHorizontal: wp("3%"),
    backgroundColor:'#FFFFF'
  },
  headerLeft:{
    
  },

  selectedTabText: {
    fontSize: 20,
    marginBottom: hp("2%"),
    color: "#333",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    marginLeft: wp("1%"),
  },
  ratingBox: {
    backgroundColor: "#156739",
    borderRadius: 5,
    padding: 5,
    left: wp("12%"),
    color: "#6D7079",
  },
  ratingText: {
    color: "white",
    fontWeight: "bold",
  }
  ,
   ratingText2: {
    fontSize: 8,
    top: hp("3.0%"),
  },
  clockicon: {
    top: hp("2.3%"),
    left: wp("5%"),
  },
 subtext: {
  fontSize: 14,
  color: "gray",
},
  badgeText:{
   fontSize: 12,
   color:"#6D717C"
  },
  badgeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    margin: wp("5%"),
  },
  badge: {
    backgroundColor: "#F1F1F1",
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 8,
    marginBottom: 8,
    flexDirection: "row",
  },
 
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    borderRadius: 10,
    marginHorizontal: wp("2%"),
    paddingHorizontal: wp("4%"),
    paddingVertical:hp('1.5%'),
    marginVertical:hp('2%'),
    borderWidth: .5,
    borderColor: "#C0C0C0",
  },
  searchInput: {
    backgroundColor: "#FFFFF",
    marginLeft: 10,
    flex: 1,
  
  },
  tabsContainers: {
    paddingVertical:hp('1%'),
    paddingHorizontal: wp("5%"),
       
    backgroundColor: "#ffffffd8",
    width: wp("100%"),
  },
  tabs: {
    marginRight: 20,
    color: "#555",
  },
  activeTabs: {
    fontWeight: "bold",
    borderBottomWidth: 2,
    borderColor: "#007bff",
    paddingBottom: hp("2%"),
  },
  productList: {
    paddingHorizontal: wp("5%"),
    
  },
  
  productCard: {
    flexDirection: "row",
    marginBottom: hp("2%"),
    backgroundColor: "#fff",
    borderRadius: 16,
    elevation: 4,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  productImage: {
    width: 80,
    height: 70,
    borderRadius: 8,
    marginRight: 10,
  },
  imageContainer: {
    position: "relative",
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  productRating: {
    fontSize: 12,
    color: "#b0aa05",
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    marginVertical: 2,
  },
  productDesc: {
    fontSize: 12,
    color: "#666",
  },
  searchheder:{

    color:"#F3F4F8",
    backgroundColor:"#F3F4F8",
    paddingVertical: hp("2%"),
    paddingHorizontal: wp("2%"),
  },
  heart: {
    position: "absolute",
    top: hp("1.1%"),
    right: wp("6%"),
    zIndex: 1,
    padding: 5, // Added padding to make it easier to press
  },
  heartIcon: {
    // New style for just the icon, if needed, or merge with heartButton
    // No specific styles needed here if heartButton handles positioning and padding
  },
  ultraProductCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    marginBottom: hp("2.5%"),
    marginTop: hp("2%"),
    marginHorizontal: wp("0%"),
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    padding: 0,
    width: "100%",
    alignSelf: "center",
    overflow: "hidden",
  },
  ultraImageContainer: {
    width: "100%",
    height: hp("22%"),
    backgroundColor: "#f4f4f4",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  ultraProductImage: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  ultraHeart: {
    position: "absolute",
    top: 12,
    right: 16,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  ultraProductInfo: {
    padding: 16,
  },
  ultraProductName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 4,
  },
  ultraRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
    gap: 6,
  },
  ultraProductPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2A3B8F",
    marginLeft: 6,
  },
  ultraProductCategory: {
    fontSize: 13,
    color: "#888",
    marginLeft: 6,
  },
  ultraProductRating: {
    fontSize: 13,
    color: "#f5c518",
    marginLeft: 6,
    fontWeight: "bold",
  },
  ultraProductStock: {
    fontSize: 13,
    color: "#888",
    marginLeft: 8,
  },
  ultraProductDesc: {
    fontSize: 13,
    color: "#666",
    marginTop: 6,
  },
  timeContainer: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: hp("2%"),
  marginLeft: wp("5%"),
},


});