/**
 * Canopy — Firebase Service
 * Auth, Firestore CRUD, and offline persistence.
 * Initialize Firebase once with environment variables.
 */

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app"
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from "firebase/auth"
import {
  getFirestore,
  enableIndexedDbPersistence,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  onSnapshot,
  writeBatch,
  Unsubscribe,
} from "firebase/firestore"
import { ActivityLog } from "./carbon-engine"
import { ChallengeProgress } from "./challenge-engine"
import { UnlockedAchievement } from "./achievement-engine"

// ---------------------------------------------------------------------------
// Firebase config from env vars
// ---------------------------------------------------------------------------
const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

let app: FirebaseApp
let firestoreEnabled = false

export function initFirebase() {
  if (!firebaseConfig.apiKey) return null // Not configured yet
  app = getApps().length ? getApp() : initializeApp(firebaseConfig)
  return app
}

export function getFirebaseAuth() {
  if (!app) initFirebase()
  if (!app) return null
  return getAuth(app)
}

export function getFirebaseDb() {
  if (!app) initFirebase()
  if (!app) return null
  const db = getFirestore(app)
  if (!firestoreEnabled) {
    // Enable offline persistence once
    if (typeof window !== "undefined") {
      enableIndexedDbPersistence(db).catch(() => {
        // Already enabled or multi-tab — safe to ignore
      })
      firestoreEnabled = true
    }
  }
  return db
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
export async function signInWithGoogle(): Promise<User | null> {
  const auth = getFirebaseAuth()
  if (!auth) return null
  const provider = new GoogleAuthProvider()
  provider.addScope("profile")
  provider.addScope("email")
  try {
    const result = await signInWithPopup(auth, provider)
    return result.user
  } catch {
    return null
  }
}

export async function signInWithEmail(email: string, password: string): Promise<User | null> {
  const auth = getFirebaseAuth()
  if (!auth) return null
  try {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return result.user
  } catch (error) {
    console.error("Sign in error:", error)
    throw error
  }
}

export async function signUpWithEmail(email: string, password: string): Promise<User | null> {
  const auth = getFirebaseAuth()
  if (!auth) return null
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    return result.user
  } catch (error) {
    console.error("Sign up error:", error)
    throw error
  }
}

export async function signOut(): Promise<void> {
  const auth = getFirebaseAuth()
  if (!auth) return
  await firebaseSignOut(auth)
}

export function onAuthChange(callback: (user: User | null) => void): Unsubscribe {
  const auth = getFirebaseAuth()
  if (!auth) return () => {}
  return onAuthStateChanged(auth, callback)
}

// ---------------------------------------------------------------------------
// User Profile
// ---------------------------------------------------------------------------
export interface UserProfile {
  uid: string
  displayName: string
  email: string
  photoURL: string | null
  createdAt: number
  settings: {
    notifications: boolean
    weeklyReport: boolean
  }
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  const db = getFirebaseDb()
  if (!db) return
  await setDoc(doc(db, "users", profile.uid), profile, { merge: true })
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const db = getFirebaseDb()
  if (!db) return null
  const snap = await getDoc(doc(db, "users", uid))
  return snap.exists() ? (snap.data() as UserProfile) : null
}

// ---------------------------------------------------------------------------
// Activity Logs
// ---------------------------------------------------------------------------
export async function saveActivityLog(uid: string, log: ActivityLog): Promise<string> {
  const db = getFirebaseDb()
  if (!db) return log.id
  const ref = await addDoc(collection(db, "users", uid, "activities"), {
    ...log,
    timestamp: Timestamp.fromMillis(log.timestamp),
  })
  return ref.id
}

export async function getActivityLogs(uid: string, daysBack = 90): Promise<ActivityLog[]> {
  const db = getFirebaseDb()
  if (!db) return []
  const since = Date.now() - daysBack * 86_400_000
  const q = query(
    collection(db, "users", uid, "activities"),
    where("timestamp", ">=", Timestamp.fromMillis(since)),
    orderBy("timestamp", "desc"),
    limit(500)
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({
    ...(d.data() as Omit<ActivityLog, "timestamp">),
    id: d.id,
    timestamp: (d.data().timestamp as Timestamp).toMillis(),
  }))
}

export function subscribeToActivityLogs(
  uid: string,
  callback: (logs: ActivityLog[]) => void
): Unsubscribe {
  const db = getFirebaseDb()
  if (!db) return () => {}
  const since = Date.now() - 90 * 86_400_000
  const q = query(
    collection(db, "users", uid, "activities"),
    where("timestamp", ">=", Timestamp.fromMillis(since)),
    orderBy("timestamp", "desc"),
    limit(500)
  )
  return onSnapshot(q, (snap) => {
    const logs = snap.docs.map((d) => ({
      ...(d.data() as Omit<ActivityLog, "timestamp">),
      id: d.id,
      timestamp: (d.data().timestamp as Timestamp).toMillis(),
    }))
    callback(logs)
  })
}

// ---------------------------------------------------------------------------
// Challenges
// ---------------------------------------------------------------------------
export async function saveChallengeProgress(uid: string, progress: ChallengeProgress): Promise<void> {
  const db = getFirebaseDb()
  if (!db) return
  await setDoc(doc(db, "users", uid, "challenges", progress.challengeId), progress, { merge: true })
}

export async function getChallengeProgress(uid: string): Promise<ChallengeProgress[]> {
  const db = getFirebaseDb()
  if (!db) return []
  const snap = await getDocs(collection(db, "users", uid, "challenges"))
  return snap.docs.map((d) => d.data() as ChallengeProgress)
}

// ---------------------------------------------------------------------------
// Achievements
// ---------------------------------------------------------------------------
export async function saveAchievement(uid: string, achievement: UnlockedAchievement): Promise<void> {
  const db = getFirebaseDb()
  if (!db) return
  await setDoc(doc(db, "users", uid, "achievements", achievement.achievementId), achievement)
}

export async function getAchievements(uid: string): Promise<UnlockedAchievement[]> {
  const db = getFirebaseDb()
  if (!db) return []
  const snap = await getDocs(collection(db, "users", uid, "achievements"))
  return snap.docs.map((d) => d.data() as UnlockedAchievement)
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------
export async function saveSettings(uid: string, settings: Record<string, unknown>): Promise<void> {
  const db = getFirebaseDb()
  if (!db) return
  await setDoc(doc(db, "users", uid, "settings", "preferences"), settings, { merge: true })
}

export async function getSettings(uid: string): Promise<Record<string, unknown> | null> {
  const db = getFirebaseDb()
  if (!db) return null
  const snap = await getDoc(doc(db, "users", uid, "settings", "preferences"))
  return snap.exists() ? snap.data() : null
}
