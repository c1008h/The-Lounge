import { createContext, useContext, ReactNode } from 'react';
import { auth } from '@/services/firebaseConfig'; // Import your Firebase authentication instance and Google auth provider
import { UserCredential, signInWithPopup, GoogleAuthProvider, AuthCredential } from "firebase/auth";

interface AuthContextType {
    signInWithGoogle: () => Promise<UserCredential | undefined>;
    signUpWithEmail: (email: string, password: string) => Promise<void>;
    signInWithEmail: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const provider = new GoogleAuthProvider();

    const signInWithGoogle = async (): Promise<UserCredential | undefined> => {
        try {
            const result = await signInWithPopup(auth, provider); 
            // const credential: AuthCredential | null = GoogleAuthProvider.credentialFromResult(result);
            // const user = result.user;

            return result
        } catch (error) {
            console.error('Error signing in with Google:', error);
        }
        return undefined;
    };
  
    const signUpWithEmail = async (email: string, password: string): Promise<void> => {
        try {
        await auth.createUserWithEmailAndPassword(email, password); // Use Firebase createUserWithEmailAndPassword method for email signup
      } catch (error) {
        console.error('Error signing up with email:', error);
      }
    };
  
    const signInWithEmail = async (email: string, password: string): Promise<void> => {
        try {
        await auth.signInWithEmailAndPassword(email, password); // Use Firebase signInWithEmailAndPassword method for email login
      } catch (error) {
        console.error('Error signing in with email:', error);
      }
    };
  
    const value: AuthContextType = {
      signInWithGoogle,
      signUpWithEmail,
      signInWithEmail,
    };
  
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};