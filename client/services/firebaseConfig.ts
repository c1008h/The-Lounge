import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";
import { CollectionReference, Firestore, collection, getFirestore } from "firebase/firestore";
import { getDatabase, ref, onValue, DatabaseReference, Database } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, 
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_REAL_TIME_DATABASE
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Set the persistence option
setPersistence(auth, browserSessionPersistence)
.then(() => {
  console.log("Authentication persistence set successfully.");
})
.catch((error) => {
  console.error("Error setting authentication persistence:", error);
});

const db: Firestore = getFirestore(app)
const database = getDatabase(app);

// const analytics = getAnalytics(app);

const userCollection: CollectionReference = collection(db, 'users')

const sessionsRT: DatabaseReference = ref(database, '/sessions');
const anonRT: DatabaseReference = ref(database, '/anon');

export { 
  app, 
  auth, 
  db, 
  userCollection, 
  database,
  sessionsRT,
  anonRT 
}