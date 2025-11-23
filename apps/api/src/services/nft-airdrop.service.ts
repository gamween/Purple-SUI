import { Transaction } from '@mysten/sui/transactions';
import { suiClient, getKeypair, PACKAGE_ID, ADMIN_ADDRESS } from '../web3/sui-client';

/**
 * Service pour gérer les airdrops de NFTs d'engagement
 * Interagit avec le contract creator_seal::nft_airdrop
 */

interface AirdropRecipient {
  address: string;
  score: number; // Score d'engagement (ex: messages, donations, etc.)
}

interface BatchAirdropParams {
  recipients: AirdropRecipient[];
}

export class NFTAirdropService {
  /**
   * Distribution batch de NFTs aux viewers engagés
   * Limite: 100 recipients max par transaction
   */
  async batchAirdrop(params: BatchAirdropParams) {
    try {
      console.log(`[NFTAirdropService] 🎁 Airdrop pour ${params.recipients.length} recipients`);
      
      // Vérifier la limite
      if (params.recipients.length === 0) {
        throw new Error('Aucun recipient fourni');
      }
      
      if (params.recipients.length > 100) {
        throw new Error('Limite de 100 recipients par batch');
      }
      
      const keypair = getKeypair();
      const adminAddress = keypair.getPublicKey().toSuiAddress();
      
      // Vérifier que c'est bien l'admin
      if (adminAddress !== ADMIN_ADDRESS) {
        throw new Error('Seul l\'admin peut lancer un airdrop');
      }
      
      const tx = new Transaction();
      
      // Préparer les vecteurs d'addresses et de scores
      const addresses = params.recipients.map(r => r.address);
      const scores = params.recipients.map(r => r.score);
      
      // Appel du contract nft_airdrop::batch_airdrop
      tx.moveCall({
        target: `${PACKAGE_ID}::nft_airdrop::batch_airdrop`,
        arguments: [
          tx.pure('vector<address>', addresses),
          tx.pure('vector<u64>', scores),
        ],
      });
      
      const result = await suiClient.signAndExecuteTransaction({
        transaction: tx,
        signer: keypair,
      });
      
      console.log('[NFTAirdropService] ✅ Airdrop complété, digest:', result.digest);
      
      return {
        success: true,
        digest: result.digest,
        recipientCount: params.recipients.length,
        recipients: params.recipients,
      };
    } catch (error: any) {
      console.error('[NFTAirdropService] ❌ Erreur airdrop:', error);
      throw new Error(`Échec airdrop: ${error.message}`);
    }
  }

  /**
   * Airdrop pour un seul recipient (wrapper simplifié)
   */
  async airdropSingle(address: string, score: number) {
    return this.batchAirdrop({
      recipients: [{ address, score }],
    });
  }

  /**
   * Récupérer les événements d'airdrop
   */
  async getAirdropHistory() {
    try {
      const events = await suiClient.queryEvents({
        query: {
          MoveEventModule: {
            package: PACKAGE_ID,
            module: 'nft_airdrop',
          },
        },
        limit: 50,
      });
      
      return {
        total: events.data.length,
        airdrops: events.data.map((event: any) => ({
          recipients: event.parsedJson.recipients,
          scores: event.parsedJson.scores,
          count: event.parsedJson.count,
          success: event.parsedJson.success,
          timestamp: event.timestampMs,
        })),
      };
    } catch (error: any) {
      console.error('[NFTAirdropService] ❌ Erreur récupération historique:', error);
      return { total: 0, airdrops: [] };
    }
  }

  /**
   * Vérifier si une adresse a reçu des NFTs
   */
  async getRecipientNFTs(address: string) {
    try {
      // Récupérer les objets EngagementNFT possédés par l'adresse
      const objects = await suiClient.getOwnedObjects({
        owner: address,
        filter: {
          StructType: `${PACKAGE_ID}::nft_airdrop::EngagementNFT`,
        },
        options: {
          showContent: true,
        },
      });
      
      return {
        count: objects.data.length,
        nfts: objects.data.map((obj: any) => ({
          objectId: obj.data.objectId,
          score: obj.data.content?.fields?.score,
          recipient: obj.data.content?.fields?.recipient,
        })),
      };
    } catch (error: any) {
      console.error('[NFTAirdropService] ❌ Erreur récupération NFTs:', error);
      return { count: 0, nfts: [] };
    }
  }
}
