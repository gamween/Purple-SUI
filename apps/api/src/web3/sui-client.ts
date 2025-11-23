import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { fromB64 } from '@mysten/sui/utils';

/**
 * Configuration du client Sui pour interagir avec la blockchain
 * Utilise les variables d'environnement pour la configuration
 */

// Client Sui configuré pour testnet
export const suiClient = new SuiClient({
  url: process.env.SUI_RPC_URL || getFullnodeUrl('testnet'),
});

/**
 * Récupère le keypair depuis la clé privée stockée en env
 * Format attendu : Base64 string
 */
export const getKeypair = (): Ed25519Keypair => {
  const privateKey = process.env.SUI_PRIVATE_KEY;
  
  if (!privateKey) {
    throw new Error('❌ SUI_PRIVATE_KEY non configurée dans .env');
  }

  try {
    // La clé est en base64, on la convertit
    const keypair = Ed25519Keypair.fromSecretKey(fromB64(privateKey));
    console.log('[Sui] ✅ Keypair chargé:', keypair.getPublicKey().toSuiAddress());
    return keypair;
  } catch (error) {
    console.error('[Sui] ❌ Erreur chargement keypair:', error);
    throw new Error('Format SUI_PRIVATE_KEY invalide (doit être base64)');
  }
};

/**
 * Package ID déployé du contract creator_seal
 * À mettre à jour après déploiement sur testnet
 */
export const PACKAGE_ID = process.env.PACKAGE_ID || '0x0'; // Placeholder

/**
 * Adresse admin autorisée pour les airdrops NFT
 */
export const ADMIN_ADDRESS = process.env.ADMIN_ADDRESS || getKeypair().getPublicKey().toSuiAddress();

/**
 * Vérifie la configuration Sui au démarrage
 */
export const verifySuiConfig = async (): Promise<boolean> => {
  try {
    console.log('[Sui] 🔍 Vérification de la configuration...');
    
    // Test connexion RPC
    const chainId = await suiClient.getChainIdentifier();
    console.log('[Sui] ✅ Connecté à la blockchain, Chain ID:', chainId);
    
    // Test keypair
    const keypair = getKeypair();
    const address = keypair.getPublicKey().toSuiAddress();
    console.log('[Sui] ✅ Adresse wallet:', address);
    
    // Vérifier le solde
    const balance = await suiClient.getBalance({ owner: address });
    console.log('[Sui] 💰 Solde:', parseInt(balance.totalBalance) / 1_000_000_000, 'SUI');
    
    // Vérifier Package ID
    if (PACKAGE_ID === '0x0') {
      console.warn('[Sui] ⚠️  PACKAGE_ID non configuré, mettre à jour après déploiement');
    } else {
      console.log('[Sui] ✅ Package ID:', PACKAGE_ID);
    }
    
    return true;
  } catch (error) {
    console.error('[Sui] ❌ Erreur de configuration:', error);
    return false;
  }
};

/**
 * Helper: Récupère les objets Coin<SUI> d'une adresse
 */
export const getSuiCoins = async (address: string) => {
  const coins = await suiClient.getCoins({ owner: address, coinType: '0x2::sui::SUI' });
  return coins.data;
};

/**
 * Helper: Formater un montant SUI (1 SUI = 10^9 MIST)
 */
export const formatSuiAmount = (amount: number): number => {
  return amount / 1_000_000_000;
};

export const parseSuiAmount = (sui: number): bigint => {
  return BigInt(Math.floor(sui * 1_000_000_000));
};
