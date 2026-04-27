import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  doc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp,
  orderBy
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";

const COLLECTION_NAME = "bills";

export const billService = {
  async add(billData) {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...billData,
      status: "pending",
      paymentReferenceId: null,
      paymentDate: null,
      receiptUrl: null,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  },

  async getAll(ownerId, filters = {}) {
    if (!ownerId) return [];
    
    let q = query(
      collection(db, COLLECTION_NAME), 
      where("ownerId", "==", ownerId)
    );
    
    if (filters.buildingId) {
      q = query(q, where("buildingId", "==", filters.buildingId));
    }
    
    if (filters.unitId) {
      q = query(q, where("unitId", "==", filters.unitId));
    }
    
    if (filters.status) {
      q = query(q, where("status", "==", filters.status));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async markAsPaid(id, referenceId, receiptUrl, amount) {
    const billRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(billRef, {
      status: "paid",
      amount: parseFloat(amount),
      paymentReferenceId: referenceId,
      receiptUrl: receiptUrl,
      paymentDate: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  },

  async uploadReceipt(file, ownerId) {
    const filename = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `receipts/${ownerId}/bills/${filename}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  },

  async delete(id) {
    const billRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(billRef);
  }
};
