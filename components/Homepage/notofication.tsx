
import Footer from "@/Utils/Footer/Footer";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";


interface NotificationProps {
  onEnableNotifications?: () => Promise<void>;
  onRemindLater?: () => Promise<void>;
  title?: string;
  subtitle?: string;
  enableButtonText?: string;
  remindLaterText?: string;
  showRemindLater?: boolean;
}

const NotificationScreen: React.FC<NotificationProps> = ({ 
  onEnableNotifications, 
  onRemindLater, 
  title = "Don't miss a beat",
  subtitle = "Get notified about Due date, discounts and deals",
  enableButtonText = "Enable Now",
  remindLaterText = "remind me later",
  showRemindLater = true 
}) => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleEnableNotifications = async (): Promise<void> => {
    setIsLoading(true);
    try {
      if (onEnableNotifications) {
        await onEnableNotifications();
      } else {
        Alert.alert("Notifications Enabled", "You will now receive notifications!");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to enable notifications. Please try again.");
      console.error("Notification enable error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemindLater = async (): Promise<void> => {
    try {
      if (onRemindLater) {
        await onRemindLater();
      } else {
        // Default behavior
        Alert.alert("Reminder Set", "We'll remind you later about notifications.");
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert("Error", "Failed to set reminder. Please try again.");
      console.error("Remind later error:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={wp("6%")} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notification</Text>
          <View style={{ width: wp("6%") }} />
        </View>

        {/* Scrollable Content */}
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.contentContainer}>
              <Image 
                source={require('../../assets/bell_icon.png')}
                style={styles.bellIcon}
                resizeMode="contain"
              />

              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>

              <TouchableOpacity 
                style={[styles.enableButton, isLoading && styles.disabledButton]}
                // onPress={handleEnableNotifications}
                disabled={isLoading}
                accessibilityLabel="Enable notifications"
              >
                <Text style={styles.enableButtonText}>
                  {isLoading ? "Enabling..." : enableButtonText}
                </Text>
              </TouchableOpacity>

              {showRemindLater && (
                <TouchableOpacity 
                  // onPress={handleRemindLater}
                  style={styles.remindLaterButton}
                  accessibilityLabel="Remind me later"
                >
                  <Text style={styles.remindLater}>{remindLaterText}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>

        {/* Fixed Footer */}
        <View style={styles.footerContainer}>
            <Footer/>
        </View>
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    paddingHorizontal: wp("1%"),
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("1.5%"),
    marginTop: hp("1%"),
    paddingHorizontal: wp("4%"),
  },
  backButton: {
    // No additional styles needed
  },
  headerTitle: {
    fontSize: wp("5%"),
    fontWeight: "600",
    marginLeft: wp("2%"),
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: hp("2%"),
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: hp("2%"),
  },
  footerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp("5%"),
    marginTop: -hp("8%"),
  },
  contentContainer: {
    backgroundColor: "#fff",
    borderRadius: wp("6%"),
    paddingVertical: hp("4%"),
    paddingHorizontal: wp("8%"),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    marginHorizontal: wp("2%"),
    width: "100%",
  },
  bellIcon: {
    width: wp("55%"),
    height: wp("55%"),
    marginBottom: hp("3%"),
  },
  title: {
    fontSize: wp("5.5%"),
    fontWeight: "bold",
    marginBottom: hp("1.5%"),
    textAlign: "center",
    color: "#000",
  },
  subtitle: {
    fontSize: wp("3.5%"),
    color: "#666",
    textAlign: "center",
    marginBottom: hp("4%"),
    lineHeight: hp("2.8%"),
  },
  enableButton: {
    backgroundColor: "#283593",
    paddingVertical: hp("2%"),
    paddingHorizontal: wp("15%"),
    borderRadius: hp("3%"),
    marginBottom: hp("2%"),
    minWidth: wp("60%"),
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#666",
  },
  enableButtonText: {
    color: "#fff",
    fontSize: wp("4%"),
    fontWeight: "600",
  },
  remindLaterButton: {
    padding: hp("1%"),
  },
  remindLater: {
    color: "#666",
    fontSize: wp("3.5%"),
  },
});

export default NotificationScreen;