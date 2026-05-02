(function () {
  const firebaseConfig = {
    apiKey: "AIzaSyAn0y49jyaoLHyL6P7bce7IHcrsVNJ3ERM",
    authDomain: "msstore-5c5f4.firebaseapp.com",
    databaseURL: "https://msstore-5c5f4-default-rtdb.firebaseio.com",
    projectId: "msstore-5c5f4",
    storageBucket: "msstore-5c5f4.firebasestorage.app",
    messagingSenderId: "254756613602",
    appId: "1:254756613602:web:msstore"
  };

  const VAPID_KEY = "BKx-21HHw2rOX8airGQK5PeOy_lqj56tZl3P-wckQ1RBoTW5s8RZ0nWUcSw8Xu5vzv6bRJ0o8oJ-_rKU1RT7SyU";

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector('script[src="' + src + '"]')) return resolve();
      const s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  async function ensureFirebase() {
    if (!window.firebase || !firebase.apps) {
      await loadScript("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
    }
    if (!firebase.messaging) {
      await loadScript("https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js");
    }
    if (!firebase.database) {
      await loadScript("https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js");
    }
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
  }

  function safeKey(token) {
    return String(token).replace(/[.#$/\[\]]/g, "_");
  }

  async function saveToken(token) {
    try {
      if (!firebase.database) return;
      const data = {
        token,
        userAgent: navigator.userAgent || "",
        platform: navigator.platform || "",
        updatedAt: firebase.database.ServerValue.TIMESTAMP
      };
      const key = safeKey(token);
      await firebase.database().ref("fcmTokens/" + key).update(data);
      await firebase.database().ref("pushTokens/" + key).update(data);
      localStorage.setItem("ms_fcm_token", token);
      console.log("MS FCM token saved:", token);
    } catch (err) {
      console.error("MS FCM token save failed:", err);
    }
  }

  async function enableFirebasePushNotifications() {
    try {
      await ensureFirebase();

      if (!("serviceWorker" in navigator)) {
        alert("هذا المتصفح لا يدعم Service Worker");
        return null;
      }
      if (!("Notification" in window)) {
        alert("هذا المتصفح لا يدعم الإشعارات");
        return null;
      }

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        alert("لم يتم السماح بالإشعارات");
        return null;
      }

      const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js", { scope: "/" });
      await navigator.serviceWorker.ready;

      const messaging = firebase.messaging();
      const token = await messaging.getToken({
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration
      });

      if (!token) {
        alert("لم يتم إنشاء توكن الإشعارات. احذف التطبيق وثبته من جديد.");
        return null;
      }

      await saveToken(token);

      messaging.onMessage(function (payload) {
        const title = (payload.notification && payload.notification.title) || (payload.data && payload.data.title) || "متجر MS";
        const body = (payload.notification && payload.notification.body) || (payload.data && payload.data.body) || "وصل إشعار جديد";
        if (Notification.permission === "granted") {
          new Notification(title, { body, icon: "/icon-192.png", badge: "/icon-192.png" });
        }
      });

      alert("تم تفعيل الإشعارات على هذا الجهاز ✅");
      return token;
    } catch (err) {
      console.error("MS Push enable failed:", err);
      alert("تعذر تفعيل الإشعارات. جرّب حذف التطبيق وفتح الموقع من Chrome.");
      return null;
    }
  }

  window.enableFirebasePushNotifications = enableFirebasePushNotifications;

  document.addEventListener("click", function (e) {
    const el = e.target && e.target.closest ? e.target.closest("button, .btn, [role='button']") : null;
    if (!el) return;
    const text = (el.innerText || el.textContent || "").trim();
    if (text.includes("تفعيل الإشعارات") || text.includes("مفعل على هذا الجهاز") || text.includes("السماح") || text.includes("الإشعارات")) {
      enableFirebasePushNotifications();
    }
  });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("/firebase-messaging-sw.js", { scope: "/" }).catch(console.error);
    });
  }
})();
