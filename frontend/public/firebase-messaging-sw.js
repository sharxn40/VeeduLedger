importScripts('https://www.gstatic.com/firebasejs/10.12.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyB0CEoGb76EcTt8Mqd_PwO8RmxjF535fN8",
  authDomain: "veeduledger.firebaseapp.com",
  projectId: "veeduledger",
  storageBucket: "veeduledger.firebasestorage.app",
  messagingSenderId: "680332782849",
  appId: "1:680332782849:web:bdace392757e5e8a707f00"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.svg'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
