// Firebase Web Push setup for MS Store
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDakH4F8s6tmdSVTFENXMInK5oQABPSSVo",
  authDomain: "msstore-5c5f4.firebaseapp.com",
  databaseURL: "https://msstore-5c5f4-default-rtdb.firebaseio.com",
  projectId: "msstore-5c5f4",
  storageBucket: "msstore-5c5f4.firebasestorage.app",
  messagingSenderId: "254756613602",
  appId: "1:254756613602:web:35825d0b88c3dae8545dbb",
  measurementId: "G-QCWRTL41RZ"
};

const VAPID_KEY = "BKx-21HHw2rOX8airGQK5PeOy_lqj56tZl3P-wckQ1RBoTW5s8RZ0nWUcSw8Xu5vzv6bRJ0o8oJ-_rKU1RT7SyU";

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

async function registerNotifications() {
  try {
    if (!("Notification" in window)) return;

    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;

    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration
    });

    console.log("FCM TOKEN:", token);
    localStorage.setItem("ms_fcm_token", token);
  } catch (err) {
    console.error("FCM error:", err);
  }
}

registerNotifications();

onMessage(messaging, (payload) => {
  const title = payload.notification?.title || payload.data?.title || "متجر MS";
  const body = payload.notification?.body || payload.data?.body || "وصل إشعار جديد";

  if (Notification.permission === "granted") {
    new Notification(title, {
      body,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      data: payload.data || {}
    });
  }
});
