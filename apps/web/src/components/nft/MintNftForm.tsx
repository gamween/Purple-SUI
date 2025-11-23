import { useState } from 'react';
import { useMintNft } from '@/hooks/useMintNft';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Exemple de composant pour minter des NFTs
 * Peut être utilisé dans un dashboard admin ou une page de récompenses
 */
export function MintNftForm() {
  const { mintNft, loading, error } = useMintNft();
  const [recipientAddress, setRecipientAddress] = useState('');
  const [nftName, setNftName] = useState('');
  const [nftDescription, setNftDescription] = useState('');
  const [imageName, setImageName] = useState('design1.png');
  const [result, setResult] = useState<any>(null);

  const handleMint = async () => {
    try {
      const data = await mintNft({
        imageName,
        recipientAddress,
        name: nftName,
        description: nftDescription,
      });

      setResult(data);
      console.log('NFT minted successfully:', data);
    } catch (err) {
      console.error('Minting failed:', err);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>🎨 Mint NFT</CardTitle>
        <CardDescription>
          Créer un NFT personnalisé et l'envoyer à une adresse Sui
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Image Name */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Image (dans nft-designs/)
          </label>
          <Input
            type="text"
            value={imageName}
            onChange={(e) => setImageName(e.target.value)}
            placeholder="design1.png"
          />
        </div>

        {/* NFT Name */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Nom du NFT
          </label>
          <Input
            type="text"
            value={nftName}
            onChange={(e) => setNftName(e.target.value)}
            placeholder="Purple SUI NFT #1"
          />
        </div>

        {/* NFT Description */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Description
          </label>
          <Input
            type="text"
            value={nftDescription}
            onChange={(e) => setNftDescription(e.target.value)}
            placeholder="Reward for completing bounty"
          />
        </div>

        {/* Recipient Address */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Adresse du destinataire
          </label>
          <Input
            type="text"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            placeholder="0x..."
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {result && result.success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <p className="text-sm font-semibold mb-1">✅ NFT minté avec succès !</p>
            <p className="text-xs">
              Transaction:{' '}
              <a
                href={`https://suiscan.xyz/testnet/tx/${result.digest}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {result.digest?.substring(0, 20)}...
              </a>
            </p>
            <p className="text-xs mt-1">
              Image:{' '}
              <a
                href={result.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Voir sur IPFS
              </a>
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button
          onClick={handleMint}
          disabled={loading || !recipientAddress || !nftName || !imageName}
          className="w-full"
        >
          {loading ? '⏳ Minting...' : '🎁 Mint NFT'}
        </Button>
      </CardFooter>
    </Card>
  );
}
