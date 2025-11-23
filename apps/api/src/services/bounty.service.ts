import { Transaction } from '@mysten/sui/transactions';
import { suiClient, getKeypair, PACKAGE_ID, parseSuiAmount, getSuiCoins } from '../web3/sui-client';

/**
 * Service pour gérer les bounties on-chain
 * Interagit avec le contract creator_seal::bounty
 */

interface CreateBountyParams {
  bountyId: number;
  devAddress: string;
  streamerAddress: string;
  rewardAmountSui: number; // Montant en SUI (ex: 10 SUI)
}

interface AcceptBountyParams {
  bountyObjectId: string;
  streamerAddress: string;
}

interface CompleteBountyParams {
  bountyObjectId: string;
  devAddress: string;
  streamerAddress: string;
  coinVaultObjectId: string;
}

export class BountyService {
  /**
   * Créer un nouveau bounty on-chain
   * Le dev lock des fonds dans le bounty
   */
  async createBounty(params: CreateBountyParams) {
    try {
      console.log('[BountyService] 🎯 Création bounty:', params);
      
      const keypair = getKeypair();
      const devAddress = keypair.getPublicKey().toSuiAddress();
      
      // Récupérer des coins pour payer la reward
      const coins = await getSuiCoins(devAddress);
      if (coins.length === 0) {
        throw new Error('Aucun coin SUI disponible');
      }
      
      const tx = new Transaction();
      
      // Split coin pour la reward
      const rewardAmount = parseSuiAmount(params.rewardAmountSui);
      const [rewardCoin] = tx.splitCoins(tx.gas, [rewardAmount]);
      
      // Appel du contract bounty::create_bounty
      tx.moveCall({
        target: `${PACKAGE_ID}::bounty::create_bounty`,
        arguments: [
          tx.pure.u64(params.bountyId),
          tx.pure.address(params.devAddress),
          tx.pure.address(params.streamerAddress),
          rewardCoin,
        ],
      });
      
      const result = await suiClient.signAndExecuteTransaction({
        transaction: tx,
        signer: keypair,
      });
      
      console.log('[BountyService] ✅ Bounty créé, digest:', result.digest);
      
      return {
        success: true,
        digest: result.digest,
        bountyId: params.bountyId,
        effects: result.effects,
      };
    } catch (error: any) {
      console.error('[BountyService] ❌ Erreur création bounty:', error);
      throw new Error(`Échec création bounty: ${error.message}`);
    }
  }

  /**
   * Streamer accepte le bounty
   */
  async acceptBounty(params: AcceptBountyParams) {
    try {
      console.log('[BountyService] ✅ Acceptation bounty:', params);
      
      const keypair = getKeypair();
      const tx = new Transaction();
      
      // Appel accept_bounty (mutable bounty object)
      tx.moveCall({
        target: `${PACKAGE_ID}::bounty::accept_bounty`,
        arguments: [
          tx.object(params.bountyObjectId), // &mut Bounty
          tx.pure.address(params.streamerAddress),
        ],
      });
      
      const result = await suiClient.signAndExecuteTransaction({
        transaction: tx,
        signer: keypair,
      });
      
      console.log('[BountyService] ✅ Bounty accepté, digest:', result.digest);
      
      return {
        success: true,
        digest: result.digest,
      };
    } catch (error: any) {
      console.error('[BountyService] ❌ Erreur acceptation bounty:', error);
      throw new Error(`Échec acceptation bounty: ${error.message}`);
    }
  }

  /**
   * Compléter le bounty et payer le streamer
   */
  async completeBounty(params: CompleteBountyParams) {
    try {
      console.log('[BountyService] 🎉 Complétion bounty:', params);
      
      const keypair = getKeypair();
      const tx = new Transaction();
      
      // Appel complete_bounty
      tx.moveCall({
        target: `${PACKAGE_ID}::bounty::complete_bounty`,
        arguments: [
          tx.object(params.bountyObjectId), // &mut Bounty
          tx.pure.address(params.devAddress),
          tx.object(params.coinVaultObjectId), // &mut Coin<SUI> vault
          tx.pure.address(params.streamerAddress),
        ],
      });
      
      const result = await suiClient.signAndExecuteTransaction({
        transaction: tx,
        signer: keypair,
      });
      
      console.log('[BountyService] ✅ Bounty complété, paiement envoyé, digest:', result.digest);
      
      return {
        success: true,
        digest: result.digest,
        paid: true,
      };
    } catch (error: any) {
      console.error('[BountyService] ❌ Erreur complétion bounty:', error);
      throw new Error(`Échec complétion bounty: ${error.message}`);
    }
  }

  /**
   * Récupérer les événements de bounty depuis la blockchain
   */
  async getBountyEvents(bountyId?: number) {
    try {
      const events = await suiClient.queryEvents({
        query: {
          MoveEventModule: {
            package: PACKAGE_ID,
            module: 'bounty',
          },
        },
        limit: 50,
      });
      
      // Filtrer par bountyId si fourni
      if (bountyId) {
        return events.data.filter((event: any) => 
          event.parsedJson?.bounty_id === bountyId
        );
      }
      
      return events.data;
    } catch (error: any) {
      console.error('[BountyService] ❌ Erreur récupération événements:', error);
      return [];
    }
  }
}
