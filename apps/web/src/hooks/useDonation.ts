import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:3001';

/**
 * Hook pour gérer les donations avec split automatique streamer/dev
 * Usage dans /viewer dashboard
 */

interface ProcessDonationParams {
  streamerAddress: string;
  devAddress: string;
  splitRatio: number; // Basis points: 2000 = 20% dev, 80% streamer
  donationAmountSui: number;
}

interface DonationResponse {
  success: boolean;
  digest?: string;
  streamerAmount?: number;
  devAmount?: number;
  error?: string;
}

interface DonationHistoryResponse {
  total: number;
  donations: Array<{
    donor: string;
    streamer: string;
    dev: string;
    amount: number;
    splitRatio: number;
    timestamp: string;
  }>;
}

interface DonationStatsResponse {
  totalDonations: number;
  totalAmount: number;
  uniqueDonors: number;
}

export const useDonation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Envoyer une donation qui se split automatiquement
   */
  const processDonation = async (params: ProcessDonationParams): Promise<DonationResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // Valider splitRatio
      if (params.splitRatio < 0 || params.splitRatio > 10000) {
        throw new Error('splitRatio doit être entre 0 et 10000');
      }

      const response = await fetch(`${API_URL}/api/donation/split`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erreur envoi donation');
      }

      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('[useDonation] processDonation error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Récupérer l'historique des donations d'un streamer
   */
  const getDonationHistory = async (streamerAddress: string): Promise<DonationHistoryResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/api/donation/history/${streamerAddress}`);

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erreur récupération historique');
      }

      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('[useDonation] getDonationHistory error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Récupérer les statistiques de donations d'un streamer
   */
  const getDonationStats = async (streamerAddress: string): Promise<DonationStatsResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/api/donation/stats/${streamerAddress}`);

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erreur récupération stats');
      }

      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('[useDonation] getDonationStats error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    processDonation,
    getDonationHistory,
    getDonationStats,
    loading,
    error,
  };
};
