
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

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
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (uid: string): Promise<UserProfile | null> => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData: FirebaseUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          displayName: firebaseUser.displayName,
        };
        setUser(userData);
        const profile = await fetchUserProfile(firebaseUser.uid);
        setUserProfile(profile);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    try {
      const docRef = doc(db, "users", user.uid);
      const profileData = {
        ...data,
        uid: user.uid,
        email: user.email,
        photoURL: user.photoURL,
        updatedAt: new Date(),
      };
      await setDoc(docRef, profileData, { merge: true });
      const updatedProfile = await fetchUserProfile(user.uid);
      setUserProfile(updatedProfile);
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, signInWithGoogle, signOut, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
