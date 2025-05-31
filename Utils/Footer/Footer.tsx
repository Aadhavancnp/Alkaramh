import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-elements';

const Footer = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const currentRoute = route.name;

  const tabs = [
    { name: 'Home', icon: 'home' },
    { name: 'WishlistScreen', icon: 'heart' },
    { name: 'Cart', icon: 'shopping-cart' },
    { name: 'Profile', icon: 'user' },
  ];

  return (
    <View style={styles.container}>
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
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    position: 'absolute',
    bottom: 0,
    left: 0,
    paddingBottom: 20,
    paddingTop: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});
