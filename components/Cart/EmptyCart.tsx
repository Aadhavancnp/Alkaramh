import Footer from "@/Utils/Footer/Footer";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Cartstyles as styles } from "./CartStyleSheet";

export const EmptyCart = () => {
  const navigation: any = useNavigation();

  return (
    <View style={styles.emptyCartContainer}>
      <View style={styles.emptyCartCard}>
        <Image
          source={require("../../assets/cart_man.png")}
          style={styles.emptyCartImage}
        />
        <Text style={styles.emptyCartTitle}>Your cart is empty</Text>
        <Text style={styles.emptyCartSubtitle}>
          Looks like you haven't added any items to the cart
        </Text>
        <TouchableOpacity
          style={styles.exploreButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.exploreButtonText}>Explore Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};