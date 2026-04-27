import { useState, useEffect, useCallback } from 'react';
import { paymentService } from '../services/paymentService';

export const usePayments = (ownerId, monthFilter = '', statusFilter = '') => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPayments = useCallback(async () => {
    if (!ownerId) return;
    setLoading(true);
    try {
      const data = await paymentService.getAll(ownerId, monthFilter, statusFilter);
      // Sort by month descending, then tenant name
      const sorted = data.sort((a, b) => {
        if (a.month !== b.month) return b.month.localeCompare(a.month);
        return a.tenantName.localeCompare(b.tenantName);
      });
      setPayments(sorted);
      setError(null);
    } catch (err) {
      setError('Failed to fetch payments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [ownerId, monthFilter, statusFilter]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return { payments, loading, error, refresh: fetchPayments };
};
