
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { useAuth, useFirestore } from "@/firebase";
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
  updatedAt: any;
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
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const db = useFirestore();
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

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
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        const profile = await fetchUserProfile(user.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth, db]);

  const signIn = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signUp = async (email: string, pass: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const uid = userCredential.user.uid;
    const docRef = doc(db, "users", uid);
    
    const initialProfile: UserProfile = {
      uid,
      email,
      fullName: "",
      mobileNumber: "",
      city: "",
      address: "",
      photoURL: null,
      isProfileComplete: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Follow mutation pattern: no await, chain catch with permission error emitter
    setDoc(docRef, initialProfile).catch(async (error: any) => {
      if (error.code === 'permission-denied') {
        const permissionError = new FirestorePermissionError({
          path: docRef.path,
          operation: 'create',
          requestResourceData: initialProfile,
        });
        errorEmitter.emit('permission-error', permissionError);
      }
    });
    
    setUserProfile(initialProfile);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUserProfile(null);
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!firebaseUser) return;
    const docRef = doc(db, "users", firebaseUser.uid);
    const profileData = {
      ...data,
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      updatedAt: serverTimestamp(),
    };

    // Follow mutation pattern: no await, chain catch with permission error emitter
    setDoc(docRef, profileData, { merge: true })
      .catch(async (error: any) => {
        if (error.code === 'permission-denied') {
          const permissionError = new FirestorePermissionError({
            path: docRef.path,
            operation: 'write',
            requestResourceData: profileData,
          });
          errorEmitter.emit('permission-error', permissionError);
        }
      });

    // Optimistically update local state
    setUserProfile((prev) => prev ? { ...prev, ...data } : null);
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
      loading, 
      signIn, 
      signUp,
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
