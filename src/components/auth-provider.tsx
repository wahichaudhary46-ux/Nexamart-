
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
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { useAuth as useFirebaseAuth, useFirestore } from "@/firebase";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  mobileNumber: string;
  city: string;
  state?: string;
  country?: string;
  address: string;
  photoURL: string | null;
  dob?: string;
  gender?: string;
  bio?: string;
  class?: string;
  exam?: string;
  stream?: string;
  admissionNo?: string;
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
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useFirebaseAuth();
  const db = useFirestore();
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (uid: string) => {
    const docRef = doc(db, "users", uid);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      }
    } catch (error: any) {
      if (error.code === 'permission-denied') {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: docRef.path,
          operation: 'get',
        }));
      }
    }
    return null;
  };

  const createInitialProfile = async (user: User): Promise<UserProfile> => {
    const initialProfile: UserProfile = {
      uid: user.uid,
      email: user.email || "",
      fullName: user.displayName || "",
      mobileNumber: "",
      city: "",
      address: "",
      photoURL: user.photoURL || null,
      isProfileComplete: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = doc(db, "users", user.uid);
    setDoc(docRef, initialProfile, { merge: true }).catch(async (error: any) => {
      if (error.code === 'permission-denied') {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: docRef.path,
          operation: 'create',
          requestResourceData: initialProfile,
        }));
      }
    });

    return initialProfile;
  };

  useEffect(() => {
    const checkRedirect = async () => {
      try {
        await getRedirectResult(auth);
      } catch (e) {
        console.error("Redirect check failed:", e);
      }
    };
    checkRedirect();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      
      if (user) {
        let profile = await fetchUserProfile(user.uid);
        if (!profile) {
          profile = await createInitialProfile(user);
        }
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
    const profile = await createInitialProfile(userCredential.user);
    setUserProfile(profile);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (
        error.code === 'auth/popup-closed-by-user' || 
        error.code === 'auth/popup-blocked' || 
        error.code === 'auth/cancelled-popup-request'
      ) {
        await signInWithRedirect(auth, provider);
      } else {
        throw error;
      }
    }
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

    setDoc(docRef, profileData, { merge: true })
      .catch(async (error: any) => {
        if (error.code === 'permission-denied') {
          errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: docRef.path,
            operation: 'write',
            requestResourceData: profileData,
          }));
        }
      });

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

export const useAuth = useAuthContext;
