// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAKfMWXDJzZ-rVtm49ixPQoo6rZgzGMKfA",
  authDomain: "taskapp-57fb3.firebaseapp.com",
  projectId: "taskapp-57fb3",
  storageBucket: "taskapp-57fb3.appspot.com",
  messagingSenderId: "565439097942",
  appId: "1:565439097942:android:f13463fccc22d9f4b95ff7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
