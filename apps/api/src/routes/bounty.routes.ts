import { Router, Request, Response } from 'express';
import type { IRouter } from 'express';
import { BountyService } from '../services/bounty.service';

const router: IRouter = Router();
const bountyService = new BountyService();

/**
 * POST /api/bounty/create
 * Créer une nouvelle bounty on-chain
 */
router.post('/create', async (req: Request, res: Response) => {
  try {
    const { bountyId, devAddress, streamerAddress, rewardAmountSui } = req.body;
    
    // Validation
    if (!bountyId || !devAddress || !streamerAddress || !rewardAmountSui) {
      return res.status(400).json({
        success: false,
        error: 'Paramètres manquants: bountyId, devAddress, streamerAddress, rewardAmountSui',
      });
    }
    
    if (rewardAmountSui <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Le montant doit être supérieur à 0 SUI',
      });
    }
    
    console.log(`[BountyRoutes] 📥 Création bounty #${bountyId}`);
    
    const result = await bountyService.createBounty({
      bountyId,
      devAddress,
      streamerAddress,
      rewardAmountSui,
    });
    
    console.log(`[BountyRoutes] ✅ Bounty créée: ${result.digest}`);
    
    res.json(result);
  } catch (error: any) {
    console.error('[BountyRoutes] ❌ Erreur create:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/bounty/accept
 * Streamer accepte une bounty
 */
router.post('/accept', async (req: Request, res: Response) => {
  try {
    const { bountyObjectId, streamerAddress } = req.body;
    
    if (!bountyObjectId || !streamerAddress) {
      return res.status(400).json({
        success: false,
        error: 'Paramètres manquants: bountyObjectId, streamerAddress',
      });
    }
    
    const result = await bountyService.acceptBounty(bountyObjectId, streamerAddress);
    
    res.json(result);
  } catch (error: any) {
    console.error('[BountyRoutes] ❌ Erreur accept:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/bounty/complete
 * Dev marque la bounty comme complétée
 */
router.post('/complete', async (req: Request, res: Response) => {
  try {
    const { bountyObjectId, devAddress, streamerAddress, coinVaultObjectId } = req.body;
    
    if (!bountyObjectId || !devAddress || !streamerAddress || !coinVaultObjectId) {
      return res.status(400).json({
        success: false,
        error: 'Paramètres manquants',
      });
    }
    
    const result = await bountyService.completeBounty(
      bountyObjectId,
      devAddress,
      streamerAddress,
      coinVaultObjectId
    );
    
    res.json(result);
  } catch (error: any) {
    console.error('[BountyRoutes] ❌ Erreur complete:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/bounty/events/:bountyId?
 * Récupérer les événements blockchain
 */
router.get('/events/:bountyId?', async (req: Request, res: Response) => {
  try {
    const { bountyId } = req.params;
    
    const result = await bountyService.getBountyEvents(
      bountyId ? parseInt(bountyId) : undefined
    );
    
    res.json(result);
  } catch (error: any) {
    console.error('[BountyRoutes] ❌ Erreur events:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
