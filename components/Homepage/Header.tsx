import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";

import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { AntDesign } from "@expo/vector-icons";
import { homeStyles as styles } from "./Homestyles"; // Assuming styles are defined in Home.tsx
import FilterBar from "./Filterbar";

const Header = () => {

    const navigation = useNavigation();
    const handleInputFocus = () => {
      navigation.navigate('SearchScreen');
    };
    const handleNotification = () => {
      navigation.navigate('NotificationScreen');
    };
  
  return (
  <View style={styles.content}>
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <AntDesign style={styles.searchIcon} name="search1" />
              <TextInput
                placeholder="Search deals, products & more..."
                style={styles.searchInput}
                placeholderTextColor="#999"
                onFocus={() => navigation.navigate("SearchScreen")}
              />
            </View>
            <TouchableOpacity style={styles.notificationButton} onPress={handleNotification}>
              <View style={styles.notificationIcon}>
                <AntDesign style={styles.notificationText} name="bells" />
                <View style={styles.notificationDot} />
              </View>
            </TouchableOpacity>
          </View>
            
        </View>
      
      )};


export default Header;