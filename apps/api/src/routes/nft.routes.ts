import { Router } from 'express';
import { NFTAirdropService } from '../services/nft-airdrop.service';

const router = Router();
const nftService = new NFTAirdropService();

/**
 * POST /api/nft/batch
 * Airdrop batch de NFTs aux viewers engagés (admin only)
 * Body: { recipients: [{ address: string, score: number }] }
 * Limite: 100 recipients max
 */
router.post('/batch', async (req, res) => {
  try {
    const { recipients } = req.body;
    
    if (!recipients || !Array.isArray(recipients)) {
      return res.status(400).json({
        success: false,
        error: 'Paramètre recipients manquant ou invalide (array requis)',
      });
    }
    
    // Valider format des recipients
    for (const r of recipients) {
      if (!r.address || typeof r.score !== 'number') {
        return res.status(400).json({
          success: false,
          error: 'Format recipients invalide: { address: string, score: number }',
        });
      }
    }
    
    if (recipients.length > 100) {
      return res.status(400).json({
        success: false,
        error: 'Limite de 100 recipients par batch',
      });
    }
    
    const result = await nftService.batchAirdrop({ recipients });
    
    res.json(result);
  } catch (error: any) {
    console.error('[NFTRoutes] Erreur batch:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/nft/single
 * Airdrop d'un NFT à un viewer (admin only)
 * Body: { address: string, score: number }
 */
router.post('/single', async (req, res) => {
  try {
    const { address, score } = req.body;
    
    if (!address || typeof score !== 'number') {
      return res.status(400).json({
        success: false,
        error: 'Paramètres manquants ou invalides: address (string), score (number)',
      });
    }
    
    const result = await nftService.airdropSingle(address, score);
    
    res.json(result);
  } catch (error: any) {
    console.error('[NFTRoutes] Erreur single:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/nft/history
 * Récupérer l'historique de tous les airdrops
 */
router.get('/history', async (req, res) => {
  try {
    const result = await nftService.getAirdropHistory();
    
    res.json(result);
  } catch (error: any) {
    console.error('[NFTRoutes] Erreur history:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/nft/my-nfts/:address
 * Récupérer les NFTs d'engagement d'un viewer
 */
router.get('/my-nfts/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!address) {
      return res.status(400).json({
        success: false,
        error: 'address manquante',
      });
    }
    
    const result = await nftService.getRecipientNFTs(address);
    
    res.json(result);
  } catch (error: any) {
    console.error('[NFTRoutes] Erreur my-nfts:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
