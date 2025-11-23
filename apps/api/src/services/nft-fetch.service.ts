import { suiClient } from '../web3/sui-client.js';

interface NftMetadata {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  type: string;
}

export async function getNftsOwnedByAddress(address: string): Promise<NftMetadata[]> {
  try {
    console.log(`[NFT Fetch] 🔍 Fetching NFTs for address: ${address}`);

    // Récupérer tous les objets possédés par l'adresse
    const ownedObjects = await suiClient.getOwnedObjects({
      owner: address,
      options: {
        showContent: true,
        showDisplay: true,
        showType: true,
      },
    });

    console.log(`[NFT Fetch] 📦 Found ${ownedObjects.data.length} owned objects`);

    const nfts: NftMetadata[] = [];

    for (const obj of ownedObjects.data) {
      // Filtrer pour ne garder que les NFTs (pas les coins, etc.)
      if (obj.data?.type && obj.data.type.includes('::nft::')) {
        // Essayer d'abord display, puis content.fields
        const display = obj.data.display?.data;
        const content = obj.data.content as any;
        const fields = content?.fields;
        
        if (display || fields) {
          const nft = {
            id: obj.data.objectId,
            name: display?.name || fields?.name || 'Unnamed NFT',
            description: display?.description || fields?.description || '',
            imageUrl: display?.image_url || display?.url || fields?.image_url || '',
            type: obj.data.type,
          };
          
          nfts.push(nft);
          console.log(`[NFT Fetch] ✅ Found NFT: ${nft.name}`);
        }
      }
    }

    console.log(`[NFT Fetch] 🎨 Total NFTs found: ${nfts.length}`);
    return nfts;
  } catch (error) {
    console.error('[NFT Fetch] ❌ Error fetching NFTs from blockchain:', error);
    throw new Error('Failed to fetch NFTs');
  }
}
