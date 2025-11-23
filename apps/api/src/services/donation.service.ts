import { Transaction } from '@mysten/sui/transactions';
import { suiClient, getKeypair, PACKAGE_ID, parseSuiAmount, getSuiCoins } from '../web3/sui-client';

/**
 * Service pour gérer les donations avec split automatique
 * Interagit avec le contract creator_seal::donation_split
 */

interface DonationSplitParams {
  streamerAddress: string;
  devAddress: string;
  splitRatio: number; // En basis points (ex: 2000 = 20% pour le dev)
  donationAmountSui: number; // Montant total en SUI
  donorAddress?: string; // Optionnel, sinon keypair par défaut
}

export class DonationService {
  /**
   * Effectue une donation avec split automatique entre streamer et dev
   * Le split_ratio est en basis points (10000 = 100%)
   * Exemple: splitRatio = 2000 → 20% pour le dev, 80% pour le streamer
   */
  async processDonation(params: DonationSplitParams) {
    try {
      console.log('[DonationService] 💰 Traitement donation:', params);
      
      const keypair = getKeypair();
      const donorAddress = params.donorAddress || keypair.getPublicKey().toSuiAddress();
      
      // Récupérer des coins du donor
      const coins = await getSuiCoins(donorAddress);
      if (coins.length === 0) {
        throw new Error('Aucun coin SUI disponible pour le donor');
      }
      
      const tx = new Transaction();
      
      // Split coin pour la donation
      const donationAmount = parseSuiAmount(params.donationAmountSui);
      const [donationCoin] = tx.splitCoins(tx.gas, [donationAmount]);
      
      // Appel du contract donation_split::donate_and_split
      tx.moveCall({
        target: `${PACKAGE_ID}::donation_split::donate_and_split`,
        arguments: [
          tx.pure.address(params.streamerAddress),
          tx.pure.address(params.devAddress),
          tx.pure.u64(params.splitRatio), // Basis points (0-10000)
          donationCoin, // Coin<SUI> de la donation
        ],
      });
      
      const result = await suiClient.signAndExecuteTransactionBlock({
        transactionBlock: tx,
        signer: keypair,
      });
      
      console.log('[DonationService] ✅ Donation splittée, digest:', result.digest);
      
      // Calculer les montants
      const devAmount = (params.donationAmountSui * params.splitRatio) / 10000;
      const streamerAmount = params.donationAmountSui - devAmount;
      
      return {
        success: true,
        digest: result.digest,
        totalAmount: params.donationAmountSui,
        devAmount,
        streamerAmount,
        splitRatio: params.splitRatio / 100, // En pourcentage
      };
    } catch (error: any) {
      console.error('[DonationService] ❌ Erreur traitement donation:', error);
      throw new Error(`Échec traitement donation: ${error.message}`);
    }
  }

  /**
   * Récupérer l'historique des donations pour un streamer
   */
  async getDonationHistory(streamerAddress: string) {
    try {
      const events = await suiClient.queryEvents({
        query: {
          MoveEventModule: {
            package: PACKAGE_ID,
            module: 'donation_split',
          },
        },
        limit: 100,
      });
      
      // Filtrer les donations pour ce streamer
      const streamerDonations = events.data.filter((event: any) => 
        event.parsedJson?.streamer === streamerAddress
      );
      
      return {
        total: streamerDonations.length,
        donations: streamerDonations.map((event: any) => ({
          donor: event.parsedJson.donor,
          amount: event.parsedJson.amount,
          splitRatio: event.parsedJson.split_ratio,
          timestamp: event.timestampMs,
        })),
      };
    } catch (error: any) {
      console.error('[DonationService] ❌ Erreur récupération historique:', error);
      return { total: 0, donations: [] };
    }
  }

  /**
   * Calculer les statistiques de donations pour un streamer
   */
  async getDonationStats(streamerAddress: string) {
    try {
      const history = await this.getDonationHistory(streamerAddress);
      
      const totalDonated = history.donations.reduce(
        (sum, donation) => sum + parseInt(donation.amount),
        0
      );
      
      return {
        totalDonations: history.total,
        totalAmount: totalDonated / 1_000_000_000, // Convertir en SUI
        uniqueDonors: new Set(history.donations.map(d => d.donor)).size,
      };
    } catch (error: any) {
      console.error('[DonationService] ❌ Erreur calcul stats:', error);
      return { totalDonations: 0, totalAmount: 0, uniqueDonors: 0 };
    }
  }
}
