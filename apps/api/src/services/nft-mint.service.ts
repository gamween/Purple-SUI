import { SuiClient, SuiTransactionBlockResponse } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { getKeypair, suiClient } from '../web3/sui-client.js';
import { uploadImageToIPFS } from '../utils/ipfs-uploader.js';

const PACKAGE_ID = process.env.SUI_PACKAGE_ID || '0xaf077749829c9d993ae424e81acaf8650af3f403ed0dbf9a8ba2742489bc30c0';

export interface MintNftParams {
  imageName: string;        // Nom du fichier dans nft-designs/
  recipientAddress: string; // Adresse Sui du destinataire
  name: string;             // Nom du NFT
  description: string;      // Description du NFT
}

export interface MintNftResult {
  success: boolean;
  digest?: string;
  imageUrl?: string;
  recipientAddress?: string;
  error?: string;
}

/**
 * Mint un NFT personnalisé sur Sui avec une image locale
 * 1. Upload l'image vers IPFS via Pinata
 * 2. Crée une transaction pour minter le NFT
 * 3. Envoie le NFT au wallet du destinataire
 */
export async function mintNftToWallet(params: MintNftParams): Promise<MintNftResult> {
  const { imageName, recipientAddress, name, description } = params;

  console.log('[NFT Mint] 🎨 Starting NFT minting process...');
  console.log(`[NFT Mint] 📦 Name: ${name}`);
  console.log(`[NFT Mint] 🖼️  Image: ${imageName}`);
  console.log(`[NFT Mint] 📬 Recipient: ${recipientAddress}`);

  try {
    // 1. Upload l'image vers IPFS
    console.log('[NFT Mint] Step 1/3: Uploading image to IPFS...');
    const imageUrl = await uploadImageToIPFS(imageName);
    
    // 2. Préparer la transaction Sui
    console.log('[NFT Mint] Step 2/3: Creating blockchain transaction...');
    const client: SuiClient = suiClient;
    const keypair = getKeypair();
    const senderAddress = keypair.toSuiAddress();

    const tx = new Transaction();
    tx.setSender(senderAddress);

    // Appel au smart contract NFT
    tx.moveCall({
      target: `${PACKAGE_ID}::nft::mint_nft`,
      arguments: [
        tx.pure.string(name),
        tx.pure.string(description),
        tx.pure.string(imageUrl),
        tx.pure.address(recipientAddress),
      ],
    });

    // 3. Signer et exécuter la transaction
    console.log('[NFT Mint] Step 3/3: Signing and executing transaction...');
    const result: SuiTransactionBlockResponse = await client.signAndExecuteTransaction({
      signer: keypair,
      transaction: tx,
      options: {
        showEffects: true,
        showObjectChanges: true,
      },
    });

    const digest = result.digest;
    console.log('[NFT Mint] ✅ NFT minted successfully!');
    console.log(`[NFT Mint] 🔗 Transaction: https://suiscan.xyz/testnet/tx/${digest}`);
    console.log(`[NFT Mint] 🌐 Image URL: ${imageUrl}`);

    return {
      success: true,
      digest,
      imageUrl,
      recipientAddress,
    };
  } catch (error: any) {
    console.error('[NFT Mint] ❌ Minting failed:', error.message);
    return {
      success: false,
      error: error.message || 'NFT minting failed',
    };
  }
}

/**
 * Mint plusieurs NFTs en batch (même image, plusieurs destinataires)
 */
export async function mintNftBatch(
  imageName: string,
  recipients: Array<{ address: string; name: string; description: string }>
): Promise<MintNftResult[]> {
  console.log(`[NFT Mint Batch] 🎨 Minting ${recipients.length} NFTs...`);

  // Upload l'image une seule fois
  const imageUrl = await uploadImageToIPFS(imageName);

  const results: MintNftResult[] = [];

  for (const recipient of recipients) {
    try {
      const client: SuiClient = suiClient;
      const keypair = getKeypair();
      const senderAddress = keypair.toSuiAddress();

      const tx = new Transaction();
      tx.setSender(senderAddress);

      tx.moveCall({
        target: `${PACKAGE_ID}::nft::mint_nft`,
        arguments: [
          tx.pure.string(recipient.name),
          tx.pure.string(recipient.description),
          tx.pure.string(imageUrl),
          tx.pure.address(recipient.address),
        ],
      });

      const result: SuiTransactionBlockResponse = await client.signAndExecuteTransaction({
        signer: keypair,
        transaction: tx,
        options: {
          showEffects: true,
          showObjectChanges: true,
        },
      });

      results.push({
        success: true,
        digest: result.digest,
        imageUrl,
        recipientAddress: recipient.address,
      });

      console.log(`[NFT Mint Batch] ✅ Minted for ${recipient.address}`);
    } catch (error: any) {
      console.error(`[NFT Mint Batch] ❌ Failed for ${recipient.address}:`, error.message);
      results.push({
        success: false,
        error: error.message,
        recipientAddress: recipient.address,
      });
    }
  }

  return results;
}
