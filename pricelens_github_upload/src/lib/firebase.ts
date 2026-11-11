import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  User as FirebaseUser,
  updateProfile
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
  query,
  orderBy
} from "firebase/firestore";
import { UserProfile, SearchHistoryItem, WishlistItem, PriceAlert } from "../types";

// Firebase config is read from Vite env vars (see .env.example).
// Get these values from Firebase Console -> Project settings -> Your apps -> Web app.
const env = import.meta.env;
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY as string,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: env.VITE_FIREBASE_APP_ID as string,
};
// Optional: only needed if you created a named (non-default) Firestore database.
const firestoreDatabaseId = (env.VITE_FIREBASE_FIRESTORE_DATABASE_ID as string | undefined) || "";

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId
);
if (!isFirebaseConfigured) {
  console.error(
    "Firebase is not configured. Copy .env.example to .env and fill in the VITE_FIREBASE_* values, then restart the dev server."
  );
}

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firestore (default database unless VITE_FIREBASE_FIRESTORE_DATABASE_ID is set)
export const db = firestoreDatabaseId
  ? getFirestore(app, firestoreDatabaseId)
  : getFirestore(app);

const googleProvider = new GoogleAuthProvider();

const userAvatarImage = new URL("../assets/images/user_profile_avatar_1784733370687.jpg", import.meta.url).href;

// Helper to convert FirebaseUser to UserProfile
export function formatUserProfile(fbUser: FirebaseUser, customName?: string): UserProfile {
  return {
    id: fbUser.uid,
    name: customName || fbUser.displayName || fbUser.email?.split("@")[0] || "Smart Shopper",
    email: fbUser.email || "",
    avatar: fbUser.photoURL || userAvatarImage,
    joinedDate: "July 2026",
    preferences: {
      emailAlerts: true,
      priceDropNotifications: true,
      currency: "INR",
      preferredPlatforms: ["Amazon", "Flipkart", "Myntra", "Ajio"],
      darkMode: true
    }
  };
}

// Ensure User Profile document exists in Firestore
export async function syncUserProfileToFirestore(profile: UserProfile): Promise<void> {
  try {
    const userRef = doc(db, "users", profile.id);
    await setDoc(userRef, profile, { merge: true });
  } catch (err) {
    console.error("Firestore syncUserProfile error:", err);
  }
}

export async function fetchUserProfileFromFirestore(userId: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, "users", userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
  } catch (err) {
    console.error("Firestore fetchUserProfile error:", err);
  }
  return null;
}

// Authentication Service Calls
export async function loginWithEmailPassword(email: string, pass: string): Promise<UserProfile> {
  const userCredential = await signInWithEmailAndPassword(auth, email, pass);
  let profile = await fetchUserProfileFromFirestore(userCredential.user.uid);
  if (!profile) {
    profile = formatUserProfile(userCredential.user);
    await syncUserProfileToFirestore(profile);
  }
  return profile;
}

export async function registerWithEmailPassword(email: string, pass: string, name: string): Promise<UserProfile> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  if (name.trim()) {
    await updateProfile(userCredential.user, { displayName: name });
  }
  const profile = formatUserProfile(userCredential.user, name);
  await syncUserProfileToFirestore(profile);
  return profile;
}

export async function loginWithGooglePopup(): Promise<UserProfile> {
  const userCredential = await signInWithPopup(auth, googleProvider);
  let profile = await fetchUserProfileFromFirestore(userCredential.user.uid);
  if (!profile) {
    profile = formatUserProfile(userCredential.user);
    await syncUserProfileToFirestore(profile);
  }
  return profile;
}

export async function logoutFirebase(): Promise<void> {
  await firebaseSignOut(auth);
}

export async function sendPasswordReset(email: string): Promise<void> {
  await firebaseSendPasswordResetEmail(auth, email);
}

// Firestore User Collections Syncing (Wishlist, History, Alerts)
export async function fetchFirestoreWishlist(userId: string): Promise<WishlistItem[]> {
  try {
    const colRef = collection(db, "users", userId, "wishlist");
    const snap = await getDocs(colRef);
    return snap.docs.map(doc => doc.data() as WishlistItem);
  } catch (err) {
    console.error("Error fetching wishlist from Firestore:", err);
    return [];
  }
}

export async function saveFirestoreWishlistItem(userId: string, item: WishlistItem): Promise<void> {
  try {
    const docRef = doc(db, "users", userId, "wishlist", item.id);
    await setDoc(docRef, item);
  } catch (err) {
    console.error("Error saving wishlist item to Firestore:", err);
  }
}

export async function removeFirestoreWishlistItem(userId: string, itemId: string): Promise<void> {
  try {
    const docRef = doc(db, "users", userId, "wishlist", itemId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error("Error deleting wishlist item from Firestore:", err);
  }
}

export async function fetchFirestoreSearchHistory(userId: string): Promise<SearchHistoryItem[]> {
  try {
    const colRef = collection(db, "users", userId, "searchHistory");
    const q = query(colRef, orderBy("timestamp", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(doc => doc.data() as SearchHistoryItem);
  } catch (err) {
    console.error("Error fetching search history from Firestore:", err);
    return [];
  }
}

export async function saveFirestoreSearchHistoryItem(userId: string, item: SearchHistoryItem): Promise<void> {
  try {
    const docRef = doc(db, "users", userId, "searchHistory", item.id);
    await setDoc(docRef, item);
  } catch (err) {
    console.error("Error saving search history item to Firestore:", err);
  }
}

export async function fetchFirestorePriceAlerts(userId: string): Promise<PriceAlert[]> {
  try {
    const colRef = collection(db, "users", userId, "priceAlerts");
    const snap = await getDocs(colRef);
    return snap.docs.map(doc => doc.data() as PriceAlert);
  } catch (err) {
    console.error("Error fetching price alerts from Firestore:", err);
    return [];
  }
}

export async function saveFirestorePriceAlert(userId: string, alert: PriceAlert): Promise<void> {
  try {
    const docRef = doc(db, "users", userId, "priceAlerts", alert.id);
    await setDoc(docRef, alert);
  } catch (err) {
    console.error("Error saving price alert to Firestore:", err);
  }
}

export async function removeFirestorePriceAlert(userId: string, alertId: string): Promise<void> {
  try {
    const docRef = doc(db, "users", userId, "priceAlerts", alertId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error("Error deleting price alert from Firestore:", err);
  }
}
