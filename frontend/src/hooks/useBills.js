import { useState, useEffect, useCallback } from 'react';
import { billService } from '../services/billService';

export const useBills = (ownerId, filters = {}) => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBills = useCallback(async () => {
    if (!ownerId) return;
    setLoading(true);
    try {
      const data = await billService.getAll(ownerId, filters);
      setBills(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch bills');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [ownerId, filters.buildingId, filters.unitId, filters.status]);

  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  return { bills, loading, error, refresh: fetchBills };
};
