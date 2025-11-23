# 🎨 NFT Minting System - Purple SUI

Système backend complet pour minter des NFTs personnalisés sur Sui blockchain avec des images stockées localement.

## 📦 Architecture

```
apps/api/
├── nft-designs/              # Images des NFTs (PNG/JPG)
│   ├── design1.png
│   ├── design2.png
│   └── ...
├── src/
│   ├── utils/
│   │   └── ipfs-uploader.ts  # Upload vers Pinata IPFS
│   ├── services/
│   │   └── nft-mint.service.ts  # Logique de mint
│   └── routes/
│       └── nft.routes.ts     # API REST endpoints
```

## ⚙️ Configuration

### 1. Installer les dépendances (✅ Déjà fait)
```bash
cd apps/api
pnpm add axios form-data
```

### 2. Obtenir vos clés Pinata API

1. Créer un compte sur [https://pinata.cloud](https://pinata.cloud)
2. Aller dans **API Keys** → **New Key**
3. Activer les permissions : `pinFileToIPFS`
4. Copier les clés : `API Key` et `API Secret`

### 3. Configurer le `.env`

Ajouter dans `apps/api/.env` :
```env
PINATA_API_KEY=your-pinata-api-key-here
PINATA_SECRET_KEY=your-pinata-secret-key-here
```

### 4. Déployer le smart contract NFT

Le module `nft.move` doit être déployé sur Sui testnet :

```bash
cd contracts
sui client publish --gas-budget 100000000
```

Après le déploiement, mettre à jour le `PACKAGE_ID` dans `.env` si besoin.

## 🖼️ Ajouter des images NFT

1. Placer vos designs dans `apps/api/nft-designs/`
2. Formats supportés : PNG, JPG/JPEG
3. Taille recommandée : 512x512px ou 1024x1024px
4. Nommage : `design1.png`, `bounty_reward.jpg`, etc.

Exemple :
```bash
cp ~/Desktop/my-nft.png apps/api/nft-designs/design1.png
```

## 🚀 Utilisation

### Démarrer le serveur

```bash
cd apps/api
pnpm dev
```

Le serveur affichera :
```
🎨 NFT Mint API: /api/nft/mint
```

### API Endpoints

#### 1. Lister les designs disponibles

```bash
curl https://localhost:3001/api/nft/designs
```

**Réponse :**
```json
{
  "success": true,
  "count": 3,
  "images": ["design1.png", "design2.png", "bounty_reward.jpg"]
}
```

#### 2. Minter un NFT unique

```bash
curl -X POST https://localhost:3001/api/nft/mint \
  -H "Content-Type: application/json" \
  -d '{
    "imageName": "design1.png",
    "recipientAddress": "0x1234...abcd",
    "name": "Purple SUI NFT #1",
    "description": "Reward for completing bounty #42"
  }'
```

**Réponse :**
```json
{
  "success": true,
  "digest": "8xKj9mP2qR...",
  "imageUrl": "https://gateway.pinata.cloud/ipfs/QmXyZ...",
  "recipientAddress": "0x1234...abcd"
}
```

#### 3. Minter plusieurs NFTs (batch)

```bash
curl -X POST https://localhost:3001/api/nft/mint-batch \
  -H "Content-Type: application/json" \
  -d '{
    "imageName": "design1.png",
    "recipients": [
      {
        "address": "0x1111...aaaa",
        "name": "NFT #1",
        "description": "First reward"
      },
      {
        "address": "0x2222...bbbb",
        "name": "NFT #2",
        "description": "Second reward"
      }
    ]
  }'
```

**Réponse :**
```json
{
  "success": true,
  "total": 2,
  "successCount": 2,
  "failureCount": 0,
  "results": [
    {
      "success": true,
      "digest": "8xKj9mP2qR...",
      "imageUrl": "https://gateway.pinata.cloud/ipfs/QmXyZ...",
      "recipientAddress": "0x1111...aaaa"
    },
    {
      "success": true,
      "digest": "9yLk0nQ3rS...",
      "imageUrl": "https://gateway.pinata.cloud/ipfs/QmXyZ...",
      "recipientAddress": "0x2222...bbbb"
    }
  ]
}
```

## 🔍 Vérifier les NFTs mintés

1. **Sur SuiScan :**
   ```
   https://suiscan.xyz/testnet/tx/{digest}
   ```

2. **Voir l'image IPFS :**
   ```
   https://gateway.pinata.cloud/ipfs/{hash}
   ```

3. **Dans le wallet du destinataire :**
   - Ouvrir Sui Wallet
   - Aller dans la section "NFTs"
   - Le NFT apparaît avec l'image, nom et description

## 🎯 Intégration avec les Bounties

Exemple : Envoyer un NFT automatiquement quand une bounty est complétée

```typescript
// Dans bounty-complete.service.ts
import { mintNftToWallet } from './nft-mint.service';

async function completeBounty(bountyId: string, devAddress: string) {
  // 1. Compléter la bounty on-chain
  await completeBountyTransaction(bountyId);

  // 2. Minter un NFT de récompense
  await mintNftToWallet({
    imageName: 'bounty_reward.png',
    recipientAddress: devAddress,
    name: `Bounty #${bountyId} Completed`,
    description: `Congratulations! You completed bounty #${bountyId}`,
  });

  console.log(`✅ Bounty ${bountyId} completed + NFT sent to ${devAddress}`);
}
```

## 🐛 Troubleshooting

### Erreur : "PINATA_API_KEY not configured"
→ Vérifier que les clés Pinata sont dans `.env`

### Erreur : "Image not found in nft-designs/"
→ Vérifier que le fichier existe :
```bash
ls apps/api/nft-designs/
```

### Erreur : "Transaction failed"
→ Vérifier :
- Le wallet backend a assez de SUI (gas fees)
- Le `PACKAGE_ID` est correct dans `.env`
- Le smart contract `nft.move` est déployé

### Erreur : "IPFS upload failed"
→ Vérifier les clés Pinata sur [pinata.cloud/keys](https://pinata.cloud/keys)

## 📚 Code Frontend (Hook React)

Créer `apps/web/src/hooks/useMintNft.ts` :

```typescript
import { useState } from 'react';

interface MintNftParams {
  imageName: string;
  recipientAddress: string;
  name: string;
  description: string;
}

export function useMintNft() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mintNft = async (params: MintNftParams) => {
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
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mintNft, loading, error };
}
```

**Utilisation dans un composant :**

```tsx
import { useMintNft } from '@/hooks/useMintNft';

function RewardButton({ userAddress }: { userAddress: string }) {
  const { mintNft, loading } = useMintNft();

  const handleReward = async () => {
    const result = await mintNft({
      imageName: 'design1.png',
      recipientAddress: userAddress,
      name: 'Achievement Unlocked',
      description: 'You earned this NFT!',
    });

    console.log('NFT minted:', result.digest);
    alert(`NFT sent! View on SuiScan: https://suiscan.xyz/testnet/tx/${result.digest}`);
  };

  return (
    <button onClick={handleReward} disabled={loading}>
      {loading ? 'Minting...' : '🎁 Send NFT Reward'}
    </button>
  );
}
```

## ✅ Checklist de déploiement

- [ ] Obtenir les clés Pinata API
- [ ] Ajouter `PINATA_API_KEY` et `PINATA_SECRET_KEY` au `.env`
- [ ] Ajouter des images dans `nft-designs/`
- [ ] Déployer le smart contract `nft.move` sur testnet
- [ ] Mettre à jour le `PACKAGE_ID` dans `.env` si besoin
- [ ] Tester avec `curl` : `/api/nft/designs`
- [ ] Tester un mint : `/api/nft/mint`
- [ ] Vérifier la transaction sur SuiScan
- [ ] Vérifier l'image sur IPFS (gateway Pinata)
- [ ] Intégrer le hook `useMintNft` dans le frontend

## 🎉 Prochaines étapes

- [ ] Ajouter authentification (JWT) aux routes `/api/nft/*`
- [ ] Créer une interface admin pour gérer les designs
- [ ] Implémenter un système de rareté (common, rare, legendary)
- [ ] Ajouter des métadonnées JSON pour OpenSea/Sui NFT standards
- [ ] Cache IPFS pour éviter de re-uploader la même image
- [ ] Dashboard pour voir tous les NFTs mintés
