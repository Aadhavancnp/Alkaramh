import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useNavigation } from 'expo-router';

const ProfileScreen: React.FC = () => {
  const [user, setUser] = useState({
    name: 'Sivakumar',
    mobile: '9150203344',
    email: '',
    dateOfBirth: '',
  });

  const handleUpdateProfile = () => {
    console.log('Profile updated:', user);
  };

  const navigation = useNavigation();
  const isEmailEntered = user.email.trim() !== '';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Back Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} />
            <Text style={styles.backText}>Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.headerBackground}></View>

        <View style={styles.profileWrapper}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Image style={styles.avatarImage} source={require('../../assets/person.png')} />
            </View>
          </View>

          <ImageBackground
            source={require('../../assets/Union.png')}
            style={styles.formContainer}
            imageStyle={styles.backgroundImage}
          >
            <View style={styles.inputWrapper}>
              <View style={{ backgroundColor: '#FFFFFF', paddingHorizontal: 10 }}>
                <Text style={styles.label}>Name</Text>
              </View>
              <View style={styles.inputGroup}>
                <TextInput style={styles.input} value={user.name} />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Mobile</Text>
              <View style={styles.inputGroup}>
                <TextInput style={styles.input} value={user.mobile} />
              </View>
            </View>

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

            <TouchableOpacity
              style={[
                styles.updateButton,
                isEmailEntered && { backgroundColor: '#283593' }, // Change button color if email is entered
              ]}
              onPress={handleUpdateProfile}
            >
              <Text style={styles.updateButtonText}>Update Profile</Text>
            </TouchableOpacity>
          </ImageBackground>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

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
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
    opacity: 0.2, // Optional: makes background image semi-transparent
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
    backgroundColor: '#E5E7EB',
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

export default ProfileScreen;
