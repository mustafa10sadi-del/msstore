ارفع هذه الملفات على GitHub بدل الموجودة:

index.html
manifest.json
firebase-notifications.js
firebase-messaging-sw.js
main.tsx

واحذف ملفات OneSignal إذا موجودة:
OneSignalSDKWorker.js
OneSignalSDKUpdaterWorker.js

بعد الرفع:
1) احذف التطبيق المثبت القديم من الموبايل.
2) امسح كاش الموقع من Chrome.
3) افتح https://msstore95.github.io وثبته من جديد.
4) وافق على الإشعارات.
5) سيظهر لك FCM TOKEN في رسالة تنبيه، انسخه.
6) Firebase > Messaging > Send test message > الصق التوكن.
