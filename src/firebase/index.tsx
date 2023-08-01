
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAfCjHoO8cyd9qCS-8sIyI8Ss_6Czgo_uw",
  authDomain: "threads-f5a5f.firebaseapp.com",
  projectId: "threads-f5a5f",
  storageBucket: "threads-f5a5f.appspot.com",
  messagingSenderId: "249791645842",
  appId: "1:249791645842:web:ce35084aac6a590f3d7e4b",
  measurementId: "G-7Z67HH5LTK"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);