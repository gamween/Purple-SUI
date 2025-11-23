import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:3001';

/**
 * Hook pour gérer les NFTs d'engagement (airdrops et consultation)
 * Usage dans /admin (airdrop) et /viewer (mes NFTs)
 */

interface NFTRecipient {
  address: string;
  score: number; // Score d'engagement du viewer
}

interface BatchAirdropParams {
  recipients: NFTRecipient[];
}

interface AirdropResponse {
  success: boolean;
  digest?: string;
  recipientCount?: number;
  recipients?: NFTRecipient[];
  error?: string;
}

interface AirdropHistoryResponse {
  total: number;
  airdrops: Array<{
    recipients: string[];
    scores: number[];
    count: number;
    success: boolean;
    timestamp: string;
  }>;
}

interface MyNFTsResponse {
  count: number;
  nfts: Array<{
    objectId: string;
    score: number;
    recipient: string;
  }>;
}

export const useNFT = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Airdrop batch de NFTs (admin only, max 100 recipients)
   */
  const batchAirdrop = async (params: BatchAirdropParams): Promise<AirdropResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      // Valider les paramètres
      if (!params.recipients || params.recipients.length === 0) {
        throw new Error('Aucun recipient fourni');
      }

      if (params.recipients.length > 100) {
        throw new Error('Limite de 100 recipients par batch');
      }

      const response = await fetch(`${API_URL}/api/nft/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erreur airdrop batch');
      }

      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('[useNFT] batchAirdrop error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Airdrop d'un seul NFT (admin only)
   */
  const airdropSingle = async (address: string, score: number): Promise<AirdropResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      if (!address || typeof score !== 'number') {
        throw new Error('Paramètres invalides: address et score requis');
      }

      const response = await fetch(`${API_URL}/api/nft/single`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address, score }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erreur airdrop single');
      }

      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('[useNFT] airdropSingle error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Récupérer l'historique de tous les airdrops
   */
  const getAirdropHistory = async (): Promise<AirdropHistoryResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/api/nft/history`);

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erreur récupération historique');
      }

      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('[useNFT] getAirdropHistory error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Récupérer les NFTs d'un viewer
   */
  const getMyNFTs = async (address: string): Promise<MyNFTsResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      if (!address) {
        throw new Error('Address manquante');
      }

      const response = await fetch(`${API_URL}/api/nft/my-nfts/${address}`);

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erreur récupération NFTs');
      }

      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('[useNFT] getMyNFTs error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    batchAirdrop,
    airdropSingle,
    getAirdropHistory,
    getMyNFTs,
    loading,
    error,
  };
};
