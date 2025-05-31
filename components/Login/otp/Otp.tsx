import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import OTPTextInput from 'react-native-otp-textinput';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
const Otp = () => {
    const navigation:any=useNavigation();
  const otpInput = useRef<any>(null);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
const[otp,setotp]=useState('');
  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (code: string) => {
    console.log('OTP Code:', code);
    setotp(code);
  };

  const handleResend = () => {
    console.log('Resend Code');
    setTimer(30);
    setCanResend(false);
    // You can also trigger your resend OTP API here
  };
const handleverify=():void=>{
    navigation.navigate("Home")

}
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.firsttext}>Please check your Email or phone</Text>
        <Text style={styles.secondtext}>
          We have sent the code to +91XXXXXX3344
        </Text>
        <View style={styles.otpfield}>
          <OTPTextInput
            ref={otpInput}
            handleTextChange={handleChange}
            inputCount={4}
            tintColor="#555"
            offTintColor="#ccc"
            containerStyle={{ justifyContent: "space-between" }}
            textInputStyle={styles.otpbox}
          />
        </View>

        <View style={styles.otresendsection}>
          {canResend ? (
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.otpresendtext}>Resend Code</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.timertext}>Resend in {timer}s</Text>
          )}
        </View>
      </View>

      <View style={styles.verifycontainer}>
        <TouchableOpacity style={styles.verifybutton} onPress={handleverify}>
          <Text style={styles.verifytext}>Verify</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Otp;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp("5%"),
    // alignItems:'center',
  },
  textContainer: {
    gap: hp("2%"),
    marginTop: hp("5%"),
  },
  firsttext: {
    fontSize: wp("5.5%"),
    fontWeight: "bold",
    color: "#030518",
  },
  secondtext: {
    fontSize: wp("4%"),
    color: "#555",
  },
  otpfield: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  otpbox: {
    width: wp("15%"),
    borderWidth: 1,
    borderColor: "#999",
    textAlign: "center",
    fontSize: wp("5%"),
    borderRadius: wp("2%"),
    marginLeft: wp("5%"),
  },

  verifycontainer: {
    width: wp("90%"),
    marginTop: hp("5%"),
  },
  verifybutton: {
    backgroundColor: "#2d46eb",
    padding:hp('1%'),
    borderRadius:wp('3'),
    paddingTop:hp('2%'),
    paddingBottom:hp('2%')
  },
  verifytext: {
    textAlign: "center",
    color:'#ffff'
  },
  otresendsection: {
    marginTop: hp("2%"),
    alignItems: "center",
  },
  otpresendtext: {
    color: "#1E90FF",
    fontWeight: "600",
    fontSize: wp("4%"),
    textAlign: "center",
  },
  timertext: {
    color: "#555",
    fontSize: wp("4%"),
  },
});
