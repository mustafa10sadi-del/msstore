ارفع هذه الملفات إلى GitHub:
1) firebase-messaging-sw.js في الجذر بجانب index.html
2) firebase-notifications.js في مجلد src إذا كان main.tsx داخل src
3) main.tsx استبدل الملف الحالي

بعد الرفع:
- احذف تطبيق MS من الهاتف
- امسح بيانات الموقع من Chrome
- افتح msstore95.github.io من Chrome
- اسمح بالإشعارات
- ثبت التطبيق من زر تثبيت
- جرّب إرسال إشعار من Firebase Messaging
