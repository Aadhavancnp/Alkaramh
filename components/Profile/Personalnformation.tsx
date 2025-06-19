import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const ProfileScreen = () => {
  const navigation = useNavigation();

  const [user, setUser] = useState({
    name: '',
    mobile: '',
    email: '',
    dateOfBirth: '',
    imageUri: '',
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('userProfile');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
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
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const oldUserData = await AsyncStorage.getItem('userProfile');
      const oldUser = oldUserData ? JSON.parse(oldUserData) : {};

      const changes: string[] = [];
      if (oldUser.name !== user.name) changes.push('Name');
      if (oldUser.mobile !== user.mobile) changes.push('Mobile');
      if (oldUser.email !== user.email) changes.push('Email');
      if (oldUser.dateOfBirth !== user.dateOfBirth) changes.push('Date of Birth');
      if (oldUser.imageUri !== user.imageUri) changes.push('Profile Photo');

      if (changes.length === 0) {
        Toast.show({
          type: 'info',
          text1: 'No changes made',
          text2: 'Update at least one field.',
        });
        return;
      }

      await AsyncStorage.setItem('userProfile', JSON.stringify(user));

      Toast.show({
        type: 'success',
        text1: 'Profile Updated',
        text2: `${changes.join(', ')} updated successfully.`,
      });
    } catch (error) {
      console.error('Failed to save profile:', error);
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: 'Could not save your profile.',
      });
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Please allow media access to update profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setUser((prev) => ({ ...prev, imageUri: uri }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} />
            <Text style={styles.backText}>Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.headerBackground}></View>

        <View style={styles.profileWrapper}>
          <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
            <View style={styles.avatar}>
              {user.imageUri ? (
                <Image source={{ uri: user.imageUri }} style={styles.avatarImage} />
              ) : (
                <Image
                  style={styles.avatarImage}
                  source={require('../../assets/person.png')}
                />
              )}
            </View>
            <Text style={styles.changePhotoText}>Tap to change photo</Text>
          </TouchableOpacity>

          <ImageBackground
            source={require('../../assets/Union.png')}
            style={styles.formContainer}
            imageStyle={styles.backgroundImage}
          >
            {/* Name */}
            <View style={styles.inputWrapper}>
              <View style={{ backgroundColor: '#FFFFFF', paddingHorizontal: 10 }}>
                <Text style={styles.label}>Name</Text>
              </View>
              <View style={styles.inputGroup}>
                <TextInput
                  style={styles.input}
                  value={user.name}
                  onChangeText={(text) => setUser({ ...user, name: text })}
                />
              </View>
            </View>

            {/* Mobile */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Mobile</Text>
              <View style={styles.inputGroup}>
                <TextInput
                  style={styles.input}
                  value={user.mobile}
                  onChangeText={(text) => setUser({ ...user, mobile: text })}
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.inputWrapper}>
              <View style={styles.inputGroup}>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#888"
                  value={user.email}
                  onChangeText={(text) => setUser({ ...user, email: text })}
                />
                <Text style={styles.inlineText}>Change</Text>
              </View>
            </View>

            {/* DOB */}
            <View style={styles.inputWrapper}>
              <View style={styles.inputGroup}>
                <TextInput
                  style={styles.input}
                  placeholder="Date of birth"
                  placeholderTextColor="#888"
                  value={user.dateOfBirth}
                  onChangeText={(text) => setUser({ ...user, dateOfBirth: text })}
                />
                <Text style={styles.inlineText}>Change</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProfile}>
              <Text style={styles.updateButtonText}>Update Profile</Text>
            </TouchableOpacity>
          </ImageBackground>
        </View>
      </ScrollView>
      <Toast />
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6E9F0',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: wp('5%'),
    paddingTop: hp('2%'),
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 18,
    marginLeft: 8,
  },
  headerBackground: {
    marginTop: hp('10%'),
  },
  profileWrapper: {
    marginTop: -hp('10%'),
    paddingHorizontal: wp('5%'),
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: -hp('6%'),
    zIndex: 10,
  },
  avatar: {
    width: 130,
    height: 130,
    borderBottomLeftRadius: wp('30%'),
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  changePhotoText: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp('5%'),
    padding: wp('5%'),
    paddingTop: hp('8%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    overflow: 'hidden',
  },
  backgroundImage: {
    resizeMode: 'cover',
    borderRadius: wp('5%'),
    opacity: 0.2,
  },
  inputWrapper: {
    marginBottom: wp('5%'),
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    zIndex: 1,
    marginHorizontal: wp('4%'),
    marginBottom: wp('-2%'),
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: wp('4%'),
    paddingVertical: wp('2.5%'),
    backgroundColor: '#FFFFFF',
    zIndex: 0,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  inlineText: {
    marginLeft: 10,
    color: '#007BFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  updateButton: {
    backgroundColor: '#283593',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: wp('5%'),
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
