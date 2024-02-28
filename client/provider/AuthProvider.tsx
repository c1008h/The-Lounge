import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { auth, db, userCollection } from '@/services/firebaseConfig'; // Import your Firebase authentication instance and Google auth provider
import { UserCredential, AdditionalUserInfo, signInWithPopup, GoogleAuthProvider, getAdditionalUserInfo } from "firebase/auth";
import { addDoc } from "firebase/firestore";

interface AuthContextType {
  signInWithGoogle: () => Promise<UserCredential | undefined>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
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