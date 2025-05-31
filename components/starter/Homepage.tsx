import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Button } from "react-native-paper";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const MobileLoginScreen = () => {
  const [phone, setPhone] = useState<string>("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lets start with your{"\n"}mobile number</Text>

      <View style={styles.inputRow}>
        <View style={styles.codeBox}>
          <Text style={styles.codeText}>+974</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Enter your mobile number"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={(text: string) => setPhone(text)}
        />
      </View>

      <Text style={styles.subtext}>We will send you a text message</Text>

      <Button
        mode="contained"
        style={styles.continueButton}
        onPress={() => console.log("Continue")}
      >
        Continue
      </Button>

      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.line} />
      </View>

      <TouchableOpacity style={styles.socialButton}>
        {/* <Icon name="google" size={20} color="#EA4335" /> */}
        <Text style={styles.socialText}>Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton}>
        {/* <Icon name="apple" size={20} color="#000" /> */}
        <Text style={styles.socialText}>Continue with Apple</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>By continuing, you automatically accept our{"\n"}Terms & Conditions,
        Privacy Policy, and Cookies Policy.
      </Text>
    </View>
  );
};

export default MobileLoginScreen;
const styles = StyleSheet.create({
    container: {
        width:wp("95%"),
      backgroundColor: "#fff",
      height: hp("100%"),

    },
    title: {
      fontSize: wp("6%"),
      marginTop: hp("9%"),
      fontWeight: "600",
      color: "#1A237E",
      marginBottom: hp("6%"),
    },
    inputRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#ffffff",
      borderRadius: wp("2%"),
      paddingHorizontal: wp("3%"),
      marginBottom: hp("1%"),
      borderColor: "#ddd",
      borderWidth: 1,
    },
    codeBox: {
      paddingRight: wp("2.5%"),
      borderRightWidth: 1,
      borderColor: "#ccc",
    },
    codeText: {
      fontSize: wp("4%"),
      color: "#1A237E",
    },
    input: {
      flex: 1,
      paddingHorizontal: wp("3%"),
      paddingVertical: hp("1.2%"),
      fontSize: wp("4%"),
      color: "#000",
    },
    subtext: {
      fontSize: wp("3.5%"),
      color: "#888",
      marginBottom: hp("2%"),
    },
    continueButton: {
      backgroundColor: "#303F9F",
      paddingVertical: hp(".5%"),
      marginTop: hp("1.5%"),
      borderRadius: wp("2%"),
    },
    orContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: hp("4%"),
    },
    orText: {
      marginHorizontal: wp("3%"),
      color: "#aaa",
      fontSize: wp("3.5%"),
    },
    line: {
      flex: 1,
      height: 1,
      backgroundColor: "#ddd",
    },
    socialButton: {
      flexDirection: "row",
      alignItems: "center",
      borderColor: "#ccc",
      borderWidth: 1,
      borderRadius: wp("2%"),
      padding: hp("1.5%"),
      marginBottom: hp("3%"),
    },
    socialText: {
      fontSize: wp("4%"),
      marginLeft: wp("2.5%"),
    },
    footer: {
      fontSize: wp("3%"),
      color: "#888",
      marginTop: hp("15%"),
    },
  });
  