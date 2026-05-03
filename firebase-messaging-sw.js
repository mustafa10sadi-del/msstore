import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging.js";

const firebaseConfig = {
  apiKey: "AIzaSyDakH4F8S6tmdSVTFENXMINk5oQABPSSVo",
  authDomain: "msstore-5c5f4.firebaseapp.com",
  projectId: "msstore-5c5f4",
  storageBucket: "msstore-5c5f4.appspot.com",
  messagingSenderId: "254756613602",
  appId: "1:254756613602:web:35825d0b88c3dae8545dbb"
};

const VAPID_KEY = "BFG_qDpx9U7LlRGfniUkhtPzs_72PNoaVpakCFcUuWmnwsL-SL-NKLNIbCQ_564AJUjGBURatxv3iT-PA7iMYco";

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

async function startFCM() {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
      const token = await getToken(messaging, { vapidKey: VAPID_KEY, serviceWorkerRegistration: registration });
      if (token) { alert("تم التفعيل بنجاح! TOKEN: " + token); }
    }
  } catch (err) { console.error(err); }
}
startFCM();

onMessage(messaging, (payload) => {
  new Notification(payload.notification.title, { body: payload.notification.body, icon: '/icons/icon-192.png' });
});
