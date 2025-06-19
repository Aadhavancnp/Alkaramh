import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import OTPTextInput from 'react-native-otp-textinput';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';



const Otp = () => {
  const translations = {
  English: {
    firsttext: 'Please check your Email or phone',
    secondtext: 'We have sent the code to +974XXXXXX3344',
    otpresendtext: 'Send code again',
    verifytext: 'Verify',
    switchLang: "عربي",
  },
  Arabic: {
    firsttext: 'يرجى التحقق من بريدك الإلكتروني أو هاتفك',
    secondtext: 'لقد أرسلنا الرمز إلى +XXXXX3344',
    otpresendtext: 'أرسل الرمز مرة أخرى',
    verifytext: 'يؤكد',
    switchLang: "English",
  },
};
  const route = useRoute();
  const navigation: any = useNavigation();
  const otpInput = useRef<any>(null);

  const lang = (route.params as any)?.lang || 'English';
  const t = translations[lang] || translations.English;

  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (code: string) => {
    setOtp(code);
    console.log('OTP Code:', code);
  };

  const handleResend = () => {
    console.log('Resend Code');
    setTimer(30);
    setCanResend(false);
    // Trigger resend OTP API here if needed
  };

  const handleVerify = () => {
    // Add verification logic here if needed
    navigation.navigate("Dashboard");
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.firsttext}>{t.firsttext}</Text>
        <Text style={styles.secondtext}>{t.secondtext}</Text>

        <View style={styles.otpfield}>
          <OTPTextInput
            ref={otpInput}
            handleTextChange={handleChange}
            inputCount={5}
            tintColor="#555"
            offTintColor="#ccc"
            containerStyle={styles.otpContainer}
            textInputStyle={styles.otpbox}
          />
        </View>

        <View style={styles.otresendsection}>
          {canResend ? (
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.otpresendtext}>{t.otpresendtext}</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.timertext}>{t.otpresendtext} {timer}s</Text>
          )}
        </View>
      </View>

      <View style={styles.verifycontainer}>
        <TouchableOpacity style={styles.verifybutton} onPress={handleVerify}>
          <Text style={styles.verifytext}>{t.verifytext}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Otp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp("5%"),
    backgroundColor: "#fff",
  },
  textContainer: {
    gap: hp("2%"),
    marginTop: hp("7%"),
  },
  firsttext: {
    fontSize: wp("5%"),
    fontWeight: "500",
    color: "#030518",
    textAlign: "left",
  },
  secondtext: {
    fontSize: wp("4%"),
    color: "#555",
    textAlign: "left",
  },
  otpfield: {
    paddingTop: hp("5%"),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  otpContainer: {
    justifyContent: "space-between",
  },
  otpbox: {
    borderWidth: 1,
    borderColor: "#999",
    textAlign: "center",
    fontSize: wp("5.5%"),
    borderRadius: wp("2%"),
    width: wp("12%"),
    height: wp("12%"),
    padding: 0,
    marginHorizontal: wp("1%"),
  },
  otresendsection: {
    marginTop: hp("2%"),
    alignItems: "center",
  },
  otpresendtext: {
    color: "#1A237E",
    fontWeight: "500",
    fontSize: wp("4%"),
    textAlign: "center",
  },
  timertext: {
    color: "#000000",
    fontSize: wp("4%"),
  },
  verifycontainer: {
    marginTop: hp("5%"),
    width: "100%",
  },
  verifybutton: {
    backgroundColor: "#283593",
    paddingVertical: hp("1.8%"),
    borderRadius: wp("3%"),
    alignItems: "center",
    justifyContent: "center",
  },
  verifytext: {
    color: "#FFFFFF",
    fontSize: wp("4.2%"),
    fontWeight: "500",
  },
});
