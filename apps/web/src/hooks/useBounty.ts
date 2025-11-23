import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:3001';

/**
 * Hook pour interagir avec les bounties blockchain
 * Usage dans /dev et /streamer dashboards
 */

interface CreateBountyParams {
  bountyId: number;
  devAddress: string;
  streamerAddress: string;
  rewardAmountSui: number;
}

interface AcceptBountyParams {
  bountyObjectId: string;
  streamerAddress: string;
}

interface CompleteBountyParams {
  bountyObjectId: string;
  devAddress: string;
  streamerAddress: string;
  coinVaultObjectId: string;
}

interface BountyResponse {
  success: boolean;
  digest?: string;
  bountyObjectId?: string;
  error?: string;
}

interface BountyEventsResponse {
  total: number;
  events: Array<{
    bountyId: number;
    streamer?: string;
    timestamp: string;
    type: 'accepted' | 'completed';
  }>;
}

export const useBounty = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Dev crée une nouvelle bounty avec récompense en SUI
   */
  const createBounty = async (params: CreateBountyParams): Promise<BountyResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
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

      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('[useBounty] createBounty error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Streamer accepte une bounty
   */
  const acceptBounty = async (params: AcceptBountyParams): Promise<BountyResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/api/bounty/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erreur acceptation bounty');
      }

      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('[useBounty] acceptBounty error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Dev marque la bounty comme complétée et libère le paiement
   */
  const completeBounty = async (params: CompleteBountyParams): Promise<BountyResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/api/bounty/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erreur completion bounty');
      }

      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('[useBounty] completeBounty error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Récupérer les événements d'une bounty ou tous les événements
   */
  const getBountyEvents = async (bountyId?: number): Promise<BountyEventsResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const url = bountyId 
        ? `${API_URL}/api/bounty/events/${bountyId}`
        : `${API_URL}/api/bounty/events`;

      const response = await fetch(url);

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erreur récupération événements');
      }

      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('[useBounty] getBountyEvents error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    createBounty,
    acceptBounty,
    completeBounty,
    getBountyEvents,
    loading,
    error,
  };
};
