import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { auth, db, userCollection } from '@/services/firebaseConfig'; 
import { 
  UserCredential, 
  AdditionalUserInfo, 
  signInWithPopup, 
  GoogleAuthProvider, 
  getAdditionalUserInfo,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User
} from "firebase/auth";
import { addDoc } from "firebase/firestore";

interface AuthContextType {
  signInWithGoogle: () => Promise<UserCredential | undefined>;
  signUpWithEmail: (email: string, password: string) => Promise<UserCredential | undefined>;
  signInWithEmail: (email: string, password: string) => Promise<UserCredential | undefined>;
  logout: () => Promise<void>;
  currentUser: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setCurrentUser);
    return unsubscribe;
  }, []);

  const provider = new GoogleAuthProvider();

  const signInWithGoogle = async (): Promise<UserCredential | undefined> => {
    try {
      const result = await signInWithPopup(auth, provider); 
      const details = getAdditionalUserInfo(result)
      // const credential: AuthCredential | null = GoogleAuthProvider.credentialFromResult(result);
      const user = result.user;
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;

      console.log("result:", result)
      console.log('credential', credential)
      console.log("isNewUser", details)

      if (details?.isNewUser) {
        const userDocData = {
          uid: user.uid,
          email: user.email,
          firstname: details?.profile?.given_name || null,
          lastname: details?.profile?.family_name || null,
          imageUrl: user?.photoURL || null
        }

        try {
          addDoc(userCollection, userDocData)
          .then((docRef) => console.log("Document written with ID:", docRef.id))
          
        } catch (error) {
          console.error("cannot add new user to firestore:", error)
        }

      } else {
        console.log("WELCOME NOOBIE!")
      }

      return result
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
    return undefined;
  };

  const signUpWithEmail = async (email: string, password: string): Promise<UserCredential | undefined> => {
    try {
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredentials.user

      console.log("USER:", userCredentials)

      const userDocData = {
        uid: user.uid,
        email: user.email,
      }

      try {
        addDoc(userCollection, userDocData)
        .then((docRef) => console.log("Document written with ID:", docRef.id))
        
      } catch (error) {
        console.error("cannot add new user to firestore:", error)
      }
      return userCredentials
    } catch (error) {
      const firebaseError = error as { code?: string, message?: string };

      if (firebaseError.code === 'auth/email-already-in-use') {
        console.error('The email address is already in use by another account.');
        alert("This email is already in use.")
      } else {
        console.error('Error signing up with email:', error);
      }
      return undefined;
    }
  };

  const signInWithEmail = async (email: string, password: string): Promise<UserCredential | undefined> => {
    try {
      const userCredentials = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredentials.user
      console.log("USER:", userCredentials)

      return userCredentials;
    } catch (error) {
      const firebaseError = error as { code?: string, message?: string };

      if (firebaseError.code === 'auth/invalid-credential') {
        console.error('Invalid password or email.');
        alert("Invalid password or email.")
      } else {
        console.error('Error logging in with email:', error);
      }
      return undefined;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Trouble signing out:", error)
    }
  }

  const value: AuthContextType = {
    signInWithGoogle,
    signUpWithEmail,
    signInWithEmail,
    logout,
    currentUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};