import { useState, useEffect } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';

interface Nft {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  type: string;
}

export function useUserNfts() {
  const currentAccount = useCurrentAccount();
  const [nfts, setNfts] = useState<Nft[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentAccount?.address) {
      setNfts([]);
      setLoading(false);
      return;
    }

    const fetchNfts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`https://localhost:3001/api/nft/owned/${currentAccount.address}`);
        const data = await response.json();

        if (data.success) {
          setNfts(data.nfts);
        } else {
          setError(data.error || 'Failed to fetch NFTs');
        }
      } catch (err: any) {
        console.error('Error fetching NFTs:', err);
        setError('Could not load NFTs');
      } finally {
        setLoading(false);
      }
    };

    fetchNfts();
  }, [currentAccount?.address]);

  const refetch = async () => {
    if (!currentAccount?.address) return;
    
    setLoading(true);
    try {
      const response = await fetch(`https://localhost:3001/api/nft/owned/${currentAccount.address}`);
      const data = await response.json();
      if (data.success) {
        setNfts(data.nfts);
      }
    } catch (err) {
      console.error('Error refetching NFTs:', err);
    } finally {
      setLoading(false);
    }
  };

  return { nfts, loading, error, refetch };
}
