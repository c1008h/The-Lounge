import { createContext, useContext } from 'react';
import { UserCredential, User } from "firebase/auth";

interface AuthContextType {
  signInWithGoogle: () => Promise<UserCredential | undefined>;
  signUpWithEmail: (email: string, password: string) => Promise<UserCredential | undefined>;
  signInWithEmail: (email: string, password: string) => Promise<UserCredential | undefined>;
  logout: () => Promise<void>;
  currentUser: User | null;
  token: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  
  return context;
};

export default AuthContext;
