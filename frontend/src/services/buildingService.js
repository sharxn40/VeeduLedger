import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION_NAME = "buildings";

export const buildingService = {
  async add(data) {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...data,
      totalFloors: parseInt(data.totalFloors),
      createdAt: serverTimestamp()
    });
    return docRef.id;
  },

  async getAll(ownerId) {
    const q = query(collection(db, COLLECTION_NAME), where("ownerId", "==", ownerId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async delete(id) {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  }
};
