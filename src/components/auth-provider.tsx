"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth, useFirestore, useUser } from "@/firebase";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  mobileNumber: string;
  city: string;
  address: string;
  photoURL: string | null;
  createdAt: any;
  isProfileComplete: boolean;
}

interface FirebaseUser {
  uid: string;
  email: string | null;
  photoURL: string | null;
  displayName: string | null;
}

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const db = useFirestore();
  const { user: firebaseUser, loading: authLoading } = useUser();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const fetchUserProfile = async (uid: string): Promise<UserProfile | null> => {
    const docRef = doc(db, "users", uid);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      }
      return null;
    } catch (error: any) {
      if (error.code === 'permission-denied') {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
      }
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  useEffect(() => {
    async function initProfile() {
      if (firebaseUser) {
        const profile = await fetchUserProfile(firebaseUser.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      setProfileLoading(false);
    }
    if (!authLoading) {
      initProfile();
    }
  }, [firebaseUser, authLoading]);

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUserProfile(null);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!firebaseUser) return;
    const docRef = doc(db, "users", firebaseUser.uid);
    const profileData = {
      ...data,
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      photoURL: firebaseUser.photoURL,
      updatedAt: new Date(),
    };

    setDoc(docRef, profileData, { merge: true })
      .then(async () => {
        const updatedProfile = await fetchUserProfile(firebaseUser.uid);
        setUserProfile(updatedProfile);
      })
      .catch(async (error) => {
        if (error.code === 'permission-denied') {
          const permissionError = new FirestorePermissionError({
            path: docRef.path,
            operation: 'write',
            requestResourceData: profileData,
          });
          errorEmitter.emit('permission-error', permissionError);
        }
        console.error("Error updating user profile:", error);
        throw error;
      });
  };

  const userContextValue = firebaseUser ? {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    photoURL: firebaseUser.photoURL,
    displayName: firebaseUser.displayName,
  } : null;

  return (
    <AuthContext.Provider value={{ 
      user: userContextValue, 
      userProfile, 
      loading: authLoading || profileLoading, 
      signInWithGoogle, 
      signOut, 
      updateUserProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
