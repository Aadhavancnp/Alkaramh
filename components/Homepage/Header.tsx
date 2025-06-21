import React from "react";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { homeStyles as styles } from "./Homestyles"; // Make sure Homestyles.ts exports `homeStyles`
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

const Header = () => {
  const navigation = useNavigation<any>();

  const handleInputFocus = () => {
    navigation.navigate("SearchScreen");
  };

  const handleNotification = () => {
    navigation.navigate("NotificationScreen");
  };

  return (
    <View style={styles.content}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <AntDesign style={styles.searchIcon} name="search1" size={18} color="#999" />
          <TextInput
            placeholder="Search deals, products & more..."
            style={styles.searchInput}
            placeholderTextColor="#999"
            onFocus={handleInputFocus}
          />
        </View>

        <TouchableOpacity style={styles.notificationButton} onPress={handleNotification}>
          <View style={styles.notificationIcon}>
            <Ionicons style={styles.notificationText} name="notifications-outline" size={22} color="#000" />
            <View style={styles.notificationDot} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
