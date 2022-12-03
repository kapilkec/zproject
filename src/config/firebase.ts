// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore} from "firebase/firestore"
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDKPdTVPxd0mca7NgwZSvu8IzVK9jYBa4k",
  authDomain: "socialmedia-3d540.firebaseapp.com",
  projectId: "socialmedia-3d540",
  storageBucket: "socialmedia-3d540.appspot.com",
  messagingSenderId: "742510255817",
  appId: "1:742510255817:web:ca58abb1fd7725ac537718"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);