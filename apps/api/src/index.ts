import express, { Express, Request, Response, NextFunction } from 'express';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import twitchRouter from './routes/twitch.routes';
import bountyRouter from './routes/bounty.routes';
import nftRouter from './routes/nft.routes';
import { verifySuiConfig } from './web3/sui-client';

// Obtenir __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger les variables d'environnement depuis la racine du projet API
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app: Express = express();
const PORT = process.env.PORT || 3001;

// ========================================
// MIDDLEWARE CONFIGURATION
// ========================================

// CORS: Autoriser les requêtes du frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Parser JSON
app.use(express.json());

// Parser URL-encoded bodies (pour les formulaires)
app.use(express.urlencoded({ extended: true }));

// Logging middleware (développement)
if (process.env.NODE_ENV !== 'production') {
  app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
}

// ========================================
// ROUTES
// ========================================

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Twitch OAuth routes
app.use('/api/twitch', twitchRouter);

// Bounty blockchain routes
app.use('/api/bounty', bountyRouter);

// NFT minting routes
app.use('/api/nft', nftRouter);

// Route 404
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.url} not found`,
    timestamp: new Date().toISOString(),
  });
});

// Error handler global
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Server Error]', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' 
      ? 'An error occurred' 
      : err.message,
    timestamp: new Date().toISOString(),
  });
});

// ========================================
// SUI BLOCKCHAIN INITIALIZATION
// ========================================

// Vérifier la configuration Sui au démarrage
verifySuiConfig()
  .then(() => {
    console.log('[Sui] ✅ Configuration blockchain validée');
  })
  .catch((error) => {
    console.error('[Sui] ⚠️  Erreur configuration blockchain:', error.message);
    console.warn('[Sui] ⚠️  Les routes blockchain seront disponibles mais pourraient échouer');
  });

// ========================================
// SERVER START
// ========================================

// Pour Vercel, on n'exporte que l'app sans le .listen()
if (process.env.NODE_ENV !== 'production') {
  // Charger les certificats HTTPS (mkcert) - lien symbolique vers apps/web/certificates
  const certPath = path.resolve(__dirname, '../certificates');
  
  try {
    const httpsOptions = {
      key: fs.readFileSync(path.join(certPath, 'localhost-key.pem')),
      cert: fs.readFileSync(path.join(certPath, 'localhost.pem')),
    };

    https.createServer(httpsOptions, app).listen(PORT, () => {
      console.log('========================================');
      console.log('🚀 StreamSUI API Server (HTTPS)');
      console.log('========================================');
      console.log(`📡 Server running on: https://localhost:${PORT}`);
      console.log(`🌍 Frontend URL: ${process.env.FRONTEND_URL}`);
      console.log(`🎮 Twitch OAuth: /api/twitch/callback`);
      console.log(`⛓️  Bounty API: /api/bounty`);
      console.log(`🎨 NFT Mint API: /api/nft/mint`);
      console.log(`⚙️  Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('========================================');
    });
  } catch (error) {
    console.error('❌ Erreur lors du chargement des certificats HTTPS:');
    console.error('   Assurez-vous que mkcert est installé et que les certificats sont générés.');
    console.error('   Chemin attendu:', certPath);
    process.exit(1);
  }
}

// Export pour Vercel Serverless
export default app;
