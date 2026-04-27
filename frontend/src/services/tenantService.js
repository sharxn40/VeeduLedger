import { 
  collection, 
  getDocs, 
  getDoc,
  query, 
  where, 
  writeBatch,
  doc, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION_NAME = "tenants";

export const tenantService = {
  async add(data) {
    if (!data.unitIds || data.unitIds.length === 0 || !data.ownerId) {
      throw new Error("Missing unitIds or ownerId");
    }
    
    const batch = writeBatch(db);
    
    // 1. Create Tenant
    const tenantRef = doc(collection(db, COLLECTION_NAME));
    batch.set(tenantRef, {
      ...data,
      rentAmount: parseFloat(data.rentAmount),
      rentIncrementPercentage: parseFloat(data.rentIncrementPercentage) || 0,
      createdAt: serverTimestamp()
    });

    // 2. Update all selected Units Status to "occupied"
    data.unitIds.forEach(unitId => {
      const unitRef = doc(db, "units", unitId);
      batch.update(unitRef, { status: "occupied" });
    });

    await batch.commit();
    return tenantRef.id;
  },

  async getAll(ownerId) {
    if (!ownerId) return [];
    const q = query(collection(db, COLLECTION_NAME), where("ownerId", "==", ownerId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async getByBuilding(buildingId, ownerId) {
    if (!buildingId || !ownerId) return [];
    const q = query(
      collection(db, COLLECTION_NAME), 
      where("buildingId", "==", buildingId),
      where("ownerId", "==", ownerId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async getById(id) {
    if (!id) return null;
    const docRef = doc(db, COLLECTION_NAME, id);
    const snapshot = await getDoc(docRef);
    return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
  },

  async delete(id, unitIds) {
    if (!id) throw new Error("Missing tenant ID");
    const batch = writeBatch(db);

    // 1. Delete Tenant
    batch.delete(doc(db, COLLECTION_NAME, id));

    // 2. Update all associated Unit Status back to "vacant"
    if (unitIds && Array.isArray(unitIds)) {
      unitIds.forEach(unitId => {
        const unitRef = doc(db, "units", unitId);
        batch.update(unitRef, { status: "vacant" });
      });
    }

    await batch.commit();
  }
};
