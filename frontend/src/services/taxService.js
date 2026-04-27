import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  doc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";

const COLLECTION_NAME = "taxes";

export const taxService = {
  async add(taxData) {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...taxData,
      status: "pending",
      verificationStatus: "pending",
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
    
    if (filters.status) {
      q = query(q, where("status", "==", filters.status));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async uploadReceipt(file, ownerId) {
    const filename = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `receipts/${ownerId}/taxes/${filename}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  },

  async markAsPaid(id, referenceId, receiptUrl, amount) {
    const taxRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(taxRef, {
      status: "paid",
      amount: parseFloat(amount),
      paymentReferenceId: referenceId,
      receiptUrl: receiptUrl,
      paymentDate: serverTimestamp(),
      verificationStatus: "pending",
      updatedAt: serverTimestamp()
    });
  },

  async verify(id) {
    const taxRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(taxRef, {
      verificationStatus: "verified",
      updatedAt: serverTimestamp()
    });
  },

  async delete(id) {
    const taxRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(taxRef);
  }
};
