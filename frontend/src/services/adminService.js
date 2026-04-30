import { 
  collection, 
  getDocs, 
  query, 
  where, 
  doc, 
  updateDoc,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./firebase";

export const adminService = {
  // User Management
  async getAllUsers() {
    const snapshot = await getDocs(collection(db, "users"));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async updateUserRole(uid, newRole) {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, { 
      role: newRole,
      updatedAt: serverTimestamp() 
    });
  },

  // Global Data Fetching
  async getGlobalStats() {
    const collections = ["users", "buildings", "units", "tenants", "payments", "bills"];
    const results = await Promise.all(
      collections.map(col => getDocs(collection(db, col)))
    );

    const stats = {
      users: results[0].size,
      buildings: results[1].size,
      units: results[2].size,
      tenants: results[3].size,
      payments: results[4].size,
      bills: results[5].size
    };

    // Calculate total rent collected this month
    const currentMonth = new Date().toISOString().slice(0, 7);
    const payments = results[4].docs.map(d => d.data());
    const monthlyPayments = payments.filter(p => p.month === currentMonth);
    
    stats.collectedMTD = monthlyPayments
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + (p.amount || 0), 0);
      
    stats.pendingMTD = monthlyPayments
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    return stats;
  },

  // Global Data List Views
  async getGlobalBuildings() {
    const snapshot = await getDocs(collection(db, "buildings"));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async getGlobalPayments() {
    const snapshot = await getDocs(collection(db, "payments"));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};
