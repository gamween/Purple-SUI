import express, { Request, Response, Router } from 'express';
import { mintNftToWallet, mintNftBatch, MintNftParams } from '../services/nft-mint.service.js';
import { checkImageExists, listAvailableImages } from '../utils/ipfs-uploader.js';
import { getNftsOwnedByAddress } from '../services/nft-fetch.service.js';

const router: Router = express.Router();

/**
 * POST /api/nft/mint
 * Mint un NFT unique avec une image locale
 * 
 * Body:
 * {
 *   "imageName": "design1.png",
 *   "recipientAddress": "0x...",
 *   "name": "Purple SUI NFT #1",
 *   "description": "Reward for completing bounty"
 * }
 */
router.post('/mint', async (req: Request, res: Response) => {
  try {
    const { imageName, recipientAddress, name, description } = req.body;

    // Validation
    if (!imageName || !recipientAddress || !name || !description) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: imageName, recipientAddress, name, description',
      });
    }

    // Vérifier que l'image existe
    if (!checkImageExists(imageName)) {
      return res.status(404).json({
        success: false,
        error: `Image "${imageName}" not found in nft-designs/ directory`,
        availableImages: listAvailableImages(),
      });
    }

    // Mint le NFT
    const params: MintNftParams = {
      imageName,
      recipientAddress,
      name,
      description,
    };

    const result = await mintNftToWallet(params);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json(result);
    }
  } catch (error: any) {
    console.error('[NFT API] Error in /mint:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
});

/**
 * POST /api/nft/mint-batch
 * Mint plusieurs NFTs avec la même image
 * 
 * Body:
 * {
 *   "imageName": "design1.png",
 *   "recipients": [
 *     {
 *       "address": "0x...",
 *       "name": "NFT #1",
 *       "description": "First NFT"
 *     },
 *     {
 *       "address": "0x...",
 *       "name": "NFT #2",
 *       "description": "Second NFT"
 *     }
 *   ]
 * }
 */
router.post('/mint-batch', async (req: Request, res: Response) => {
  try {
    const { imageName, recipients } = req.body;

    // Validation
    if (!imageName || !recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: imageName, recipients (array)',
      });
    }

    // Vérifier que l'image existe
    if (!checkImageExists(imageName)) {
      return res.status(404).json({
        success: false,
        error: `Image "${imageName}" not found in nft-designs/ directory`,
        availableImages: listAvailableImages(),
      });
    }

    // Vérifier que chaque recipient a les champs requis
    for (const recipient of recipients) {
      if (!recipient.address || !recipient.name || !recipient.description) {
        return res.status(400).json({
          success: false,
          error: 'Each recipient must have: address, name, description',
        });
      }
    }

    // Mint les NFTs
    const results = await mintNftBatch(imageName, recipients);

    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.filter((r) => !r.success).length;

    return res.status(200).json({
      success: true,
      total: recipients.length,
      successCount,
      failureCount,
      results,
    });
  } catch (error: any) {
    console.error('[NFT API] Error in /mint-batch:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
});

/**
 * GET /api/nft/designs
 * Liste toutes les images disponibles dans nft-designs/
 */
router.get('/designs', (_req: Request, res: Response) => {
  try {
    const images = listAvailableImages();
    return res.status(200).json({
      success: true,
      count: images.length,
      images,
    });
  } catch (error: any) {
    console.error('[NFT API] Error in /designs:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
});

/**
 * GET /api/nft/owned/:address
 * Récupérer les NFTs possédés par une adresse Sui
 */
router.get('/owned/:address', async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    
    if (!address || !address.startsWith('0x')) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid Sui address' 
      });
    }

    const nfts = await getNftsOwnedByAddress(address);
    return res.status(200).json({ 
      success: true, 
      nfts 
    });
  } catch (error: any) {
    console.error('[NFT API] Error in /owned:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to fetch NFTs'
    });
  }
});

export default router;
