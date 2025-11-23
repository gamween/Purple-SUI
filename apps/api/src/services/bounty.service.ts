import { Transaction } from '@mysten/sui/transactions';
import { bcs } from '@mysten/sui/bcs';
import { suiClient, getKeypair, PACKAGE_ID, parseSuiAmount } from '../web3/sui-client';

/**
 * Service pour gérer les bounties on-chain
 */

interface CreateBountyParams {
  bountyId: number;
  devAddress: string;
  streamerAddress: string;
  rewardAmountSui: number;
}

export class BountyService {
  /**
   * Créer une bounty on-chain avec récompense bloquée
   */
  async createBounty(params: CreateBountyParams) {
    try {
      console.log(`[BountyService] 🎯 Création bounty #${params.bountyId}`);
      console.log(`[BountyService] Dev: ${params.devAddress}`);
      console.log(`[BountyService] Streamer: ${params.streamerAddress}`);
      console.log(`[BountyService] Récompense: ${params.rewardAmountSui} SUI`);
      
      const keypair = getKeypair();
      const tx = new Transaction();
      
      // Convertir SUI en MIST
      const rewardMist = parseSuiAmount(params.rewardAmountSui);
      
      // Split gas coin pour créer la récompense
      const [rewardCoin] = tx.splitCoins(tx.gas, [rewardMist]);
      
      // Appel au smart contract: create_bounty (retourne un objet Bounty avec key)
      const [bountyObj] = tx.moveCall({
        target: `${PACKAGE_ID}::bounty::create_bounty`,
        arguments: [
          tx.pure(bcs.u64().serialize(params.bountyId).toBytes()),
          tx.pure(bcs.Address.serialize(params.devAddress).toBytes()),
          tx.pure(bcs.Address.serialize(params.streamerAddress).toBytes()),
          rewardCoin,
        ],
      });
      
      // Transférer l'objet Bounty au dev (il en est propriétaire)
      tx.transferObjects([bountyObj], tx.pure.address(params.devAddress));
      
      // Signer et exécuter
      const result = await suiClient.signAndExecuteTransaction({
        transaction: tx,
        signer: keypair,
        options: {
          showEffects: true,
          showObjectChanges: true,
        },
      });
      
      console.log(`[BountyService] ✅ Bounty créée on-chain!`);
      console.log(`[BountyService] 📜 Digest: ${result.digest}`);
      
      // Extraire l'ID de l'objet Bounty créé
      const bountyObjectId = result.objectChanges?.find(
        (change: any) => change.type === 'created' && change.objectType?.includes('::bounty::Bounty')
      )?.objectId;
      
      return {
        success: true,
        digest: result.digest,
        bountyObjectId,
        effects: result.effects,
      };
    } catch (error: any) {
      console.error('[BountyService] ❌ Erreur création bounty:', error);
      throw new Error(`Échec création bounty: ${error.message}`);
    }
  }
  
  /**
   * Accepter une bounty (streamer)
   */
  async acceptBounty(bountyObjectId: string, streamerAddress: string) {
    try {
      console.log(`[BountyService] ✋ Acceptation bounty ${bountyObjectId}`);
      
      const keypair = getKeypair();
      const tx = new Transaction();
      
      // Appel au smart contract: accept_bounty
      tx.moveCall({
        target: `${PACKAGE_ID}::bounty::accept_bounty`,
        arguments: [
          tx.object(bountyObjectId),
          tx.pure.address(streamerAddress),
        ],
      });
      
      const result = await suiClient.signAndExecuteTransaction({
        transaction: tx,
        signer: keypair,
      });
      
      console.log(`[BountyService] ✅ Bounty acceptée!`);
      console.log(`[BountyService] 📜 Digest: ${result.digest}`);
      
      return {
        success: true,
        digest: result.digest,
      };
    } catch (error: any) {
      console.error('[BountyService] ❌ Erreur acceptation bounty:', error);
      throw new Error(`Échec acceptation: ${error.message}`);
    }
  }
  
  /**
   * Compléter une bounty et payer le streamer
   */
  async completeBounty(
    bountyObjectId: string,
    devAddress: string,
    streamerAddress: string,
    coinVaultObjectId: string
  ) {
    try {
      console.log(`[BountyService] ✅ Completion bounty ${bountyObjectId}`);
      
      const keypair = getKeypair();
      const tx = new Transaction();
      
      // Appel au smart contract: complete_bounty
      tx.moveCall({
        target: `${PACKAGE_ID}::bounty::complete_bounty`,
        arguments: [
          tx.object(bountyObjectId),
          tx.pure.address(devAddress),
          tx.object(coinVaultObjectId),
          tx.pure.address(streamerAddress),
        ],
      });
      
      const result = await suiClient.signAndExecuteTransaction({
        transaction: tx,
        signer: keypair,
      });
      
      console.log(`[BountyService] 💰 Paiement effectué au streamer!`);
      console.log(`[BountyService] 📜 Digest: ${result.digest}`);
      
      return {
        success: true,
        digest: result.digest,
      };
    } catch (error: any) {
      console.error('[BountyService] ❌ Erreur completion bounty:', error);
      throw new Error(`Échec completion: ${error.message}`);
    }
  }
  
  /**
   * Récupérer les événements d'une bounty
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
      const filteredEvents = bountyId
        ? events.data.filter((event: any) => event.parsedJson?.bounty_id === bountyId)
        : events.data;
      
      return {
        total: filteredEvents.length,
        events: filteredEvents.map((event: any) => ({
          bountyId: event.parsedJson?.bounty_id,
          type: event.type.includes('Accepted') ? 'accepted' : 'completed',
          streamer: event.parsedJson?.streamer,
          dev: event.parsedJson?.dev,
          timestamp: event.timestampMs,
        })),
      };
    } catch (error: any) {
      console.error('[BountyService] ❌ Erreur récupération événements:', error);
      return { total: 0, events: [] };
    }
  }
}
