import { StatusBar } from "react-native";
import { AuthProvider } from "./context/AuthContext";
import InitialRouter from "./Router/InitialRouter";
import Toast from "react-native-toast-message";

export default function App() {
  return (
    <AuthProvider>
      <InitialRouter />
      <StatusBar barStyle="default" />
      <Toast/>
    </AuthProvider>
  );
}
