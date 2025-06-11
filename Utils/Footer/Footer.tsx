import { useNavigation, useRoute } from "@react-navigation/native";
import * as React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon } from "react-native-elements";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const Footer = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Map "Products" to "Home" for footer highlighting
  const currentRoute = route.name === "Products" ? "Home" : route.name;

  const tabs = [
    { name: "Home", icon: "home", label: "Home" },
    { name: "WishlistScreen", icon: "heart", label: "Wishlist" },
    { name: "Cart", icon: "shopping-cart", label: "Cart" },
    { name: "Profile", icon: "user", label: "Profile" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.footer}>
        {tabs.map((tab) => {
          const isActive = currentRoute === tab.name;

          return (
            <TouchableOpacity
              key={tab.name}
              style={[styles.tabItem, isActive && styles.activeTab]}
              onPress={() => navigation.navigate(tab.name as never)}
            >
              <Icon
                name={tab.icon}
                type="font-awesome"
                color={isActive ? "#2d46eb" : "#999"}
                size={24}
              />
              {isActive && (
                <Text style={styles.activeLabel}>
                  {tab.label}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export default Footer;

const styles = StyleSheet.create({
  safeArea: {
   
    backgroundColor: "#fff",
  },
  footer: {
    height: hp('6%'),
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 50,
  },
  activeTab: {
    padding:wp('3%'),
    borderWidth: 1,
    borderColor: "#2d46eb",
    backgroundColor: "#e8edff",
    flexDirection:'row'
  },
  activeLabel: {
    paddingHorizontal:wp('1%'),
    fontSize: 12,
    color: "#2d46eb",
   
    fontWeight: "600",
  },
});
