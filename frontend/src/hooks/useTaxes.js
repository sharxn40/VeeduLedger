import { useState, useEffect, useCallback } from 'react';
import { taxService } from '../services/taxService';

export const useTaxes = (ownerId, filters = {}) => {
  const [taxes, setTaxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTaxes = useCallback(async () => {
    if (!ownerId) return;
    setLoading(true);
    try {
      const data = await taxService.getAll(ownerId, filters);
      setTaxes(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch taxes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [ownerId, filters.buildingId, filters.status]);

  useEffect(() => {
    fetchTaxes();
  }, [fetchTaxes]);

  return { taxes, loading, error, refresh: fetchTaxes };
};
