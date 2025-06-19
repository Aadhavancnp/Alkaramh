import React, { useState, useContext, useCallback } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AuthContext from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import ChangePasswordModal from './ChangePasswordModal';

const Profile = () => {
  const navigation = useNavigation();
  const authContext = useContext(AuthContext);

  const [user, setUser] = useState({
    name: '',
    mobile: '',
    email: '',
    dateOfBirth: '',
    imageUri: '', // ✅ imageUri for profile image
  });

  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] = useState(false);

  // ✅ Load profile every time screen is focused
  useFocusEffect(
    useCallback(() => {
      const loadProfile = async () => {
        try {
          const storedUser = await AsyncStorage.getItem('userProfile');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            // Default fallback user
            setUser({
              name: 'Sivakumar',
              mobile: '9150203344',
              email: '',
              dateOfBirth: '',
              imageUri: '',
            });
          }
        } catch (error) {
          console.error('Failed to load profile:', error);
        }
      };

      loadProfile();
    }, [])
  );

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userProfile');
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.firsthalf}>
        <View style={styles.firsthalfinner}>
          <Image
            style={styles.profilepic}
            source={
              user.imageUri
                ? { uri: user.imageUri }
                : require('../../assets/person.png')
            }
          />
          <View style={styles.profiledetail}>
            <Text style={styles.name}>{user?.name || 'Guest User'}</Text>
            <Text style={styles.email}>{user?.email || 'Not updated'}</Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.secondhalf}>
          <Text style={styles.sectionTitle}>Account Settings</Text>

          <ListItem icon="person-outline" label="Personal Information" onPress={() => navigation.navigate('PersonalInfomation')} />
        {/*  <ListItem icon="lock-closed-outline" label="Change Password" onPress={() => setIsChangePasswordModalVisible(true)} /> */}
          <ListItem icon="notifications-outline" label="Notification Preferences" />

          <Text style={styles.sectionTitle}>Orders</Text>
          <ListItem icon="cube-outline" label="Your Orders" onPress={() => navigation.navigate('OrderHistoryScreen')} />
          <ListItem icon="heart-outline" label="Wishlist" onPress={() => navigation.navigate('WishlistScreen')} />
          <ListItem icon="map-outline" label="Address Book" />

          <Text style={styles.sectionTitle}>More</Text>
          <ListItem icon="information-circle-outline" label="About" onPress={() => navigation.navigate('AboutScreen')} />
          <ListItem icon="sync-outline" label="Check App Updates" />
          <ListItem icon="help-circle-outline" label="Help" />
          <ListItem icon="settings-outline" label="Settings" />
          <ListItem icon="log-out-outline" label="Logout" onPress={handleLogout} />
        </View>
      </ScrollView>

      <ChangePasswordModal
        visible={isChangePasswordModalVisible}
        onClose={() => setIsChangePasswordModalVisible(false)}
      />
    </View>
  );
};

interface ListItemProps {
  icon: string;
  label: string;
  onPress?: () => void;
}

const ListItem: React.FC<ListItemProps> = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.item} onPress={onPress} disabled={!onPress}>
    <Icon name={icon} type="ionicon" size={22} color="#283593" />
    <Text style={styles.itemText}>{label}</Text>
    <Icon name="chevron-forward-outline" type="ionicon" size={22} color="#999" />
  </TouchableOpacity>
);

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  firsthalf: {
    height: hp("25%"),
    backgroundColor: "#283593",
    justifyContent: "center",
    paddingHorizontal: wp("5%"),
  },
  firsthalfinner: {
    paddingTop: wp("10%"),
    flexDirection: "row",
    alignItems: "center",
  },
  profilepic: {
    width: wp("18%"),
    height: wp("18%"),
    borderRadius: wp("9%"),
    backgroundColor: "#ccc",
    marginRight: wp("5%"),
  },
  profiledetail: {
    flex: 1,
  },
  name: {
    fontSize: wp("5%"),
    fontWeight: "bold",
    color: "#fff",
  },
  email: {
    fontSize: wp("3.8%"),
    color: "#d1d1f7",
  },
  secondhalf: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: wp("5%"),
  },
  sectionTitle: {
    marginTop: hp("2%"),
    marginBottom: hp("1%"),
    fontSize: hp("2%"),
    fontWeight: "600",
    color: "#333",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp("1.5%"),
    borderBottomColor: "#e0e0e0",
  },
  itemText: {
    flex: 1,
    marginLeft: wp("4%"),
    fontSize: hp("2%"),
    color: "#222",
  },
  scrollContent: {
    paddingBottom: hp("10%"),
  },
});
