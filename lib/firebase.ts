import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth"
import { getFirestore, type Firestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

let app: FirebaseApp | undefined
let auth: Auth | undefined
let googleProvider: GoogleAuthProvider | undefined
let db: Firestore | undefined

if (typeof window !== "undefined") {
  // Only initialize on client side
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

  // Initialize Firebase Authentication and get a reference to the service
  auth = getAuth(app)
  googleProvider = new GoogleAuthProvider()

  // Initialize Cloud Firestore and get a reference to the service
  db = getFirestore(app)
  
  console.log("Firebase initialized successfully!")
}

export { auth, googleProvider, db }
export default app
