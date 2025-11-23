import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:3001';

/**
 * Hook pour interagir avec les bounties blockchain
 */

interface CreateBountyParams {
  bountyId: number;
  devAddress: string;
  streamerAddress: string;
  rewardAmountSui: number;
}

interface BountyResponse {
  success: boolean;
  digest?: string;
  bountyObjectId?: string;
  error?: string;
}

export const useBounty = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Créer une bounty on-chain
   */
  const createBounty = async (params: CreateBountyParams): Promise<BountyResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('[useBounty] 📤 Création bounty:', params);
      
      const response = await fetch(`${API_URL}/api/bounty/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erreur création bounty');
      }

      console.log('[useBounty] ✅ Bounty créée on-chain!', data);
      
      return data;
    } catch (err: any) {
      const errorMessage = err.message;
      setError(errorMessage);
      console.error('[useBounty] ❌ Erreur:', errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    createBounty,
    loading,
    error,
  };
};
