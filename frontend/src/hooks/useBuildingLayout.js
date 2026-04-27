import { useState, useEffect, useMemo } from 'react';
import { unitService } from '../services/unitService';
import { tenantService } from '../services/tenantService';
import { paymentService } from '../services/paymentService';

/**
 * Optimized hook to fetch and merge building layout data.
 * Fetches only the necessary records for the specific building and current month.
 */
export const useBuildingLayout = (buildingId, ownerId) => {
  const [data, setData] = useState({
    units: [],
    tenants: [],
    payments: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!buildingId || !ownerId) return;
      setLoading(true);
      try {
        const currentMonth = new Date().toISOString().slice(0, 7);
        
        // OPTIMIZED: Only fetch data relevant to this building
        const [units, tenants, payments] = await Promise.all([
          unitService.getByBuilding(buildingId, ownerId),
          tenantService.getByBuilding(buildingId, ownerId),
          paymentService.getAll(ownerId, currentMonth, '', buildingId)
        ]);

        setData({ units, tenants, payments });
        setError(null);
      } catch (err) {
        setError('Failed to load layout data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [buildingId, ownerId]);

  // Merge logic remains largely the same but now works on smaller, optimized datasets
  const layout = useMemo(() => {
    if (!data.units.length) return [];

    const floorsMap = {};

    data.units.forEach(unit => {
      const floor = unit.floorNumber || 0;
      if (!floorsMap[floor]) floorsMap[floor] = [];

      // Check tenant list (already filtered by building)
      const tenant = data.tenants.find(t => t.unitIds?.includes(unit.id));
      
      // Check payment list (already filtered by building and month)
      const payment = tenant ? data.payments.find(p => p.tenantId === tenant.id) : null;

      let status = 'vacant'; 
      if (tenant) {
        status = payment?.status === 'paid' ? 'paid' : 'pending'; 
      }

      floorsMap[floor].push({
        ...unit,
        tenant,
        payment,
        status
      });
    });

    return Object.keys(floorsMap)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .map(floor => ({
        floorNumber: floor,
        units: floorsMap[floor].sort((a, b) => a.unitNumber.localeCompare(b.unitNumber, undefined, { numeric: true }))
      }));
  }, [data]);

  return { layout, loading, error };
};
