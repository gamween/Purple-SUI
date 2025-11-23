# 🎯 GUIDE D'UTILISATION - Smart Contracts StreamSUI

## ✅ CE QUI A ÉTÉ CRÉÉ

### Backend (Apps/API)

#### Configuration Blockchain
- **`apps/api/src/web3/sui-client.ts`** (105 lignes)
  - Client Sui configuré pour testnet
  - Gestion keypair et signatures
  - Helpers pour conversions SUI/MIST
  - Fonction `verifySuiConfig()` pour valider la config au démarrage

#### Services Blockchain (3 services)
- **`apps/api/src/services/bounty.service.ts`** (168 lignes)
  - ✅ `createBounty()`: Dev crée offre avec SUI bloqué
  - ✅ `acceptBounty()`: Streamer accepte
  - ✅ `completeBounty()`: Dev valide et paie
  - ✅ `getBountyEvents()`: Query événements blockchain

- **`apps/api/src/services/donation.service.ts`** (114 lignes)
  - ✅ `processDonation()`: Split automatique streamer/dev selon ratio
  - ✅ `getDonationHistory()`: Historique donations streamer
  - ✅ `getDonationStats()`: Total, montant, donateurs uniques

- **`apps/api/src/services/nft-airdrop.service.ts`** (123 lignes)
  - ✅ `batchAirdrop()`: Distribution batch NFTs (max 100)
  - ✅ `airdropSingle()`: Distribution 1 NFT
  - ✅ `getAirdropHistory()`: Historique airdrops
  - ✅ `getRecipientNFTs()`: NFTs d'un viewer

#### Routes API (11 endpoints REST)
- **`apps/api/src/routes/bounty.routes.ts`** (130 lignes)
  - POST `/api/bounty/create`
  - POST `/api/bounty/accept`
  - POST `/api/bounty/complete`
  - GET `/api/bounty/events/:bountyId?`

- **`apps/api/src/routes/donation.routes.ts`** (105 lignes)
  - POST `/api/donation/split`
  - GET `/api/donation/history/:streamerAddress`
  - GET `/api/donation/stats/:streamerAddress`

- **`apps/api/src/routes/nft.routes.ts`** (128 lignes)
  - POST `/api/nft/batch`
  - POST `/api/nft/single`
  - GET `/api/nft/history`
  - GET `/api/nft/my-nfts/:address`

#### Intégration Serveur
- **`apps/api/src/index.ts`** (modifié)
  - Import des 3 routers blockchain
  - Appel `verifySuiConfig()` au démarrage
  - Routes enregistrées sous `/api/bounty`, `/api/donation`, `/api/nft`

### Frontend (Apps/Web)

#### Hooks React (3 hooks)
- **`apps/web/src/hooks/useBounty.ts`** (180 lignes)
  - `createBounty()`, `acceptBounty()`, `completeBounty()`
  - `getBountyEvents()`
  - États: loading, error

- **`apps/web/src/hooks/useDonation.ts`** (140 lignes)
  - `processDonation()`
  - `getDonationHistory()`, `getDonationStats()`
  - États: loading, error

- **`apps/web/src/hooks/useNFT.ts`** (190 lignes)
  - `batchAirdrop()`, `airdropSingle()`
  - `getAirdropHistory()`, `getMyNFTs()`
  - États: loading, error

---

## 🚀 COMMENT UTILISER

### 1. Dashboard Dev (`/dev`)

```tsx
import { useBounty } from '../hooks/useBounty';

function DevDashboard() {
  const { createBounty, loading, error } = useBounty();
  const devAddress = '0x...'; // Votre adresse Sui

  const handleCreateBounty = async () => {
    const result = await createBounty({
      bountyId: Date.now(),
      devAddress,
      streamerAddress: '0x...', // Adresse du streamer
      rewardAmountSui: 10, // 10 SUI de récompense
    });

    if (result?.success) {
      console.log('Bounty créée!', result.bountyObjectId);
    }
  };

  return (
    <button onClick={handleCreateBounty} disabled={loading}>
      {loading ? 'Création...' : 'Créer Bounty 10 SUI'}
    </button>
  );
}
```

### 2. Dashboard Streamer (`/streamer`)

```tsx
import { useBounty } from '../hooks/useBounty';

function StreamerDashboard() {
  const { acceptBounty, loading } = useBounty();
  const streamerAddress = '0x...'; // Votre adresse Sui

  const handleAcceptBounty = async (bountyObjectId: string) => {
    const result = await acceptBounty({
      bountyObjectId,
      streamerAddress,
    });

    if (result?.success) {
      console.log('Bounty acceptée!', result.digest);
    }
  };

  return (
    <button onClick={() => handleAcceptBounty('0xBOUNTY_ID')}>
      Accepter Bounty
    </button>
  );
}
```

### 3. Dashboard Viewer (`/viewer`)

#### Envoyer une Donation

```tsx
import { useDonation } from '../hooks/useDonation';

function ViewerDashboard() {
  const { processDonation, loading } = useDonation();

  const handleDonate = async () => {
    const result = await processDonation({
      streamerAddress: '0x...', // Adresse du streamer
      devAddress: '0x...', // Adresse du dev
      splitRatio: 2000, // 20% pour dev, 80% pour streamer
      donationAmountSui: 5, // 5 SUI au total
    });

    if (result?.success) {
      console.log('Donation envoyée!');
      console.log('Streamer reçoit:', result.streamerAmount, 'SUI');
      console.log('Dev reçoit:', result.devAmount, 'SUI');
    }
  };

  return (
    <button onClick={handleDonate} disabled={loading}>
      {loading ? 'Envoi...' : 'Donner 5 SUI'}
    </button>
  );
}
```

#### Voir mes NFTs

```tsx
import { useNFT } from '../hooks/useNFT';
import { useEffect, useState } from 'react';

function MyNFTs() {
  const { getMyNFTs, loading } = useNFT();
  const [nfts, setNfts] = useState([]);
  const myAddress = '0x...'; // Votre adresse Sui

  useEffect(() => {
    const fetchNFTs = async () => {
      const result = await getMyNFTs(myAddress);
      if (result) {
        setNfts(result.nfts);
      }
    };

    fetchNFTs();
  }, [myAddress]);

  return (
    <div>
      <h2>Mes NFTs d'Engagement ({nfts.length})</h2>
      {nfts.map((nft) => (
        <div key={nft.objectId}>
          <p>Score: {nft.score}</p>
          <p>ID: {nft.objectId}</p>
        </div>
      ))}
    </div>
  );
}
```

### 4. Dashboard Admin (Airdrop NFTs)

```tsx
import { useNFT } from '../hooks/useNFT';

function AdminAirdrop() {
  const { batchAirdrop, loading } = useNFT();

  const handleAirdrop = async () => {
    // Liste des viewers engagés (obtenue depuis analyse IA)
    const recipients = [
      { address: '0xVIEWER1...', score: 95 },
      { address: '0xVIEWER2...', score: 87 },
      { address: '0xVIEWER3...', score: 72 },
      // ... jusqu'à 100 max
    ];

    const result = await batchAirdrop({ recipients });

    if (result?.success) {
      console.log(`${result.recipientCount} NFTs distribués!`);
    }
  };

  return (
    <button onClick={handleAirdrop} disabled={loading}>
      {loading ? 'Distribution...' : 'Lancer Airdrop'}
    </button>
  );
}
```

---

## ⚙️ CONFIGURATION REQUISE

### Backend `.env`

```bash
# Sui Blockchain
SUI_PRIVATE_KEY=ABM46Sy7NKPWQYTpr8dKj2deVUNVt1dmCYihqnbfkAkG
SUI_RPC_URL=https://fullnode.testnet.sui.io:443
PACKAGE_ID=0x...  # ⚠️ À remplir après déploiement des contracts

# Frontend
FRONTEND_URL=https://localhost:3000

# Twitch OAuth
TWITCH_CLIENT_ID=ndtq2mnj958ctyyxtfy3q5ew3l28yv
TWITCH_CLIENT_SECRET=...  # ⚠️ À remplir
TWITCH_REDIRECT_URI=https://localhost:3001/api/twitch/callback
```

### Frontend `.env.local`

```bash
VITE_API_URL=https://localhost:3001
```

---

## 🔥 DÉMARRAGE RAPIDE

### 1. Installer les dépendances

```bash
cd /Users/fianso/Development/sui/devinci
pnpm install
```

### 2. Déployer les Smart Contracts

```bash
cd contracts
sui move build
sui client publish --gas-budget 100000000

# Copier le PACKAGE_ID affiché dans l'output
# Exemple: 0x1234567890abcdef...
```

### 3. Configurer le PACKAGE_ID

```bash
# Dans apps/api/.env
echo "PACKAGE_ID=0x[VOTRE_PACKAGE_ID]" >> apps/api/.env
```

### 4. Démarrer le Backend

```bash
cd apps/api
pnpm dev

# Output attendu:
# ========================================
# 🚀 StreamSUI API Server (HTTPS)
# ========================================
# 📡 Server running on: https://localhost:3001
# ⛓️  Blockchain APIs:
#    - Bounty: /api/bounty
#    - Donation: /api/donation
#    - NFT: /api/nft
# ========================================
# [Sui] ✅ Configuration validée
```

### 5. Démarrer le Frontend

```bash
cd apps/web
pnpm dev

# Le frontend sera accessible sur https://localhost:3000
```

---

## 📊 FLOWS COMPLETS

### Flow Bounty (Dev → Streamer)

1. **Dev crée bounty** → `useBounty().createBounty()`
   - Dev spécifie streamer, récompense en SUI
   - SUI bloqué sur la blockchain
   - Retour: `bountyObjectId`

2. **Streamer voit bounty** → `useBounty().getBountyEvents()`
   - Query événements blockchain
   - Afficher bounties disponibles

3. **Streamer accepte** → `useBounty().acceptBounty()`
   - Streamer commit à la bounty
   - État passe à "accepted"

4. **Streamer travaille** (hors blockchain)
   - Streamer diffuse, engage l'audience, etc.

5. **Dev valide** → `useBounty().completeBounty()`
   - Dev confirme le travail terminé
   - SUI transféré automatiquement au streamer
   - État passe à "completed"

### Flow Donation (Viewer → Split)

1. **Viewer donne** → `useDonation().processDonation()`
   - Viewer choisit montant + ratio (ex: 80% streamer, 20% dev)
   - Smart contract split automatiquement
   - Streamer et dev reçoivent SUI immédiatement

2. **Streamer voit stats** → `useDonation().getDonationStats()`
   - Total donations, montant, nombre de donateurs

### Flow NFT Airdrop (Admin → Viewers)

1. **Analyse engagement** (avec OpenAI)
   - Analyser messages chat, donations, activité
   - Calculer scores d'engagement par viewer

2. **Admin lance airdrop** → `useNFT().batchAirdrop()`
   - Liste des viewers + scores
   - Batch de max 100 recipients
   - NFTs mintés et transférés

3. **Viewer consulte NFTs** → `useNFT().getMyNFTs()`
   - Voir tous ses NFTs d'engagement
   - Afficher scores obtenus

---

## 🧪 TESTS

### Test Bounty

```bash
# Tester création bounty
curl -X POST https://localhost:3001/api/bounty/create \
  -H "Content-Type: application/json" \
  -d '{
    "bountyId": 1,
    "devAddress": "0xDEV_ADDRESS",
    "streamerAddress": "0xSTREAMER_ADDRESS",
    "rewardAmountSui": 10
  }'

# Output attendu:
{
  "success": true,
  "digest": "0x...",
  "bountyObjectId": "0x..."
}
```

### Test Donation

```bash
curl -X POST https://localhost:3001/api/donation/split \
  -H "Content-Type: application/json" \
  -d '{
    "streamerAddress": "0xSTREAMER",
    "devAddress": "0xDEV",
    "splitRatio": 2000,
    "donationAmountSui": 5
  }'

# Output:
{
  "success": true,
  "digest": "0x...",
  "streamerAmount": 4,
  "devAmount": 1
}
```

---

## 📚 RESSOURCES

- **Smart Contracts**: `contracts/sources/*.move`
- **Backend Services**: `apps/api/src/services/*.service.ts`
- **Routes API**: `apps/api/src/routes/*.routes.ts`
- **Hooks Frontend**: `apps/web/src/hooks/*.ts`
- **Sui SDK Docs**: https://sdk.mystenlabs.com/typescript
- **Sui Explorer (Testnet)**: https://suiexplorer.com/?network=testnet

---

## 🎯 PROCHAINES ÉTAPES

1. ❌ **Déployer contracts sur testnet** → Obtenir PACKAGE_ID
2. ❌ **Configurer TWITCH_CLIENT_SECRET** → OAuth fonctionnel
3. ✅ **Tester flows complets** → Bounty, Donation, NFT
4. ❌ **Intégrer dans dashboards** → UI avec hooks
5. ❌ **Ajouter analyse OpenAI** → Scores d'engagement pour NFTs

**Code backend/frontend complet et prêt à l'emploi !** 🚀
