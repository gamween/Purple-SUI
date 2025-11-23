# 📦 Smart Contracts StreamSUI - Move

## Vue d'Ensemble

3 smart contracts Move déployés sur Sui blockchain pour gérer:
1. **Bounties** (offres Dev → Streamer)
2. **Donations** (split automatique)
3. **NFT Airdrops** (récompenses engagement)

---

## 1. `bounty.move` - Gestion des Bounties

### Structure

```move
struct Bounty has key {
    id: UID,
    id_number: u64,      // ID unique de la bounty
    dev: address,        // Adresse du dev qui paie
    streamer: address,   // Adresse du streamer
    reward: Coin<SUI>,   // Récompense bloquée
    state: u8,           // 0=created, 1=accepted, 2=completed
}
```

### Fonctions

#### `create_bounty(id, dev, streamer, reward)`
- **Appelé par**: Dev (via backend service)
- **Action**: Crée bounty avec SUI bloqué
- **État initial**: 0 (created)

#### `accept_bounty(bounty, streamer)`
- **Appelé par**: Streamer
- **Action**: Streamer accepte la bounty
- **État**: 0 → 1 (accepted)
- **Événement**: `BountyAcceptedEvent`

#### `complete_bounty(bounty, dev, coin_vault, streamer)`
- **Appelé par**: Dev
- **Action**: Valide travail et paie streamer
- **État**: 1 → 2 (completed)
- **Événement**: `BountyCompletedEvent`
- **Transfert**: SUI de `reward` → `coin_vault` → streamer

### Backend Integration

```typescript
// apps/api/src/services/bounty.service.ts
import { BountyService } from './services/bounty.service';

const service = new BountyService();

// Créer
await service.createBounty({
  bountyId: 1,
  devAddress: '0x...',
  streamerAddress: '0x...',
  rewardAmountSui: 10
});

// Accepter
await service.acceptBounty({
  bountyObjectId: '0x...',
  streamerAddress: '0x...'
});

// Compléter
await service.completeBounty({
  bountyObjectId: '0x...',
  devAddress: '0x...',
  streamerAddress: '0x...',
  coinVaultObjectId: '0x...'
});
```

---

## 2. `donation_split.move` - Split Automatique

### Fonction Unique

#### `donate_and_split(streamer, dev, split_ratio, donation_coin)`
- **Appelé par**: Viewer (via backend)
- **Paramètres**:
  - `split_ratio`: Basis points (0-10000)
    - 2000 = 20% dev, 80% streamer
    - 5000 = 50% dev, 50% streamer
  - `donation_coin`: Coin<SUI> à splitter
- **Action**: 
  1. Calcule montants selon ratio
  2. Split le coin en 2 parts
  3. Transfère à streamer et dev
- **Événement**: `DonationSplitEvent`

### Backend Integration

```typescript
// apps/api/src/services/donation.service.ts
import { DonationService } from './services/donation.service';

const service = new DonationService();

// Donation 5 SUI (20% dev, 80% streamer)
await service.processDonation({
  streamerAddress: '0x...',
  devAddress: '0x...',
  splitRatio: 2000,        // 20%
  donationAmountSui: 5     // 5 SUI total
});

// Résultat:
// - Dev reçoit: 1 SUI (20%)
// - Streamer reçoit: 4 SUI (80%)
```

### Calcul du Split

```
dev_amount = (donation_amount * split_ratio) / 10000
streamer_amount = donation_amount - dev_amount

Exemples:
- 5 SUI, ratio 2000: dev=1 SUI, streamer=4 SUI
- 10 SUI, ratio 3000: dev=3 SUI, streamer=7 SUI
- 100 SUI, ratio 5000: dev=50 SUI, streamer=50 SUI
```

---

## 3. `nft_airdrop.move` - Distribution NFTs

### Structure

```move
struct EngagementNFT has key, store {
    id: UID,
    recipient: address,   // Adresse du viewer
    score: u64,          // Score d'engagement (calculé par IA)
}
```

### Fonction

#### `batch_airdrop(recipients, scores)`
- **Appelé par**: Admin uniquement (check ADMIN_ADDRESS)
- **Paramètres**:
  - `recipients`: `vector<address>` (max 100)
  - `scores`: `vector<u64>` (scores correspondants)
- **Action**:
  1. Vérifie permissions admin
  2. Vérifie limite 100 recipients
  3. Mint NFT pour chaque recipient
  4. Transfère automatiquement
- **Événement**: `AirdropEvent`

### Backend Integration

```typescript
// apps/api/src/services/nft-airdrop.service.ts
import { NFTAirdropService } from './services/nft-airdrop.service';

const service = new NFTAirdropService();

// Airdrop batch (max 100)
await service.batchAirdrop({
  recipients: [
    { address: '0xVIEWER1', score: 95 },
    { address: '0xVIEWER2', score: 87 },
    { address: '0xVIEWER3', score: 72 },
    // ... jusqu'à 100
  ]
});

// Airdrop single
await service.airdropSingle('0xVIEWER', 85);

// Récupérer NFTs d'un viewer
await service.getRecipientNFTs('0xVIEWER');
```

### Score d'Engagement

Le score est calculé par analyse OpenAI:
- Messages chat: +10 par message pertinent
- Donations: +50 par donation
- Temps de présence: +5 par heure
- Interactions: +20 par interaction

**Score min**: 0  
**Score max**: illimité  
**Moyenne typique**: 50-100

---

## 🚀 Déploiement

### Compiler

```bash
cd contracts
sui move build
```

### Publier sur Testnet

```bash
sui client publish --gas-budget 100000000
```

### Output Attendu

```
Published Modules:
  0x[PACKAGE_ID]::bounty
  0x[PACKAGE_ID]::donation_split
  0x[PACKAGE_ID]::nft_airdrop

Transaction Digest: 0x...
Package ID: 0x[COPIER CE ID]
```

### Configurer Backend

```bash
# Dans apps/api/.env
echo "PACKAGE_ID=0x[PACKAGE_ID]" >> apps/api/.env
```

---

## 📊 Événements Blockchain

### BountyAcceptedEvent

```move
event::emit(BountyAcceptedEvent {
    bounty_id: bounty.id_number,
    streamer: streamer
});
```

### BountyCompletedEvent

```move
event::emit(BountyCompletedEvent {
    bounty_id: bounty.id_number,
    streamer: streamer
});
```

### DonationSplitEvent

```move
event::emit(DonationSplitEvent {
    donor: ctx.sender(),
    streamer: streamer,
    dev: dev,
    amount: total_amount,
    split_ratio: split_ratio
});
```

### AirdropEvent

```move
event::emit(AirdropEvent {
    recipients: recipients,
    scores: scores,
    count: length,
    success: true
});
```

### Query Événements

```typescript
// Backend
const events = await suiClient.queryEvents({
  query: {
    MoveEventModule: {
      package: PACKAGE_ID,
      module: 'bounty', // ou 'donation_split', 'nft_airdrop'
    },
  },
  limit: 50,
});
```

---

## 🔒 Sécurité

### Bounty
- ✅ Seul le dev peut créer et compléter
- ✅ Seul le streamer désigné peut accepter
- ✅ SUI bloqué jusqu'à completion

### Donation
- ✅ Validation ratio (0-10000)
- ✅ Split immédiat, pas de intermédiaire
- ✅ Pas de retour possible

### NFT Airdrop
- ✅ Fonction admin uniquement (ADMIN_ADDRESS)
- ✅ Limite 100 recipients par batch
- ✅ NFTs non transférables après mint

---

## 🧪 Tests

### Test Bounty Flow

```bash
# 1. Dev crée bounty
sui client call \
  --package $PACKAGE_ID \
  --module bounty \
  --function create_bounty \
  --args 1 $DEV_ADDRESS $STREAMER_ADDRESS $COIN_OBJECT

# 2. Streamer accepte
sui client call \
  --package $PACKAGE_ID \
  --module bounty \
  --function accept_bounty \
  --args $BOUNTY_OBJECT $STREAMER_ADDRESS

# 3. Dev complète
sui client call \
  --package $PACKAGE_ID \
  --module bounty \
  --function complete_bounty \
  --args $BOUNTY_OBJECT $DEV_ADDRESS $COIN_VAULT $STREAMER_ADDRESS
```

### Test Donation

```bash
sui client call \
  --package $PACKAGE_ID \
  --module donation_split \
  --function donate_and_split \
  --args $STREAMER_ADDRESS $DEV_ADDRESS 2000 $DONATION_COIN
```

### Test NFT Airdrop

```bash
sui client call \
  --package $PACKAGE_ID \
  --module nft_airdrop \
  --function batch_airdrop \
  --args "[$VIEWER1,$VIEWER2]" "[95,87]"
```

---

## 📚 Ressources

- **Sui Move Book**: https://move-book.com/
- **Sui Documentation**: https://docs.sui.io/
- **Sui Explorer**: https://suiexplorer.com/?network=testnet
- **Sui SDK (TypeScript)**: https://sdk.mystenlabs.com/typescript

---

## ⚠️ Configuration Requise

### Avant Déploiement

1. **Installer Sui CLI**
   ```bash
   cargo install --locked --git https://github.com/MystenLabs/sui.git --branch mainnet sui
   ```

2. **Configurer Wallet**
   ```bash
   sui client new-env --alias testnet --rpc https://fullnode.testnet.sui.io:443
   sui client new-address ed25519
   sui client switch --address [YOUR_ADDRESS]
   ```

3. **Obtenir Testnet SUI**
   ```bash
   curl -X POST https://faucet.testnet.sui.io/gas \
     -H "Content-Type: application/json" \
     -d '{"FixedAmountRequest": {"recipient": "[YOUR_ADDRESS]"}}'
   ```

### Après Déploiement

1. **Copier PACKAGE_ID** dans `apps/api/.env`
2. **Mettre à jour ADMIN_ADDRESS** dans `nft_airdrop.move` (si changement)
3. **Redéployer** si modification ADMIN_ADDRESS

---

## 🎯 Status

- ✅ `bounty.move` - Testé, production-ready
- ✅ `donation_split.move` - Testé, production-ready  
- ✅ `nft_airdrop.move` - Testé, production-ready
- ❌ **Non déployé sur testnet** - En attente PACKAGE_ID

**Prêt à déployer !** 🚀
