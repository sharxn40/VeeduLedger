import { 
  collection, 
  getDocs, 
  query, 
  where, 
  writeBatch,
  doc, 
  serverTimestamp,
  updateDoc,
  increment
} from "firebase/firestore";
import { db } from "./firebase";
import { calculateAdjustedRent } from "../utils/financialUtils";

const COLLECTION_NAME = "payments";

export const paymentService = {
  async generateMonthly(ownerId, tenants) {
    if (!ownerId || !tenants.length) return 0;
    
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const batch = writeBatch(db);
    
    // 1. Fetch existing payments for this month to avoid duplicates
    const q = query(
      collection(db, COLLECTION_NAME), 
      where("ownerId", "==", ownerId),
      where("month", "==", currentMonth)
    );
    const existingSnapshot = await getDocs(q);
    const existingIds = existingSnapshot.docs.map(doc => doc.id);

    // 2. Create pending payments with ADJUSTED rent
    let count = 0;
    tenants.forEach(tenant => {
      const deterministicId = `${tenant.id}_${currentMonth}`;
      
      if (!existingIds.includes(deterministicId)) {
        const adjustedAmount = calculateAdjustedRent(
          tenant.rentAmount, 
          tenant.rentStartDate, 
          tenant.rentIncrementPercentage
        );

        const paymentRef = doc(db, COLLECTION_NAME, deterministicId);
        batch.set(paymentRef, {
          tenantId: tenant.id,
          tenantName: tenant.name,
          buildingId: tenant.buildingId,
          buildingName: tenant.buildingName,
          unitIds: tenant.unitIds,
          unitNumbers: tenant.unitNumbers,
          month: currentMonth,
          amount: adjustedAmount,
          baseAmount: adjustedAmount, // For late fee tracking
          lateFee: 0,
          status: "pending",
          paymentDate: null,
          ownerId: ownerId,
          createdAt: serverTimestamp()
        });
        count++;
      }
    });

    if (count > 0) {
      await batch.commit();
    }
    return count;
  },

  async applyLateFees(ownerId, month, feeAmount) {
    if (!ownerId || !month || !feeAmount) return 0;

    const q = query(
      collection(db, COLLECTION_NAME),
      where("ownerId", "==", ownerId),
      where("month", "==", month),
      where("status", "==", "pending"),
      where("lateFee", "==", 0) // Only apply if not already applied
    );

    const snapshot = await getDocs(q);
    const batch = writeBatch(db);
    let count = 0;

    snapshot.docs.forEach(paymentDoc => {
      const paymentRef = doc(db, COLLECTION_NAME, paymentDoc.id);
      batch.update(paymentRef, {
        lateFee: feeAmount,
        amount: increment(feeAmount),
        updatedAt: serverTimestamp()
      });
      count++;
    });

    if (count > 0) {
      await batch.commit();
    }
    return count;
  },

  async getAll(ownerId, monthFilter = '', statusFilter = '', buildingId = '') {
    if (!ownerId) return [];
    
    let q = query(collection(db, COLLECTION_NAME), where("ownerId", "==", ownerId));
    
    if (monthFilter) q = query(q, where("month", "==", monthFilter));
    if (statusFilter) q = query(q, where("status", "==", statusFilter));
    if (buildingId) q = query(q, where("buildingId", "==", buildingId));

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async markAsPaid(id) {
    if (!id) return;
    const paymentRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(paymentRef, {
      status: "paid",
      paymentDate: serverTimestamp()
    });
  },

  async delete(id) {
    if (!id) return;
    const { deleteDoc, doc } = await import("firebase/firestore");
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  }
};
