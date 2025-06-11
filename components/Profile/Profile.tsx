import React, { useState, useContext } from 'react'; // Import useContext
import { View, StyleSheet, Text,Image ,TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import AuthContext from '../../context/AuthContext'; // Import AuthContext
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Footer from '../../Utils/Footer/Footer';
import ChangePasswordModal from './ChangePasswordModal';

const Profile = () => {
  const navigation = useNavigation<any>();
  const authContext = useContext(AuthContext);
  const { user, logoutAction } = authContext || {};

  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] = useState(false);


  const handleLogout = async () => {
    if (logoutAction) {
      try {
        await logoutAction();
        // Navigation to Login screen might be handled by a root navigator
        // listening to auth state, or can be explicit here.
        navigation.navigate('Login'); 
      } catch (e) {
        console.error("Logout failed", e);
        Alert.alert("Error", "Logout failed. Please try again.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.firsthalf}>
          <View style={styles.firsthalfinner}>
            <View style={styles.profilepic}>
             <Image style={styles.profilepic} source={require('../../assets/person.png')} />
              
            </View>
            <View style={styles.profiledetail}>
          {/*    <Text style={styles.name}>{user?.name || 'Guest User'}</Text> */}
           {/*   <Text style={styles.email}>{user?.email || 'Not logged in'}</Text> */}
           <Text style={styles.name}>Sivakumar S</Text>
           <Text style={styles.email}>Not updated</Text>
            </View>
          </View>
        </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        

        <View style={styles.secondhalf}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <ListItem icon="person-outline" label="Personal Information" onPress={()=>navigation.navigate('PersonalInfomation')}/>
          {user && ( // Only show Change Password if user is logged in
            <ListItem
              icon="lock-closed-outline"
              label="Change Password"
              onPress={() => setIsChangePasswordModalVisible(true)}
            />
          )}
          <ListItem
            icon="notifications-outline"
            label="Notification Preferences"
          />

          <Text style={styles.sectionTitle}>Orders</Text>
          <ListItem 
            icon="cube-outline" 
            label="Your orders" 
            onPress={() => user ? navigation.navigate('OrderHistoryScreen') : navigation.navigate('Login')}
          />
          <ListItem 
            icon="heart-outline" 
            label="Wishlist" 
            onPress={() => user ? navigation.navigate('WishlistScreen') : navigation.navigate('Login')}
          />
          <ListItem icon="map-outline" label="Address book" />

          <Text style={styles.sectionTitle}>More</Text>
          <ListItem icon="information-circle-outline" label="About" />
          <ListItem icon="sync-outline" label="Check app updates" />
          <ListItem icon="help-circle-outline" label="Help" />
          <ListItem icon="settings-outline" label="Settings" />
          {user && ( // Only show Logout if user is logged in
            <ListItem 
              icon="log-out-outline" 
              label="Logout" 
              onPress={handleLogout} 
            />
          )}
        </View>
      </ScrollView>
      <Footer />
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
  onPress?: () => void; // Make onPress prop optional
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
    backgroundColor: "rgba(40, 53, 147, 1)",
    justifyContent: "center",
    paddingHorizontal: wp("5%"),
  },
  firsthalfinner: {
    paddingTop:wp('10%'),
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
  }, avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  secondhalf: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    borderTopLeftRadius: wp("28%"),
    borderTopRightRadius: wp("28%"),
    paddingHorizontal:wp('5%')
    
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
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  itemText: {
    flex: 1,
    marginLeft: wp("4%"),
    fontSize: hp("2%"),
    color: "#222",
  },
  scrollContent: {
    paddingBottom: hp('10%'), 
  },
});

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6E9F0',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    flexDirection: "row",
    padding: 8,
  },
  backText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  seeAllText: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
   avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4F46E5',
  },
  secondaryButtonText: {
    color: '#4F46E5',
    fontSize: 16,
    fontWeight: '600',
  },
});
