import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator, 
  Alert, 
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useContext } from 'react'; // Ensure React is imported
import AuthContext from '../../context/AuthContext'; // Import AuthContext

interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
}


const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  visible,
  onClose,
}) => {
  const authContext = useContext(AuthContext);
  const { user, token } = authContext || {};

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const clearForm = (clearSuccess = true) => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError(null);
    if (clearSuccess) {
      setSuccessMessage(null);
    }
  };
  
  const handleActualClose = () => {
    clearForm(); // Clear form when modal is closed
    onClose();
  }

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Validations
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('All password fields are required.');
      setLoading(false);
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      setLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      setLoading(false);
      return;
    }
    if (!user?.email || !token) {
      setError('User not authenticated. Please login again.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: user.email,
          oldPassword: oldPassword,
          newPassword: newPassword,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to change password.');
      }

      setSuccessMessage(responseData.message || 'Password updated successfully!');
      clearForm(false); // Clear form fields but keep success message

      // Optional: Close modal after a delay
      // setTimeout(() => {
      //   handleActualClose();
      // }, 2000);

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleActualClose} // Use handleActualClose to clear form
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.modalTitle}>Change Password</Text>
            <TouchableOpacity onPress={handleActualClose} style={styles.closeButton} disabled={loading}>
              <Ionicons name="close-circle-outline" size={wp('7%')} color="#555" />
            </TouchableOpacity>
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}
          {successMessage && <Text style={styles.successText}>{successMessage}</Text>}

          <TextInput
            style={[styles.input, loading && styles.inputDisabled]}
            placeholder="Old Password"
            secureTextEntry
            value={oldPassword}
            onChangeText={setOldPassword}
            placeholderTextColor="#888"
            editable={!loading}
          />
          <TextInput
            style={[styles.input, loading && styles.inputDisabled]}
            placeholder="New Password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
            placeholderTextColor="#888"
            editable={!loading}
          />
          <TextInput
            style={[styles.input, loading && styles.inputDisabled]}
            placeholder="Confirm New Password"
            secureTextEntry
            value={confirmPassword} // Updated state variable name
            onChangeText={setConfirmPassword} // Updated state setter
            placeholderTextColor="#888"
            editable={!loading}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, loading && styles.buttonDisabled]}
              onPress={handleActualClose}
              disabled={loading}
            >
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.submitButton, loading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={[styles.buttonText, styles.submitButtonText]}>Submit</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: wp('90%'),
    backgroundColor: 'white',
    borderRadius: wp('3%'),
    padding: wp('5%'), // Adjusted padding
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2%'), // Adjusted margin
  },
  modalTitle: {
    fontSize: wp('5.5%'),
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: wp('1%'),
  },
  errorText: {
    color: 'red',
    fontSize: wp('3.8%'),
    textAlign: 'center',
    marginBottom: hp('1.5%'),
  },
  successText: {
    color: 'green',
    fontSize: wp('3.8%'),
    textAlign: 'center',
    marginBottom: hp('1.5%'),
    fontWeight: 'bold',
  },
  input: {
    height: hp('6%'),
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: wp('2%'),
    marginBottom: hp('1.8%'), // Adjusted margin
    paddingHorizontal: wp('4%'),
    fontSize: wp('4%'),
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  inputDisabled: {
    backgroundColor: '#e9e9e9', // Slightly different background when disabled
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('1.5%'), // Adjusted margin
  },
  button: {
    borderRadius: wp('2%'),
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('4%'), // Adjusted padding
    alignItems: 'center',
    flex: 1,
  },
  buttonDisabled: {
    opacity: 0.7, // Visual cue for disabled state
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    marginRight: wp('2%'),
  },
  submitButton: {
    backgroundColor: '#2A3B8F', 
    marginLeft: wp('2%'),
  },
  buttonText: {
    fontSize: wp('4%'),
    fontWeight: '600',
  },
  cancelButtonText: {
    color: '#555',
  },
  submitButtonText: {
    color: 'white',
  },
});

export default ChangePasswordModal;
