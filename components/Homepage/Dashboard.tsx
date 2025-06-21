import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-elements';
import { Home } from './Home';
import Profile from '../Profile/Profile';
import WishlistScreen from '../Profile/WishlistScreen';
import Cart from '../Cart/Cart';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Products from '../Products/Products';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NotificationScreen from './notofication';
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Tab = createBottomTabNavigator();




export default function Dashboard() {


  useFocusEffect(
  React.useCallback(() => {
    const onBackPress = () => {
      Alert.alert(
        'Exit App',
        'Are you sure you want to quit the app?',
        [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: () => BackHandler.exitApp(), // 👈 quit app if user confirms
          },
        ],
        { cancelable: false }
      );
      return true; // prevent default back action
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => backHandler.remove();
  }, [])
);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
  
          paddingTop: hp('1%'),
          height: hp('10%'),
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#ddd',
        },
        tabBarIcon: ({ focused }) => {
          let iconName = '';
          let label = '';
          let iconColor = focused ? '#2d46eb' : '#999';

          switch (route.name) {
            case 'Home':
              iconName = 'home';
              label = 'Home';
              break;
            case 'Wishlist':
              iconName = 'heart';
              label = 'Wishlist';
              break;
            case 'Cart':
              iconName = 'shopping-cart';
              label = 'Cart';
              break;
            case 'Profile':
              iconName = 'user';
              label = 'Profile';
              break;
            
          }

          return (
            <View style={[styles.tabItem, focused && styles.activeTab]}>
              <View style={[styles.tabContent, focused && styles.activeContent]}>
                <Icon
                  name={iconName}
                  type="font-awesome"
                  color={iconColor}
                  size={24}
                />
                {focused && <Text style={styles.activeLabel}>{label}</Text>}
              </View>
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={Home}    initialParams={{ showCleared: false }} 
/>
      <Tab.Screen name="Wishlist" component={WishlistScreen} />
      <Tab.Screen name="Cart" component={Cart} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    width: wp('20%'),
    paddingHorizontal: wp('2%'),
    
  },
  activeTab: {
    width: wp('25%'),
    height: hp('6%'),
    backgroundColor: '#e8edff',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeLabel: {
    paddingLeft: wp('2%'),
    fontSize: 12,
    color: '#2d46eb',
    fontWeight: '600',
  },
});