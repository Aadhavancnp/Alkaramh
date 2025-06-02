import { useNavigation, useRoute } from "@react-navigation/native";
import * as React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon } from "react-native-elements";

const Footer = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const currentRoute = route.name;
  const tabs = [
    { name: "Home", icon: "home" },
    { name: "WishlistScreen", icon: "heart" },
    { name: "Cart", icon: "shopping-cart" },
    { name: "Profile", icon: "user" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.footer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.name}
            onPress={() => navigation.navigate(tab.name as never)}
          >
            <Icon
              name={tab.icon}
              type="font-awesome"
              color={currentRoute === tab.name ? "#2d46eb" : "#999"}
              size={24}
            />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const App = () => {
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
      {/* Screen content */}
      <Footer />
    </ScrollView>
  );
};

export default App;

const styles = StyleSheet.create({
  safeArea: {
  },
  footer: {
    height: 60,
    backgroundColor: "#fff", // Solid background color to prevent transparency
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    zIndex: 10,
  },
});
