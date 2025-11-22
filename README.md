# StreamSUI - NFT Rewards Platform for SUI Ecosystem

## 📖 Overview

StreamSUI est une plateforme de streaming décentralisée construite sur la blockchain SUI qui connecte les développeurs de projets SUI (GameFi, dApps) avec des streamers et leurs audiences [11][12]. La plateforme automatise la distribution de NFTs aux viewers les plus engagés, créant un canal marketing authentique et gamifié pour promouvoir l'écosystème SUI [13][14].

## 🎯 Mission

Transformer le streaming en un outil de croissance pour l'écosystème SUI en permettant aux projets de sponsoriser des streams et de récompenser l'engagement réel des viewers avec des NFTs vérifiables [15][16]. Notre objectif est d'éduquer et d'onboarder de nouveaux utilisateurs sur SUI de manière organique et engageante [17][18].

## 🏗️ Architecture - Trois Rôles

### 1. **Viewer** 
- Se connecte via **Slush Wallet** avec authentification Google/Facebook (zkLogin) [19][20][21]
- Consulte sa collection de NFTs obtenus via la plateforme
- Accède au classement en temps réel des streams sponsorisés les plus populaires
- Reçoit automatiquement des NFTs basés sur son engagement (watchtime, commentaires, dons) [22]

### 2. **Dev (Project Owner)**
- Accède à un **feed marketplace** pour publier des offres de sponsoring
- Définit les paramètres de l'offre:
  - Nombre de NFTs à distribuer (ex: 100 NFTs/heure aux top viewers)
  - Pourcentage des dons reversé (ex: 30% pour le dev, 70% pour le streamer)
  - Design personnalisé du NFT
- Upload le design du NFT qui sera minté pour les viewers éligibles [11][12]
- Utilise la plateforme comme canal d'acquisition utilisateur à faible coût [23][24]

### 3. **Streamer**
- Browse le feed des offres de sponsoring disponibles
- Accepte directement une offre ou négocie via chat intégré avec le dev
- Une fois l'accord conclu, lance son stream et publie le lien sur StreamSUI
- Reçoit automatiquement sa part des dons via smart contract [25][26]

## ⚙️ Fonctionnement Technique

### Smart Contracts SUI (Move Language)
- **Marketplace Contract**: gère les offres, accords dev-streamer, et splits de revenus [12][27]
- **NFT Minting Contract**: crée les NFTs avec métadonnées dynamiques basées sur les scores des viewers [11][12]
- **Donation Split Contract**: distribue automatiquement les dons selon les termes de l'accord [25]

### Agent IA + Nautilus
- **Monitoring en temps réel** du stream (potentiellement via extension Twitch) [28][29]
- **Collecte de données** d'engagement: watchtime, commentaires, likes, dons [22]
- **Calcul off-chain vérifiable** des scores via **Nautilus** (Trusted Execution Environment) [30][13]
- **Attestation cryptographique** soumise on-chain pour validation [13]
- **Minting automatique** à la fin du stream et distribution aux wallets des viewers éligibles [31][32]

### Système de Donations
- Extension de paiement inspirée de WaveTip, adaptée à SUI [25]
- Microtransactions en temps réel avec frais ultra-bas (scalabilité jusqu'à 297,000 TPS) [14][33]
- Split automatique via smart contract selon l'accord dev-streamer [26]

### Event System
- **Webhooks SUI natifs** pour synchroniser blockchain et streaming en temps réel [31][32]
- Notifications automatiques aux viewers lors de la réception de NFTs
- Mise à jour du classement des streams en direct

## 🛠️ Stack Technique

**Blockchain**: SUI (Move language) [11][12][14]
**Off-chain Compute**: Nautilus (Verifiable TEE) [30][13]
**Wallet**: Slush avec zkLogin (Google/Facebook/Twitch) [19][20][21]
**Smart Contracts**: Move pour NFTs, marketplace, payment splits [12][27]
**Event Listeners**: SUI native webhooks [31][32]
**AI Agent**: Monitoring et scoring en temps réel [28][34][22]

## 💡 Cas d'Usage

### Promotion GameFi
Un projet GameFi SUI qui prépare son lancement sponsorise 10 streamers pour 3 streams/semaine pendant 1 mois [35][36]. Les viewers engagés reçoivent des NFTs qui débloquent early access, items in-game, ou whitelist pour l'airdrop [37][38].

### Éducation SUI
La Sui Foundation sponsorise des streams éducatifs sur les nouveautés de l'écosystème [17][18]. Les viewers assidus reçoivent des NFTs de certification prouvant leur participation et compréhension.

### Lancement de dApp
Une dApp DeFi sur SUI sponsorise des streams de démonstration live [39]. Les NFTs distribués offrent des bonus de staking ou des frais réduits aux early adopters.

## 🚀 Avantages Compétitifs

**Zéro barrière d'entrée pour viewers**: Slush zkLogin permet de créer un wallet SUI en 30 secondes avec un simple compte Google [19][21].

**Coût d'acquisition ultra-bas**: Les devs ne paient que le minting (quelques centimes par NFT sur SUI), bien moins cher que la publicité traditionnelle [40][41].

**Pas de frais minimum**: Contrairement aux plateformes traditionnelles, aucun budget minimum n'est requis [42][43].

**Engagement authentique**: Les NFTs récompensent l'engagement réel (watchtime, participation), pas juste l'achat [44][45].

**Transparence totale**: Smart contracts garantissent la distribution équitable des dons et des NFTs, éliminant les commissions cachées [26][16].

**Scalabilité SUI**: Architecture parallèle et frais bas permettent de distribuer des milliers de NFTs par stream sans congestion [14][33].

**Écosystème intégré**: Synergie avec l'écosystème GameFi et DeFi de SUI en pleine expansion (70+ jeux en développement) [46][36][39].

## 🎯 Opportunités de Partenariat

**Sui Foundation**: Canal de distribution officiel pour initiatives éducatives et marketing [17][18]
**Sui Gaming Summit 2025**: Présence au sommet du 18 mars pour capter les projets GameFi [46][47]
**Projets GameFi**: XOCIETY, Aftermath, et 70+ jeux en développement cherchent des canaux d'acquisition [36][48]
**DeFi Protocols**: Intégration avec l'écosystème DeFi de SUI pour offres croisées [39]

## 📊 Modèle Économique

- **Revenue Viewer**: Gratuit, reçoit des NFTs en récompense
- **Revenue Streamer**: Pourcentage des dons (70-90% selon accord avec dev)
- **Revenue Dev**: Acquisition d'utilisateurs qualifiés pour son projet
- **Revenue Plateforme**: Frais optionnel (2-5%) sur les transactions ou modèle freemium avec features premium

## 🔐 Sécurité & Anti-Fraude

- **Nautilus attestations** garantissent l'authenticité des calculs de score [13]
- Détection de bots via analyse comportementale dans l'agent IA
- Smart contracts audités pour sécuriser les donations
- NFTs soulbound optionnels pour éviter le farming

***

**StreamSUI transforme le streaming en un moteur de croissance décentralisé pour l'écosystème SUI, où chaque participant (dev, streamer, viewer) est directement récompensé pour sa contribution authentique** [26][16][24].


## 📁 Architecture du Projet

```
devinci/
│
├── contracts/                             # Smart Contracts Sui (Move)
│   ├── Move.toml                          # Configuration package Sui
│   ├── sources/
│   │   ├── bounty.move                   # Contrats streamer/dev
│   │   ├── donation_split.move           # Splits automatiques des donations
│   │   └── nft_airdrop.move              # Distribution NFTs aux viewers
│   └── tests/
│       └── bounty_tests.move             # Tests des smart contracts
│
├── apps/
│   ├── api/                              # Backend Express + TypeScript
│   │   ├── src/
│   │   │   ├── routes/                   # API REST
│   │   │   │   ├── auth.routes.ts        # OAuth Twitch
│   │   │   │   ├── bounty.routes.ts      # CRUD bounties
│   │   │   │   ├── donation.routes.ts    # Trigger smart contracts
│   │   │   │   └── twitch.routes.ts      # Stream info Twitch API
│   │   │   ├── services/                 # Logique métier
│   │   │   │   ├── auth.service.ts       # Authentification
│   │   │   │   ├── bounty.service.ts     # Gestion bounties
│   │   │   │   ├── donation.service.ts   # Appels SC donation
│   │   │   │   └── twitch-webhook.service.ts  # Webhooks Twitch
│   │   │   ├── web3/                     # Intégration blockchain
│   │   │   │   └── sui-client.ts         # Client Sui SDK
│   │   │   └── db/                       # Base de données
│   │   │       └── models.ts             # Mapping Twitch/Sui
│   │   └── package.json
│   │
│   ├── web/                              # Frontend React + Vite
│   │   ├── src/
│   │   │   ├── pages/                    # Pages de l'app
│   │   │   │   ├── LandingPage.tsx       # Page d'accueil
│   │   │   │   ├── auth/                 # Login/Callback
│   │   │   │   ├── dev/                  # Dashboard dev + bounties
│   │   │   │   ├── streamer/             # Dashboard streamer
│   │   │   │   └── viewer/               # Browse streams
│   │   │   ├── components/               # Composants React
│   │   │   │   ├── ui/                   # shadcn/ui (40+ composants)
│   │   │   │   ├── dashboard/            # Sidebar, Header, Stats
│   │   │   │   ├── bounties/             # BountyCard
│   │   │   │   └── viewer/               # StreamerCard
│   │   │   └── lib/                      # Utilitaires
│   │   │       ├── networkConfig.ts      # Config réseaux Sui
│   │   │       └── providers.tsx         # React Query + Sui Provider
│   │   ├── vite.config.ts
│   │   └── package.json
│   │
│   └── twitch-extension/                 # Extension Twitch (optionnel)
│       └── package.json
│
└── infra/                                # Infrastructure (optionnel)
    └── docker-compose.yml

# Commandes
pnpm dev:web      # Lance le frontend (port 3000)
pnpm dev:api      # Lance le backend (port 3001)
pnpm build:web    # Build frontend
```