import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { buildingService } from '../services/buildingService';
import { unitService } from '../services/unitService';
import { tenantService } from '../services/tenantService';
import { paymentService } from '../services/paymentService';
import { billService } from '../services/billService';

export const useDashboardData = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalBuildings: 0,
    totalUnits: 0,
    vacantUnits: 0,
    activeTenants: 0,
    revenueMTD: 0,
    pendingMTD: 0,
    occupancyRate: 0,
    unpaidBillsCount: 0,
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      if (!currentUser) return;
      setLoading(true);
      try {
        const uid = currentUser.uid;
        const currentMonth = new Date().toISOString().slice(0, 7);

        const [buildings, units, tenants, payments, bills] = await Promise.all([
          buildingService.getAll(uid),
          unitService.getAll(uid),
          tenantService.getAll(uid),
          paymentService.getAll(uid, currentMonth),
          billService.getAll(uid)
        ]);

        const vacant = units.filter(u => u.status === 'vacant').length;
        const paid = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
        const pending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
        
        const occupancy = units.length > 0 ? Math.round(((units.length - vacant) / units.length) * 100) : 0;

        const unpaidBillsCount = bills.filter(b => b.status === 'pending').length;

        // Construct Recent Activities
        let activities = [];

        tenants.forEach(t => {
          if (t.createdAt) {
            activities.push({
              id: `tenant_${t.id}`,
              type: 'tenant',
              desc: `New tenant added: ${t.name}`,
              date: t.createdAt.toDate ? t.createdAt.toDate() : new Date(t.createdAt)
            });
          }
        });

        payments.filter(p => p.status === 'paid').forEach(p => {
          const dateVal = p.paymentDate || p.updatedAt;
          if (dateVal) {
            activities.push({
              id: `payment_${p.id}`,
              type: 'payment',
              desc: `₹${p.amount} received from ${p.tenantName}`,
              date: dateVal.toDate ? dateVal.toDate() : new Date(dateVal)
            });
          }
        });

        bills.forEach(b => {
          if (b.createdAt) {
            activities.push({
              id: `bill_${b.id}`,
              type: 'bill',
              desc: `New bill recorded: ${b.type} for ₹${b.amount}`,
              date: b.createdAt.toDate ? b.createdAt.toDate() : new Date(b.createdAt)
            });
          }
        });

        activities.sort((a, b) => b.date - a.date);
        const recentActivities = activities.slice(0, 5);

        setStats({
          totalBuildings: buildings.length,
          totalUnits: units.length,
          vacantUnits: vacant,
          activeTenants: tenants.length,
          revenueMTD: paid,
          pendingMTD: pending,
          occupancyRate: occupancy,
          unpaidBillsCount,
          recentActivities
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
