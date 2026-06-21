/**
 * Canopy — Firebase Initialization (safe singleton)
 * Always import from here, never call initializeApp directly elsewhere.
 */

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app"

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

export function getFirebaseApp(): FirebaseApp | null {
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "your_firebase_api_key") return null
  return getApps().length ? getApp() : initializeApp(firebaseConfig)
}
