import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { fromBase64 } from '@mysten/sui/utils';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Charger les variables d'environnement
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

/**
 * Configuration du client Sui pour interagir avec la blockchain
 */

// Client Sui configuré pour testnet
export const suiClient = new SuiClient({
  url: process.env.SUI_RPC_URL || getFullnodeUrl('testnet'),
});

/**
 * Récupère le keypair depuis la clé privée en base64
 */
export const getKeypair = (): Ed25519Keypair => {
  const privateKey = process.env.SUI_PRIVATE_KEY;
  
  if (!privateKey) {
    throw new Error('SUI_PRIVATE_KEY not found in environment variables');
  }
  
  try {
    // Convertir la clé privée base64 en Uint8Array
    const privateKeyBytes = fromBase64(privateKey);
    
    // Sui CLI exporte les clés avec un flag scheme de 1 byte au début (0x00 pour Ed25519)
    // On doit retirer ce premier byte pour obtenir les 32 bytes de la clé
    const keyWithoutFlag = privateKeyBytes.length === 33 
      ? privateKeyBytes.slice(1) 
      : privateKeyBytes;
    
    return Ed25519Keypair.fromSecretKey(keyWithoutFlag);
  } catch (error) {
    console.error('[Sui Client] Error loading keypair:', error);
    throw new Error('Invalid SUI_PRIVATE_KEY format');
  }
};

/**
 * Package ID du smart contract déployé
 */
export const PACKAGE_ID = process.env.PACKAGE_ID || '0x0';

/**
 * Adresse admin pour les opérations privilégiées
 */
export const ADMIN_ADDRESS = process.env.ADMIN_ADDRESS || getKeypair().toSuiAddress();

/**
 * Vérifie la configuration Sui au démarrage
 */
export const verifySuiConfig = async (): Promise<boolean> => {
  try {
    console.log('[Sui] 🔍 Vérification de la configuration...');
    
    // Vérifier connexion RPC
    const chainId = await suiClient.getChainIdentifier();
    console.log(`[Sui] ✅ Connecté à la blockchain, Chain ID: ${chainId}`);
    
    // Vérifier keypair
    const keypair = getKeypair();
    const address = keypair.toSuiAddress();
    console.log(`[Sui] ✅ Adresse wallet: ${address}`);
    
    // Vérifier balance
    const balance = await suiClient.getBalance({ owner: address });
    console.log(`[Sui] 💰 Solde: ${(parseInt(balance.totalBalance) / 1e9).toFixed(4)} SUI`);
    
    // Vérifier PACKAGE_ID
    if (PACKAGE_ID === '0x0') {
      console.warn('[Sui] ⚠️  PACKAGE_ID non configuré - Définissez-le dans .env');
    } else {
      console.log(`[Sui] ✅ Package ID: ${PACKAGE_ID}`);
    }
    
    return true;
  } catch (error) {
    console.error('[Sui] ❌ Erreur de configuration:', error);
    return false;
  }
};

/**
 * Convertir MIST en SUI (1 SUI = 10^9 MIST)
 */
export const formatSuiAmount = (mist: string | number): number => {
  return parseInt(mist.toString()) / 1e9;
};

/**
 * Convertir SUI en MIST
 */
export const parseSuiAmount = (sui: number): bigint => {
  return BigInt(Math.floor(sui * 1e9));
};
