import { StatusBar } from "react-native";
import { AuthProvider } from "./context/AuthContext";
import InitialRouter from "./Router/InitialRouter";

export default function App() {
  return (
    <AuthProvider>
      <InitialRouter />
      <StatusBar barStyle="default" />
    </AuthProvider>
  );
}
