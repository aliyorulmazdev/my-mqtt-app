import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyAh-RaP9N5aQBhcRIEBxvNB-xq99QTGMNk",
    authDomain: "test-temp-data.firebaseapp.com",
    projectId: "test-temp-data",
    storageBucket: "test-temp-data.appspot.com",
    messagingSenderId: "700865036654",
    appId: "1:700865036654:web:643efd051ba1d682c3817f"
  };
  
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db};