import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION_NAME = "units";

export const unitService = {
  async add(data) {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...data,
      floorNumber: parseInt(data.floorNumber),
      rentAmount: parseFloat(data.rentAmount),
      status: data.status || "vacant",
      createdAt: serverTimestamp()
    });
    return docRef.id;
  },

  async getAll(ownerId) {
    if (!ownerId) return [];
    const q = query(collection(db, COLLECTION_NAME), where("ownerId", "==", ownerId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async getByBuilding(buildingId, ownerId) {
    const q = query(
      collection(db, COLLECTION_NAME), 
      where("buildingId", "==", buildingId),
      where("ownerId", "==", ownerId)
    );
    const snapshot = await getDocs(q);
    const units = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Sort units locally by floor and then unit number
    return units.sort((a, b) => {
      if (a.floorNumber !== b.floorNumber) {
        return a.floorNumber - b.floorNumber;
      }
      return a.unitNumber.localeCompare(b.unitNumber, undefined, { numeric: true });
    });
  },

  async getAvailable(buildingId, ownerId) {
    const q = query(
      collection(db, COLLECTION_NAME), 
      where("buildingId", "==", buildingId),
      where("ownerId", "==", ownerId),
      where("status", "==", "vacant")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async update(id, data) {
    const { updateDoc, doc } = await import("firebase/firestore");
    await updateDoc(doc(db, COLLECTION_NAME, id), {
      ...data,
      floorNumber: parseInt(data.floorNumber),
      rentAmount: parseFloat(data.rentAmount),
      updatedAt: serverTimestamp()
    });
  }
};
