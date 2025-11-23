import fs from 'fs';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Obtenir __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger les variables d'environnement
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;

/**
 * Upload une image locale vers IPFS via Pinata
 * @param fileName - Nom du fichier dans le dossier nft-designs/
 * @returns URL IPFS complète (gateway Pinata)
 */
export async function uploadImageToIPFS(fileName: string): Promise<string> {
  console.log(`[IPFS] 📤 Uploading ${fileName} to IPFS...`);

  // Vérifier les credentials Pinata
  if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
    throw new Error('PINATA_API_KEY or PINATA_SECRET_KEY not configured in .env');
  }

  // Chemin vers le dossier nft-designs
  const imagePath = path.join(__dirname, '../../nft-designs', fileName);
  
  // Vérifier que le fichier existe
  if (!fs.existsSync(imagePath)) {
    throw new Error(`Image ${fileName} not found in nft-designs/ directory`);
  }

  try {
    // Préparer le FormData
    const formData = new FormData();
    formData.append('file', fs.createReadStream(imagePath));

    // Métadonnées optionnelles
    const metadata = JSON.stringify({
      name: fileName,
      keyvalues: {
        project: 'Purple SUI',
        type: 'nft-image',
      },
    });
    formData.append('pinataMetadata', metadata);

    // Upload vers Pinata
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        maxBodyLength: Infinity,
        headers: {
          ...formData.getHeaders(),
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_KEY,
        },
      }
    );

    const ipfsHash = response.data.IpfsHash;
    const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    
    console.log(`[IPFS] ✅ Image uploaded successfully`);
    console.log(`[IPFS] 🔗 IPFS Hash: ${ipfsHash}`);
    console.log(`[IPFS] 🌐 Gateway URL: ${ipfsUrl}`);

    return ipfsUrl;
  } catch (error: any) {
    console.error('[IPFS] ❌ Upload failed:', error.response?.data || error.message);
    console.error('[IPFS] Full error:', JSON.stringify(error.response?.data, null, 2));
    const errorMessage = error.response?.data?.error 
      || error.response?.data?.message 
      || error.message 
      || 'Unknown IPFS upload error';
    throw new Error(`IPFS upload failed: ${errorMessage}`);
  }
}

/**
 * Vérifie qu'une image existe dans le dossier nft-designs
 * @param fileName - Nom du fichier
 * @returns true si existe, false sinon
 */
export function checkImageExists(fileName: string): boolean {
  const imagePath = path.join(__dirname, '../../nft-designs', fileName);
  return fs.existsSync(imagePath);
}

/**
 * Liste toutes les images disponibles dans nft-designs/
 * @returns Array de noms de fichiers
 */
export function listAvailableImages(): string[] {
  const designsPath = path.join(__dirname, '../../nft-designs');
  
  if (!fs.existsSync(designsPath)) {
    return [];
  }

  return fs.readdirSync(designsPath).filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return ['.png', '.jpg', '.jpeg', '.gif'].includes(ext);
  });
}
