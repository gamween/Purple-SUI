import { useState } from 'react';

interface MintNftParams {
  imageName: string;
  recipientAddress: string;
  name: string;
  description: string;
}

interface MintNftResult {
  success: boolean;
  digest?: string;
  imageUrl?: string;
  recipientAddress?: string;
  error?: string;
}

export function useMintNft() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mintNft = async (params: MintNftParams): Promise<MintNftResult> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://localhost:3001/api/nft/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'NFT minting failed');
      }

      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Unknown error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { mintNft, loading, error };
}
