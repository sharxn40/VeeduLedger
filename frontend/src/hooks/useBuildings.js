import { useState, useEffect, useCallback } from 'react';
import { buildingService } from '../services/buildingService';

export const useBuildings = (ownerId) => {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBuildings = useCallback(async () => {
    if (!ownerId) return;
    setLoading(true);
    try {
      const data = await buildingService.getAll(ownerId);
      setBuildings(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch buildings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [ownerId]);

  useEffect(() => {
    fetchBuildings();
  }, [fetchBuildings]);

  return { buildings, loading, error, refresh: fetchBuildings };
};
