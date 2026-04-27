import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { buildingService } from '../services/buildingService';
import { unitService } from '../services/unitService';
import { tenantService } from '../services/tenantService';
import { paymentService } from '../services/paymentService';

export const useDashboardData = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalBuildings: 0,
    totalUnits: 0,
    vacantUnits: 0,
    activeTenants: 0,
    revenueMTD: 0,
    pendingMTD: 0,
    occupancyRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      if (!currentUser) return;
      setLoading(true);
      try {
        const uid = currentUser.uid;
        const currentMonth = new Date().toISOString().slice(0, 7);

        const [buildings, units, tenants, payments] = await Promise.all([
          buildingService.getAll(uid),
          unitService.getAll(uid),
          tenantService.getAll(uid),
          paymentService.getAll(uid, currentMonth)
        ]);

        const vacant = units.filter(u => u.status === 'vacant').length;
        const paid = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
        const pending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
        
        const occupancy = units.length > 0 ? Math.round(((units.length - vacant) / units.length) * 100) : 0;

        setStats({
          totalBuildings: buildings.length,
          totalUnits: units.length,
          vacantUnits: vacant,
          activeTenants: tenants.length,
          revenueMTD: paid,
          pendingMTD: pending,
          occupancyRate: occupancy
        });
      } catch (err) {
        console.error("Dashboard data fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [currentUser]);

  return { stats, loading };
};
