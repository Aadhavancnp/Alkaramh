import { createContext, useState, useEffect, ReactNode, FC } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  _id: string;
  name: string;
  email: string;
  // Add other user properties as needed
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean; // For initial loading of auth state
  loginAction: (data: { user: User; token: string | null }) => Promise<void>;
  logoutAction: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('userData');
        const storedToken = await AsyncStorage.getItem('userToken');

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (e) {
        console.error('Failed to load auth state from AsyncStorage', e);
        // Handle error, e.g., by ensuring user/token are null
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthState();
  }, []);

  const loginAction = async (data: { user: User; token: string | null }) => {
    try {
      setUser(data.user);
      setToken(data.token); // Can be null as per current backend
      await AsyncStorage.setItem('userData', JSON.stringify(data.user));
      if (data.token) {
        await AsyncStorage.setItem('userToken', data.token);
      } else {
        // If token is null, we might want to remove any existing token
        await AsyncStorage.removeItem('userToken');
      }
    } catch (e) {
      console.error('Failed to save auth state to AsyncStorage', e);
      // Optionally, revert state if AsyncStorage fails
      // setUser(null); 
      // setToken(null);
      throw e; // Re-throw to allow caller to handle
    }
  };

  const logoutAction = async () => {
    try {
      setUser(null);
      setToken(null);
      await AsyncStorage.removeItem('userData');
      await AsyncStorage.removeItem('userToken');
    } catch (e) {
      console.error('Failed to clear auth state from AsyncStorage', e);
      // Handle error, though logout should generally succeed locally
      throw e; // Re-throw to allow caller to handle
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, loginAction, logoutAction }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
