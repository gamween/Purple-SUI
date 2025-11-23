import { Router } from 'express';
import { DonationService } from '../services/donation.service';

const router = Router();
const donationService = new DonationService();

/**
 * POST /api/donation/split
 * Viewer envoie une donation qui se split automatiquement streamer/dev
 * Body: { streamerAddress: string, devAddress: string, splitRatio: number, donationAmountSui: number }
 * splitRatio: basis points (ex: 2000 = 20% pour dev, 80% pour streamer)
 */
router.post('/split', async (req, res) => {
  try {
    const { streamerAddress, devAddress, splitRatio, donationAmountSui } = req.body;
    
    if (!streamerAddress || !devAddress || splitRatio === undefined || !donationAmountSui) {
      return res.status(400).json({
        success: false,
        error: 'Paramètres manquants: streamerAddress, devAddress, splitRatio, donationAmountSui',
      });
    }
    
    // Valider splitRatio (0-10000)
    if (splitRatio < 0 || splitRatio > 10000) {
      return res.status(400).json({
        success: false,
        error: 'splitRatio doit être entre 0 et 10000 (basis points)',
      });
    }
    
    const result = await donationService.processDonation({
      streamerAddress,
      devAddress,
      splitRatio,
      donationAmountSui,
    });
    
    res.json(result);
  } catch (error: any) {
    console.error('[DonationRoutes] Erreur split:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/donation/history/:streamerAddress
 * Récupérer l'historique des donations pour un streamer
 */
router.get('/history/:streamerAddress', async (req, res) => {
  try {
    const { streamerAddress } = req.params;
    
    if (!streamerAddress) {
      return res.status(400).json({
        success: false,
        error: 'streamerAddress manquant',
      });
    }
    
    const result = await donationService.getDonationHistory(streamerAddress);
    
    res.json(result);
  } catch (error: any) {
    console.error('[DonationRoutes] Erreur history:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/donation/stats/:streamerAddress
 * Statistiques de donations pour un streamer
 */
router.get('/stats/:streamerAddress', async (req, res) => {
  try {
    const { streamerAddress } = req.params;
    
    if (!streamerAddress) {
      return res.status(400).json({
        success: false,
        error: 'streamerAddress manquant',
      });
    }
    
    const result = await donationService.getDonationStats(streamerAddress);
    
    res.json(result);
  } catch (error: any) {
    console.error('[DonationRoutes] Erreur stats:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
