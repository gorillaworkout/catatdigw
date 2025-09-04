import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth"
import { getFirestore, type Firestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef",
}

let app: FirebaseApp | undefined
let auth: Auth | undefined
let googleProvider: GoogleAuthProvider | undefined
let db: Firestore | undefined

// Initialize Firebase only on client side
if (typeof window !== "undefined") {
  // Check if environment variables are properly configured
  const isConfigured = process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
                      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
                      process.env.NEXT_PUBLIC_FIREBASE_APP_ID

  if (isConfigured) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    auth = getAuth(app)
    googleProvider = new GoogleAuthProvider()
    db = getFirestore(app)
    console.log("Firebase initialized successfully!")
  } else {
    console.warn("Firebase environment variables not configured. Please create .env.local file with your Firebase config.")
  }
}

export { auth, googleProvider, db }
export default app
