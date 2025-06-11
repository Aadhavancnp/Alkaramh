import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import OTPTextInput from 'react-native-otp-textinput';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
 const translations = {
    English : {
      firsttext:'Please check your Email or phone',
      secondtext:'We have sent the code to +974XXXXXX3344',
      otpresendtext:'Send code again',
      verifytext:'Verify',
      switchLang: "عربي"

    },
    Arabic:{
      firsttext:'يرجى التحقق من بريدك الإلكتروني أو هاتفك',
      secondtext:'لقد أرسلنا الرمز إلى +XXXXX3344',
      otpresendtext:'أرسل الرمز مرة أخرى',
      verifytext:'يؤكد',
      switchLang: "English"
    }
  };
  const Otp = () => {
  const route = useRoute(); 
  const  {lang}= route.params || { lang: 'English' };
  const t = translations[lang];

  
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
        <Text style={styles.firsttext}>{t.firsttext}</Text>
        <Text style={styles.secondtext}>
        {t.secondtext}
        </Text>
        <View style={styles.otpfield}>
          <OTPTextInput
            ref={otpInput}
            handleTextChange={handleChange}
            inputCount={5}
            tintColor="#555"
            offTintColor="#ccc"
           containerStyle={{ justifyContent: "space-between" }}
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
        <TouchableOpacity style={styles.verifybutton} onPress={handleverify}>
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
    padding: wp("5%"),
    // alignItems:'center',
  },
  textContainer: {
    gap: hp("2%"),
    marginTop: hp("7%"),
  },
  firsttext: {
    fontSize: wp("5.5%"),
    fontWeight: "400",
    color: "#030518",
  },
  secondtext: {
    fontSize: wp("3.3%"),
    color: "#555",
  },
  otpfield: {
    paddingTop:wp('5%'),
    display: "flex",
    flexDirection: "row",
    justifyContent:'center',
   
  },
  otpbox: {
   // width: wp("15%"),
    borderWidth: 1,
    borderColor: "#999",
    textAlign: "center",
    fontSize: wp("5%"),
    borderRadius: wp("2%"),
  //  marginLeft: wp("5%"),
  },

  verifycontainer: {
    width: wp("90%"),
    marginTop: hp("5%"),
  },
  verifybutton: {
    backgroundColor: "#283593",
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
    color: "#00000",
    fontWeight:'400',
    fontSize: wp("4%"),
    textAlign: "center",
  },
  timertext: {
    color: "#000000",
    fontSize: wp("4%"),
  },
});
