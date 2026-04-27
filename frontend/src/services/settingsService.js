import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION_NAME = "settings";

export const DEFAULT_SETTINGS = {
  defaultRentIncrementPercentage: 5,
  lateFeeAmount: 500,
  currencySymbol: '₹',
  billingCycle: 'monthly'
};

export const settingsService = {
  async get(ownerId) {
    if (!ownerId) return DEFAULT_SETTINGS;
    
    const docRef = doc(db, COLLECTION_NAME, ownerId);
    const snapshot = await getDoc(docRef);
    
    if (snapshot.exists()) {
      return { ...DEFAULT_SETTINGS, ...snapshot.data() };
    }
    
    return DEFAULT_SETTINGS;
  },

  async update(ownerId, data) {
    if (!ownerId) return;
    const docRef = doc(db, COLLECTION_NAME, ownerId);
    await setDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    }, { merge: true });
  }
};
