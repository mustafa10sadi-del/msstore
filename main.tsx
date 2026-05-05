import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./firebase-notifications";

// تسجيل Service Worker للإشعارات
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./firebase-messaging-sw.js')
    .then((registration) => {
      console.log('تم تسجيل الإشعارات ✅', registration);
    })
    .catch((err) => {
      console.log('فشل تسجيل الإشعارات ❌', err);
    });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
