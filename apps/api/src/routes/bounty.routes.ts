import { Router } from 'express';
import { BountyService } from '../services/bounty.service';

const router = Router();
const bountyService = new BountyService();

/**
 * POST /api/bounty/create
 * Créer une nouvelle bounty avec du SUI bloqué
 * Body: { bountyId: number, devAddress: string, streamerAddress: string, rewardAmountSui: number }
 */
router.post('/create', async (req, res) => {
  try {
    const { bountyId, devAddress, streamerAddress, rewardAmountSui } = req.body;
    
    if (!bountyId || !devAddress || !streamerAddress || !rewardAmountSui) {
      return res.status(400).json({
        success: false,
        error: 'Paramètres manquants: bountyId, devAddress, streamerAddress, rewardAmountSui',
      });
    }
    
    const result = await bountyService.createBounty({
      bountyId,
      devAddress,
      streamerAddress,
      rewardAmountSui,
    });
    
    res.json(result);
  } catch (error: any) {
    console.error('[BountyRoutes] Erreur create:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/bounty/accept
 * Streamer accepte une bounty
 * Body: { bountyObjectId: string, streamerAddress: string }
 */
router.post('/accept', async (req, res) => {
  try {
    const { bountyObjectId, streamerAddress } = req.body;
    
    if (!bountyObjectId || !streamerAddress) {
      return res.status(400).json({
        success: false,
        error: 'Paramètres manquants: bountyObjectId, streamerAddress',
      });
    }
    
    const result = await bountyService.acceptBounty({
      bountyObjectId,
      streamerAddress,
    });
    
    res.json(result);
  } catch (error: any) {
    console.error('[BountyRoutes] Erreur accept:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * POST /api/bounty/complete
 * Dev marque la bounty comme complétée et paie le streamer
 * Body: { bountyObjectId: string, devAddress: string, streamerAddress: string, coinVaultObjectId: string }
 */
router.post('/complete', async (req, res) => {
  try {
    const { bountyObjectId, devAddress, streamerAddress, coinVaultObjectId } = req.body;
    
    if (!bountyObjectId || !devAddress || !streamerAddress || !coinVaultObjectId) {
      return res.status(400).json({
        success: false,
        error: 'Paramètres manquants: bountyObjectId, devAddress, streamerAddress, coinVaultObjectId',
      });
    }
    
    const result = await bountyService.completeBounty({
      bountyObjectId,
      devAddress,
      streamerAddress,
      coinVaultObjectId,
    });
    
    res.json(result);
  } catch (error: any) {
    console.error('[BountyRoutes] Erreur complete:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/bounty/events/:bountyId?
 * Récupérer les événements d'une bounty spécifique ou tous
 */
router.get('/events/:bountyId?', async (req, res) => {
  try {
    const { bountyId } = req.params;
    
    const result = await bountyService.getBountyEvents(
      bountyId ? parseInt(bountyId) : undefined
    );
    
    res.json(result);
  } catch (error: any) {
    console.error('[BountyRoutes] Erreur events:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
