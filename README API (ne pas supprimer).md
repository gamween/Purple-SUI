# Guide Complet - Personne 2 : Agent IA & Backend

Basé sur l'architecture du projet et votre document, voici les étapes précises pour implémenter l'**agent IA post-stream** avec **Nimbus Sui Agent Kit** [1].

## 🎯 Vue d'Ensemble

Tu es responsable de créer un **agent IA qui analyse les données post-stream** (watchtime, commentaires, dons) pour calculer un score d'engagement et déclencher l'airdrop automatique de NFTs aux meilleurs viewers via le smart contract créé par la Personne 1 [1].

## 📦 Stack Technique

- **Backend**: Node.js/Express (dans `apps/api`)
- **Agent IA**: Nimbus Sui Agent Kit + OpenAI [1]
- **Blockchain**: Sui SDK pour appeler les smart contracts
- **API Externe**: Twitch API pour récupérer les analytics
- **Database**: PostgreSQL (Prisma) pour mapper Twitch ID → Sui Address

## 🛠️ Étapes d'Implémentation

### Étape 1: Setup Initial (Heures 0-2)

**1.1 Installer les dépendances dans `apps/api`**

```bash
cd apps/api
npm install @mysten/sui.js @getnimbus/sui-agent-kit openai dotenv
npm install @twurple/api @twurple/auth
npm install prisma @prisma/client
```

**1.2 Configurer `.env`** [1]

```env
# Sui Configuration
SUI_PRIVATE_KEY=your_private_key_here
SUI_RPC_URL=https://fullnode.testnet.sui.io:443
PACKAGE_ID=0x... # Fourni par Personne 1 après déploiement

# OpenAI pour l'agent IA
OPENAI_API_KEY=sk-...

# Twitch API
TWITCH_CLIENT_ID=your_client_id
TWITCH_CLIENT_SECRET=your_secret
TWITCH_ACCESS_TOKEN=your_token

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/streamsui
```

**1.3 Attendre le PACKAGE_ID de Personne 1** [1]

La Personne 1 doit déployer `nft-airdrop.move` et te donner:
- `PACKAGE_ID`: adresse du package déployé (ex: `0xabc123...`)
- Nom de la fonction: `batch_airdrop`
- Signature des arguments: `(recipients: vector<address>, scores: vector<u64>)`

### Étape 2: Structure des Services (Heures 2-4)

**2.1 Créer la structure dans `apps/api/src/services/`** [1]

```
apps/api/src/services/
├── nimbus-agent.service.ts      # Core agent IA
├── twitch-analytics.service.ts  # Fetch data Twitch
├── nft-airdrop.service.ts       # Appel smart contract
└── stream-end-handler.ts        # Orchestration complète
```

**2.2 Service Twitch Analytics** (`twitch-analytics.service.ts`) [1]

```typescript
import { ApiClient } from '@twurple/api';
import { ClientCredentialsAuthProvider } from '@twurple/auth';

export class TwitchAnalyticsService {
  private apiClient: ApiClient;

  constructor() {
    const authProvider = new ClientCredentialsAuthProvider(
      process.env.TWITCH_CLIENT_ID!,
      process.env.TWITCH_CLIENT_SECRET!
    );
    this.apiClient = new ApiClient({ authProvider });
  }

  async getStreamData(streamId: string) {
    // 1. Récupérer les chat logs
    const chatLogs = await this.getChatLogs(streamId);
    
    // 2. Récupérer le watchtime par viewer
    const watchtime = await this.getViewerWatchtime(streamId);
    
    // 3. Récupérer les donations
    const donations = await this.getDonations(streamId);

    return {
      chatLogs,   // Messages, emotes, quality
      watchtime,  // Minutes regardées par viewer
      donations,  // Montants donnés
    };
  }

  private async getChatLogs(streamId: string) {
    // Implémentation avec Twitch API
    // https://dev.twitch.tv/docs/api/reference#get-chatters
    const stream = await this.apiClient.streams.getStreamByUserId(streamId);
    // Récupère les messages via EventSub ou webhooks
    return []; // Retourne les chat logs
  }

  private async getViewerWatchtime(streamId: string) {
    // Utilise Twitch Analytics API
    // https://dev.twitch.tv/docs/api/reference#get-analytics
    return {};
  }

  private async getDonations(streamId: string) {
    // Récupère depuis votre DB (donations via donation_split.move)
    return {};
  }
}
```

### Étape 3: Agent IA Nimbus (Heures 4-8)

**3.1 Service Nimbus Agent** (`nimbus-agent.service.ts`) [1]

```typescript
import { SuiAgentKit } from '@getnimbus/sui-agent-kit';

interface ViewerData {
  twitchId: string;
  username: string;
  suiAddress: string;
  chatMessages: number;
  chatQuality: string[]; // Messages pertinents
  watchtimeMinutes: number;
  donationAmount: number;
  emotes: number;
}

interface ScoredViewer extends ViewerData {
  score: number;
  rank: number;
}

export class NimbusAgentService {
  private agent: SuiAgentKit;

  constructor() {
    this.agent = new SuiAgentKit(
      process.env.SUI_PRIVATE_KEY!,
      process.env.SUI_RPC_URL!,
      process.env.OPENAI_API_KEY!
    );
  }

  async analyzeAndScoreViewers(viewers: ViewerData[]): Promise<ScoredViewer[]> {
    // Créer le prompt pour l'IA
    const prompt = `
You are an engagement scoring AI for a streaming platform.
Analyze these viewer metrics and assign each viewer a score from 0-100.

Consider:
- Chat engagement (quality of messages, not just quantity)
- Watch time (longer = better, but diminishing returns)
- Donations (weighted heavily)
- Emote usage (shows active participation)

Viewer Data:
${JSON.stringify(viewers, null, 2)}

Return a JSON array with format:
[
  {
    "twitchId": "user123",
    "score": 95,
    "reasoning": "High engagement with quality chat and donation"
  }
]

Sort by score descending.
`;

    // Appel à l'IA via Nimbus
    const response = await this.agent.chat(prompt);
    
    // Parser la réponse JSON
    const scores = JSON.parse(response);
    
    // Mapper avec les données originales
    const scoredViewers: ScoredViewer[] = viewers.map(viewer => {
      const scoreData = scores.find((s: any) => s.twitchId === viewer.twitchId);
      return {
        ...viewer,
        score: scoreData?.score || 0,
        rank: 0, // Sera calculé après tri
      };
    });

    // Trier et assigner les rangs
    scoredViewers.sort((a, b) => b.score - a.score);
    scoredViewers.forEach((viewer, index) => {
      viewer.rank = index + 1;
    });

    return scoredViewers;
  }
}
```

### Étape 4: NFT Airdrop Service (Heures 8-10)

**4.1 Service Airdrop** (`nft-airdrop.service.ts`) [1]

```typescript
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { SuiClient } from '@mysten/sui.js/client';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { fromB64 } from '@mysten/sui.js/utils';

interface AirdropResult {
  digest: string;
  success: boolean;
  recipients: number;
}

export class NFTAirdropService {
  private suiClient: SuiClient;
  private keypair: Ed25519Keypair;

  constructor() {
    this.suiClient = new SuiClient({ url: process.env.SUI_RPC_URL! });
    
    // Créer keypair depuis private key
    const privateKeyBytes = fromB64(process.env.SUI_PRIVATE_KEY!);
    this.keypair = Ed25519Keypair.fromSecretKey(privateKeyBytes);
  }

  async airdropToTopViewers(
    topViewers: Array<{ suiAddress: string; score: number }>,
    streamId: string
  ): Promise<AirdropResult> {
    const tx = new TransactionBlock();

    // Extraire adresses et scores
    const recipients = topViewers.map(v => v.suiAddress);
    const scores = topViewers.map(v => v.score);

    // Appel du smart contract batch_airdrop (créé par Personne 1)
    tx.moveCall({
      target: `${process.env.PACKAGE_ID}::nft_airdrop::batch_airdrop`,
      arguments: [
        tx.pure(recipients),        // vector<address>
        tx.pure(scores),            // vector<u64>
        tx.pure(streamId),          // stream_id
      ],
    });

    // Signer et exécuter la transaction
    try {
      const result = await this.suiClient.signAndExecuteTransactionBlock({
        transactionBlock: tx,
        signer: this.keypair,
        options: {
          showEffects: true,
          showObjectChanges: true,
        },
      });

      return {
        digest: result.digest,
        success: result.effects?.status.status === 'success',
        recipients: recipients.length,
      };
    } catch (error) {
      console.error('Airdrop failed:', error);
      throw error;
    }
  }
}
```

### Étape 5: Orchestration (Heures 10-12)

**5.1 Handler Principal** (`stream-end-handler.ts`) [1]

```typescript
import { TwitchAnalyticsService } from './twitch-analytics.service';
import { NimbusAgentService } from './nimbus-agent.service';
import { NFTAirdropService } from './nft-airdrop.service';

export class StreamEndHandler {
  private twitchService: TwitchAnalyticsService;
  private nimbusAgent: NimbusAgentService;
  private airdropService: NFTAirdropService;

  constructor() {
    this.twitchService = new TwitchAnalyticsService();
    this.nimbusAgent = new NimbusAgentService();
    this.airdropService = new NFTAirdropService();
  }

  async handleStreamEnd(streamId: string, topN: number = 10) {
    console.log(`🎬 Stream ${streamId} ended. Starting analysis...`);

    // 1. Récupérer les données Twitch
    console.log('📊 Fetching Twitch analytics...');
    const streamData = await this.twitchService.getStreamData(streamId);

    // 2. Transformer en ViewerData
    const viewers = this.mapToViewerData(streamData);
    console.log(`👥 Found ${viewers.length} viewers`);

    // 3. Scorer avec l'agent IA Nimbus
    console.log('🤖 AI scoring viewers...');
    const scoredViewers = await this.nimbusAgent.analyzeAndScoreViewers(viewers);

    // 4. Sélectionner le top N
    const topViewers = scoredViewers.slice(0, topN);
    console.log(`🏆 Top ${topN} viewers:`, topViewers.map(v => ({
      username: v.username,
      score: v.score,
      rank: v.rank
    })));

    // 5. Airdrop NFT via smart contract
    console.log('🎁 Airdropping NFTs...');
    const result = await this.airdropService.airdropToTopViewers(
      topViewers.map(v => ({
        suiAddress: v.suiAddress,
        score: v.score
      })),
      streamId
    );

    console.log('✅ Airdrop complete!', result);
    return {
      streamId,
      totalViewers: viewers.length,
      topViewers,
      airdropResult: result,
    };
  }

  private mapToViewerData(streamData: any) {
    // Mapper les données Twitch vers ViewerData
    // Récupérer suiAddress depuis DB (mapping Twitch ID → Sui Address)
    return [];
  }
}
```

### Étape 6: API Routes (Heures 12-14)

**6.1 Endpoint API** (`apps/api/src/routes/agent.routes.ts`)

```typescript
import { Router } from 'express';
import { StreamEndHandler } from '../services/stream-end-handler';

const router = Router();
const streamHandler = new StreamEndHandler();

// Endpoint déclenché quand un stream se termine
router.post('/analyze-stream', async (req, res) => {
  try {
    const { streamId, topN } = req.body;
    
    const result = await streamHandler.handleStreamEnd(streamId, topN || 10);
    
    res.json({
      success: true,
       result,
    });
  } catch (error) {
    console.error('Stream analysis failed:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Endpoint pour tester avec mock data
router.post('/test-scoring', async (req, res) => {
  const mockViewers = [
    {
      twitchId: 'user1',
      username: 'alice',
      suiAddress: '0xabc...',
      chatMessages: 50,
      chatQuality: ['Great stream!', 'Love this game'],
      watchtimeMinutes: 120,
      donationAmount: 10,
      emotes: 30,
    },
    // ... plus de viewers
  ];

  const nimbusAgent = new NimbusAgentService();
  const scores = await nimbusAgent.analyzeAndScoreViewers(mockViewers);
  
  res.json({ scores });
});

export default router;
```

### Étape 7: Intégration & Tests (Heures 14-18)

**7.1 Coordination avec Personne 1** [1]

Une fois que Personne 1 a déployé `nft-airdrop.move`:
1. Récupère le `PACKAGE_ID`
2. Met à jour `.env`
3. Teste l'appel avec des données mock

**7.2 Test End-to-End**

```bash
# Tester l'agent IA seul
curl -X POST http://localhost:3000/api/agent/test-scoring

# Tester le flow complet (avec un vrai stream_id après déploiement)
curl -X POST http://localhost:3000/api/agent/analyze-stream \
  -H "Content-Type: application/json" \
  -d '{"streamId": "test_stream_123", "topN": 5}'
```

## 🎯 Points Clés

**Pas de surveillance live** [1]: L'agent analyse **après** le stream, ce qui simplifie énormément l'architecture.

**Vrai agent IA** [1]: Utilisation de Nimbus + OpenAI pour un scoring intelligent, pas juste des keywords.

**Coordination avec Personne 1** [1]: Tu dépends du smart contract `nft-airdrop.move` déployé par Personne 1.

**Mapping Twitch → Sui** [1]: Les viewers doivent avoir connecté leur wallet Slush (zkLogin Google/Facebook) pour recevoir les NFTs.

## 📊 Workflow Complet

```
Stream se termine
      ↓
[POST /analyze-stream] (Webhook ou manuel)
      ↓
TwitchAnalyticsService → Récupère chat logs, watchtime, donations
      ↓
NimbusAgentService → IA score les viewers (OpenAI via Nimbus)
      ↓
Top 10 viewers sélectionnés
      ↓
NFTAirdropService → Appel smart contract batch_airdrop
      ↓
NFTs mintés et distribués on-chain ✅
```

## ⏱️ Timeline Recommandée (Total: 18h)

| Heures | Tâche |
|--------|-------|
| 0-2h   | Setup dépendances, .env, structure services |
| 2-4h   | TwitchAnalyticsService (mock data OK pour hackathon) |
| 4-8h   | NimbusAgentService avec scoring IA |
| 8-10h  | NFTAirdropService (attendre PACKAGE_ID Personne 1) |
| 10-12h | StreamEndHandler orchestration |
| 12-14h | API routes et endpoints |
| 14-18h | Tests, intégration avec smart contracts, debugging |

## 🚀 Pour la Démo

1. **Prépare un mock dataset** de viewers avec des données réalistes
2. **Montre le prompt IA** dans les logs pour que les juges voient l'analyse
3. **Affiche les transactions Sui** (digest, explorer link) pour prouver que les NFTs sont vraiment mintés
4. **Dashboard viewer** (Personne 3) montre les NFTs reçus en temps réel

Bonne chance! L'agent IA Nimbus + smart contracts SUI est exactement le type d'innovation que le hackathon Sui recherche [1][2][3][4].