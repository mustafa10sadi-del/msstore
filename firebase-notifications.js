// MS Store Firebase Notifications - FCM setup
// جاهز: يستخدم VAPID KEY الصحيح ويعرض التوكن حتى ترسله كتجربة من Firebase

const firebaseConfig = {
  apiKey: "AIzaSyDaK4F8S6tmdSVTFEMWXInk5oQABPSSVo",
  authDomain: "msstore-5c5f4.firebaseapp.com",
  projectId: "msstore-5c5f4",
  storageBucket: "msstore-5c5f4.appspot.com",
  messagingSenderId: "25475613602",
  appId: "1:25475613602:web:98be2e7aec1bb125545dbb"
};

const MSSTORE_VAPID_KEY = "BFG_qDpx9U7LIRGfniUkhtPzs_72PNoaVpakCFcUuWmnwsL-SL-NKLNlbCQ_564AJUjGBURatxv3iT-PA7iMYco";

(function () {
  if (!("Notification" in window)) {
    alert("هذا المتصفح لا يدعم الإشعارات");
    return;
  }

  if (!("serviceWorker" in navigator)) {
    alert("Service Worker غير مدعوم بهذا المتصفح");
    return;
  }

  if (!window.firebase || !firebase.messaging) {
    alert("Firebase Messaging لم يتم تحميله");
    return;
  }

  try {
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
  } catch (e) {
    console.log("Firebase init error", e);
  }

  const messaging = firebase.messaging();

  async function saveToken(token) {
    try {
      if (!firebase.database) return;
      const safeKey = token.replace(/[.#$\[\]/]/g, "_");
      await firebase.database().ref("fcmTokens/" + safeKey).set({
        token,
        userAgent: navigator.userAgent,
        platform: navigator.platform || "web",
        updatedAt: Date.now()
      });
      console.log("تم حفظ التوكن بقاعدة البيانات ✅");
    } catch (e) {
      console.log("لم يتم حفظ التوكن بقاعدة البيانات، لكن التوكن موجود:", e);
    }
  }

  async function startFirebaseNotifications() {
    try {
      const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
      await registration.update();
      console.log("Firebase SW جاهز ✅", registration.scope);

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        alert("لم يتم السماح بالإشعارات");
        return null;
      }

      const token = await messaging.getToken({
        vapidKey: MSSTORE_VAPID_KEY,
        serviceWorkerRegistration: registration
      });

      if (token) {
        localStorage.setItem("msstore_fcm_token", token);
        console.log("FCM TOKEN ✅", token);
        await saveToken(token);
        window.dispatchEvent(new CustomEvent("msstore-fcm-ready", { detail: { token } }));

        // يظهر التوكن حتى تنسخه وتلصقه في Firebase > Send test message
        alert("FCM TOKEN:\n\n" + token);
        return token;
      }

      alert("ما طلع توكن FCM");
      return null;
    } catch (err) {
      console.log("خطأ بتفعيل Firebase Notifications ❌", err);
      alert("خطأ بتفعيل الإشعارات:\n" + (err && err.message ? err.message : err));
      return null;
    }
  }

  messaging.onMessage(function (payload) {
    console.log("رسالة والموقع مفتوح:", payload);
    const title = (payload.notification && payload.notification.title) || (payload.data && payload.data.title) || "MS Store";
    const body = (payload.notification && payload.notification.body) || (payload.data && payload.data.body) || "وصل إشعار جديد";
    const icon = (payload.notification && payload.notification.icon) || "/icon-192.png";

    try {
      new Notification(title, { body, icon, badge: "/icon-192.png" });
    } catch (e) {
      alert(title + "\n" + body);
    }
  });

  window.enableMSStoreNotifications = startFirebaseNotifications;
  window.addEventListener("load", function () {
    setTimeout(startFirebaseNotifications, 1200);
  });
})();
