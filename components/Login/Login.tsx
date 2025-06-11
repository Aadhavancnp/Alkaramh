import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useContext, useState } from "react"; // Import useContext
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { Button } from "react-native-paper";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import apiConfig from "../../api.json";
import AuthContext from "../../context/AuthContext"; // Import AuthContext

const AuthScreens = () => {
  const navigation: any = useNavigation();
  const authContext = useContext(AuthContext);

  if (!authContext) {
    // Handle the case where context is undefined, maybe show a loading or error state
    // This should ideally not happen if AuthProvider wraps the component tree correctly
    return (
      <View>
        <Text>Loading auth context...</Text>
      </View>
    );
  }
  const { loginAction } = authContext;

  const [isLoginMode, setIsLoginMode] = useState<boolean>(true);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const clearFormFields = () => {
    setName("");
    // Keep email if transitioning from successful signup to login
    // setEmail("");
    setPassword("");
    setError(null);
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    clearFormFields();
    // If switching to login after a successful signup, user might expect email to be prefilled
    // If not, ensure email is cleared:
    if (isLoginMode) setEmail(""); // Clear email when switching from Login to Signup
  };

  const handleLogin = async (): Promise<void> => {
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${apiConfig.API_URL}/auth/login`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      const data = response.data;
      // Save userId, name, and token in AsyncStorage
      await AsyncStorage.setItem("userId", data.user._id);
      await AsyncStorage.setItem("userName", data.user.name);
      await AsyncStorage.setItem("token", data.token);

      await loginAction({ user: data.user, token: data.token });
      console.log("Login action completed for:", data.user.name);
      navigation.navigate("Home");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (): Promise<void> => {
    if (!name || !email || !password) {
      setError("Name, email, and password are required for signup.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${apiConfig.API_URL}/auth/signup`,
        { name, email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      Alert.alert("Success", "User registered successfully! Please login.");
      setName("");
      setPassword("");
      setIsLoginMode(true);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMainAction = () => {
    if (isLoginMode) {
      handleLogin();
    } else {
      handleSignup();
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>
          {isLoginMode
            ? "Welcome back!\nSign in to continue"
            : "Create your Account"}
        </Text>

        {error && <Text style={styles.errorText}>{error}</Text>}

        {!isLoginMode && (
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Button
          mode="contained"
          style={styles.continueButton}
          labelStyle={styles.continueText}
          onPress={handleMainAction}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : isLoginMode ? (
            "Continue"
          ) : (
            "Sign Up"
          )}
        </Button>

        <TouchableOpacity onPress={toggleMode} style={styles.toggleModeButton}>
          <Text style={styles.toggleModeText}>
            {isLoginMode
              ? "Don't have an account? Sign Up"
              : "Already have an account? Login"}
          </Text>
        </TouchableOpacity>

        <View style={styles.orContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity style={styles.socialButton} disabled>
          <Text style={styles.socialText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton} disabled>
          <Text style={styles.socialText}>Continue with Apple</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          {isLoginMode ? "By continuing, you" : "By signing up, you"}{" "}
          automatically accept our{"\n"}
          <Text style={{ fontWeight: "bold" }}>Terms & Conditions</Text>,{" "}
          <Text style={{ fontWeight: "bold" }}>Privacy Policy</Text>, and{" "}
          <Text style={{ fontWeight: "bold" }}>Cookies Policy</Text>.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

// export default AuthScreen;
const styles = StyleSheet.create({
  safeContainer: {
    marginTop: hp("8%"), // Adjusted margin for more space
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    paddingHorizontal: wp("5%"),
    paddingVertical: hp("3%"), // Adjusted padding
    flexGrow: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: wp("6.5%"),
    fontWeight: "700",
    color: "#1A237E",
    marginBottom: hp("4%"), // Increased margin
    textAlign: "center",
  },
  input: {
    backgroundColor: "#f9f9f9",
    borderRadius: wp("2%"),
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("1.8%"),
    fontSize: wp("4%"),
    color: "#000",
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: hp("2%"),
  },
  errorText: {
    color: "red",
    marginBottom: hp("2%"),
    textAlign: "center",
    fontSize: wp("3.5%"),
  },
  continueButton: {
    backgroundColor: "#303F9F",
    borderRadius: wp("2%"),
    paddingVertical: hp("1.2%"),
    marginTop: hp("2%"), // Increased margin
  },
  continueText: {
    fontSize: wp("4.2%"), // Slightly increased font size
    color: "#fff",
    fontWeight: "bold",
  },
  toggleModeButton: {
    marginTop: hp("2.5%"), // Added margin
    alignItems: "center",
  },
  toggleModeText: {
    color: "#303F9F",
    fontSize: wp("3.8%"),
    fontWeight: "600",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: hp("2.5%"), // Adjusted margin
  },
  orText: {
    marginHorizontal: wp("3%"),
    color: "#999",
    fontSize: wp("3.5%"),
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
  },
  socialButton: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: wp("2%"),
    paddingVertical: hp("1.5%"),
    paddingHorizontal: wp("4%"),
    alignItems: "center",
    marginBottom: hp("1.5%"), // Adjusted margin
  },
  socialText: {
    fontSize: wp("4%"),
    color: "#333",
  },
  footer: {
    fontSize: wp("3.2%"),
    color: "#777",
    marginTop: hp("4%"), // Adjusted margin
    lineHeight: hp("2.5%"),
    textAlign: "center",
  },
});


const translations = {
  English: {
    title: "Let's start with your\nmobile number",
    placeholder: "Enter your mobile number",
    subtext: "We will send you a text message",
    continue: "Continue",
    or: "OR",
    google: "Continue with Google",
    apple: "Continue with Apple",
    footer: "By continuing, you automatically accept our\nTerms & Conditions, Privacy Policy, and Cookies Policy.",
    switchLang: "عربي"
  },
  Arabic: {
    title: "لنبدأ برقم\nالهاتف الخاص بك",
    placeholder: "أدخل رقم هاتفك المحمول",
    subtext: "سوف نرسل لك رسالة نصية",
    continue: "استمرار",
    or: "أو",
    google: "تابع مع جوجل",
    apple: "تابع مع أبل",
    footer: "من خلال الاستمرار، فإنك توافق تلقائيًا على\nالشروط والأحكام وسياسة الخصوصية وسياسة ملفات تعريف الارتباط.",
    switchLang: "English"
  }
};

const AuthScreen = () => {
  const [isLoginMode, setIsLoginMode] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [phone, setPhone] = useState('');
  const navigation: any = useNavigation();
  const [language, setLanguage] = useState<'English' | 'Arabic'>('Arabic');

  const t = translations[language];
  const Handleotp = () =>{
    setIsLoginMode(true);
    navigation.navigate("otp",{'lang':language});
    setIsLoading(false);
  }
  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'English' ? 'Arabic' : 'English'));
  };

  return (
    <View style={styless.container}>
      <TouchableOpacity onPress={toggleLanguage} style={styless.langSwitch}>
        <Text style={styless.langText}>{t.switchLang}</Text>
      </TouchableOpacity>

      <Text style={styless.title}>{t.title}</Text>

      <View style={styless.inputRow}>
        <View style={styless.codeBox}>
          <Text style={styless.codeText}>+974</Text>
        </View>
        <TextInput
          style={styless.input}
          placeholder={t.placeholder}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
      </View>

      <Text style={styless.subtext}>{t.subtext}</Text>

      <Button
        mode="contained"
        style={styless.continueButton}
        onPress={Handleotp}
      >
        {t.continue}
      </Button>

      <View style={styless.orContainer}>
        <View style={styless.line} />
        <Text style={styless.orText}>{t.or}</Text>
        <View style={styless.line} />
      </View>

      <TouchableOpacity style={styless.socialButton}>
        <Image
          source={require('./../../assets/google.png')}
          style={styless.logo}
        />
        <Text style={styless.socialText}>{t.google}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styless.socialButton}>
        <Image
          source={require('./../../assets/apple.png')}
          style={styless.applelogo}
        />
        <Text style={styless.socialText}>{t.apple}</Text>
      </TouchableOpacity>

      <Text style={styless.footer}>{t.footer}</Text>
    </View>
  );
};



export default AuthScreen;
const styless = StyleSheet.create({
    container: {
      padding:hp("3%"),
     // width:wp("95%"),
      backgroundColor: "#fff",
      height: hp("100%"),

    },
  
    logo:{
      width:wp('7%'),
      height:wp('7%')

    },
    applelogo:{
      width:wp('8%'),
      height:wp('8%')

    },langSwitch: {
    alignSelf: 'flex-end',
    marginRight: wp('0'),
    marginTop:15
},
    langText: {
      padding:wp('1.5%'),
      borderRadius:10,
      borderWidth:1,
      fontSize: 16,
      color: '#1A237E',
},

    title: {
      fontSize: wp("8%"),
      marginTop: hp("9%"),
      fontWeight: "400",
      color: "#1A237E",
      marginBottom: hp("6%"),
    },
    inputRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#ffffff",
      borderRadius: wp("2%"),
      //paddingHorizontal: wp("3%"),
      marginBottom: hp("1%"),
      borderColor: "#ddd",
     // borderWidth: 1,
    },
    codeBox: {
      paddingRight: wp("2.5%"),
      padding:wp("2.5"),
      borderWidth:wp(".4"),
      borderRadius:wp("2"),
    //  borderRightWidth: 1,
      borderColor: "#ccc",
      marginRight:wp("2")
    },
    codeText: {
      fontSize: wp("4%"),
      color: "#1A237E",
    },
    input: {
      flex: 1,
      padding:wp("2.5"),
      fontSize: wp("4%"),
      borderWidth:wp(".4"),
      color: "#000",
      borderColor: "#ccc",
      borderRadius:wp("2")
    },
    subtext: {
      fontSize: wp("3.5%"),
      color: "#888",
      marginBottom: hp("2%"),
    },
    continueButton: {
      backgroundColor: "#303F9F",
      paddingVertical: hp(".25%"),
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
      justifyContent:'center',
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
      marginTop: hp("10%"),
    },
  });
  


