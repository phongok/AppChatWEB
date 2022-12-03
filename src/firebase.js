import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  // apiKey: "AIzaSyCaFjRcp6Mb4iH-1WsVYfuIoHLFfHrD-lM",
  // authDomain: "appchat-2fba9.firebaseapp.com",
  // projectId: "appchat-2fba9",
  // storageBucket: "appchat-2fba9.appspot.com",
  // messagingSenderId: "48875364331",
  // appId: "1:48875364331:web:23ac3c5e6561ae928743ae",
  // measurementId: "G-BFDZ4WRM5G"


  // apiKey: "AIzaSyBuwfmmjvnE-R4NdfCdQsPfUC4O_klW6JM",
  // authDomain: "unitchat-4f0a6.firebaseapp.com",
  // projectId: "unitchat-4f0a6",
  // storageBucket: "unitchat-4f0a6.appspot.com",
  // messagingSenderId: "929384700116",
  // appId: "1:929384700116:web:4a8be889271c1631ef4341"


  // apiKey: "AIzaSyA0X8QAmy1yjqHi3yxGQ-DAupFPF6ftCpU",
  // authDomain: "appchat-259e8.firebaseapp.com",
  // projectId: "appchat-259e8",
  // storageBucket: "appchat-259e8.appspot.com",
  // messagingSenderId: "865818806433",
  // appId: "1:865818806433:web:1cb9e3dd26258d7754c8e0",
  // measurementId: "G-FGVGYCEM4P"


  // apiKey: "AIzaSyDJjlPYJFbVPmxG-ANsmxegi_UP9tafA74",
  // authDomain: "appchatdemo-b10d1.firebaseapp.com",
  // projectId: "appchatdemo-b10d1",
  // storageBucket: "appchatdemo-b10d1.appspot.com",
  // messagingSenderId: "1001878841681",
  // appId: "1:1001878841681:web:9ee6538cff4efcae86cb70",
  // measurementId: "G-00TBBHTPVC"


  apiKey: "AIzaSyA0X8QAmy1yjqHi3yxGQ-DAupFPF6ftCpU",
  authDomain: "appchat-259e8.firebaseapp.com",
  projectId: "appchat-259e8",
  storageBucket: "appchat-259e8.appspot.com",
  messagingSenderId: "865818806433",
  appId: "1:865818806433:web:1cb9e3dd26258d7754c8e0",
  measurementId: "G-FGVGYCEM4P"
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()
