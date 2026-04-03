
/**
 * @deprecated This file is deprecated to avoid duplicate Firebase instances.
 * Use the hooks from '@/firebase' instead.
 */
import { initializeFirebase } from "@/firebase";

const { firebaseApp: app, auth, firestore: db } = initializeFirebase();

export { app, auth, db };
