import { getToken, onMessage } from 'firebase/messaging';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { messaging, db } from './firebase';

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

export const messagingService = {
  async requestPermission(userId) {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await getToken(messaging, { vapidKey: VAPID_KEY });
        if (token) {
          await this.saveTokenToFirestore(userId, token);
          return token;
        }
      }
      return null;
    } catch (error) {
      console.error("Notification permission error:", error);
      return null;
    }
  },

  async saveTokenToFirestore(userId, token) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        fcmTokens: arrayUnion(token),
        notificationsEnabled: true
      });
    } catch (error) {
      console.error("Error saving token:", error);
    }
  },

  onMessageListener() {
    return new Promise((resolve) => {
      onMessage(messaging, (payload) => {
        resolve(payload);
      });
    });
  }
};
