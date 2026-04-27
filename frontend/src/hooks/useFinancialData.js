import { useState, useEffect, useCallback } from 'react';

/**
 * A generic hook to manage financial records (Bills, Taxes, etc.)
 * Reduces code duplication across financial modules.
 */
export const useFinancialData = (service, ownerId, filters = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!ownerId) return;
    setLoading(true);
    try {
      const result = await service.getAll(ownerId, filters);
      setData(result);
      setError(null);
    } catch (err) {
      setError(`Failed to fetch financial records`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [ownerId, JSON.stringify(filters)]); // JSON.stringify for deep comparison of filters

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refresh: fetchData };
};
