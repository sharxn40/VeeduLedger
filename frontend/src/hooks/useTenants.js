import { useState, useEffect, useCallback } from 'react';
import { tenantService } from '../services/tenantService';

export const useTenants = (ownerId) => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTenants = useCallback(async () => {
    if (!ownerId) return;
    setLoading(true);
    try {
      const data = await tenantService.getAll(ownerId);
      setTenants(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tenants');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [ownerId]);

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  return { tenants, loading, error, refresh: fetchTenants };
};

export const useTenant = (id) => {
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTenant = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await tenantService.getById(id);
        setTenant(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch tenant details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTenant();
  }, [id]);

  return { tenant, loading, error };
};
