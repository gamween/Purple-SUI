import { useState, useEffect } from 'react';
import { bountyApi, type Bounty } from '../api';

export function useBounties(filters?: {
  status?: string;
  devAddress?: string;
  streamerAddress?: string;
}) {
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBounties();
  }, [filters?.status, filters?.devAddress, filters?.streamerAddress]);

  const loadBounties = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bountyApi.getAll(filters);
      setBounties(response.bounties);
    } catch (err: any) {
      setError(err.message);
      console.error('Failed to load bounties:', err);
    } finally {
      setLoading(false);
    }
  };

  const createBounty = async (data: Parameters<typeof bountyApi.create>[0]) => {
    try {
      const response = await bountyApi.create(data);
      setBounties(prev => [response.bounty, ...prev]);
      return response.bounty;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const acceptBounty = async (id: string, data: Parameters<typeof bountyApi.accept>[1]) => {
    try {
      const response = await bountyApi.accept(id, data);
      setBounties(prev => prev.map(b => b.id === id ? response.bounty : b));
      return response.bounty;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const completeBounty = async (id: string, data?: Parameters<typeof bountyApi.complete>[1]) => {
    try {
      const response = await bountyApi.complete(id, data);
      setBounties(prev => prev.map(b => b.id === id ? response.bounty : b));
      return response.bounty;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const cancelBounty = async (id: string) => {
    try {
      const response = await bountyApi.cancel(id);
      setBounties(prev => prev.map(b => b.id === id ? response.bounty : b));
      return response.bounty;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    bounties,
    loading,
    error,
    refresh: loadBounties,
    createBounty,
    acceptBounty,
    completeBounty,
    cancelBounty,
  };
}

export function useBounty(id: string) {
  const [bounty, setBounty] = useState<Bounty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadBounty();
    }
  }, [id]);

  const loadBounty = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bountyApi.getById(id);
      setBounty(response.bounty);
    } catch (err: any) {
      setError(err.message);
      console.error('Failed to load bounty:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    bounty,
    loading,
    error,
    refresh: loadBounty,
  };
}
