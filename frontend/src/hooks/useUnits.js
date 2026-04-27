import { useState, useEffect, useCallback } from 'react';
import { unitService } from '../services/unitService';

export const useUnits = (buildingId, ownerId) => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUnits = useCallback(async () => {
    if (!buildingId || !ownerId) {
      setUnits([]);
      return;
    }
    setLoading(true);
    try {
      const data = await unitService.getByBuilding(buildingId, ownerId);
      setUnits(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch units');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [buildingId]);

  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);

  return { units, loading, error, refresh: fetchUnits };
};
