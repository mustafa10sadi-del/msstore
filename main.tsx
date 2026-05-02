import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// 🔥 Firebase
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// 🔥 إعدادات Firebase (نفس اللي عندك)
const firebaseConfig = {
  apiKey: "AIzaSyAn0y49jyaoLHyL6P7bce7IHcrsVNJ3ERM",
  authDomain: "msstore-5c5f4.firebaseapp.com",
  projectId: "msstore-5c5f4",
  storageBucket: "msstore-5c5f4.firebasestorage.app",
  messagingSenderId: "254756613602",
  appId: "1:254756613602:web:YOUR_APP_ID"
};

// 🔥 تشغيل
