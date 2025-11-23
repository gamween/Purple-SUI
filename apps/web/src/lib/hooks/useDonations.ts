import { useState, useEffect } from 'react';
import { donationApi, type Donation } from '../api';

export function useDonations(filters?: {
  bountyId?: string;
  donorAddress?: string;
  limit?: number;
}) {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDonations();
  }, [filters?.bountyId, filters?.donorAddress, filters?.limit]);

  const loadDonations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await donationApi.getAll(filters);
      setDonations(response.donations);
    } catch (err: any) {
      setError(err.message);
      console.error('Failed to load donations:', err);
    } finally {
      setLoading(false);
    }
  };

  const createDonation = async (data: Parameters<typeof donationApi.create>[0]) => {
    try {
      const response = await donationApi.create(data);
      setDonations(prev => [response.donation, ...prev]);
      return response.donation;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    donations,
    loading,
    error,
    refresh: loadDonations,
    createDonation,
  };
}

export function useDonationTotal(bountyId: string) {
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bountyId) {
      loadTotal();
    }
  }, [bountyId]);

  const loadTotal = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await donationApi.getTotalByBounty(bountyId);
      setTotal(response.total);
    } catch (err: any) {
      setError(err.message);
      console.error('Failed to load donation total:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    total,
    loading,
    error,
    refresh: loadTotal,
  };
}
