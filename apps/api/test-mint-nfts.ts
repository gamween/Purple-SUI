import axios from 'axios';
import https from 'https';

const API_URL = 'https://localhost:3001';

// Désactiver la vérification SSL pour localhost
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

const recipients = [
  {
    address: '0x4d42b60dcd2b645ec471e01026662a33b76a4ec95cbf3ad7b05953dccbb13e43',
    name: 'Purple SUI Test NFT #1',
    description: 'Premier NFT de test pour Purple SUI',
  },
  {
    address: '0xbdf48a459f22dd7d3a0ab69ddb59d51a982b46c016e02500d25ada6aa8b703f2',
    name: 'Purple SUI Test NFT #2',
    description: 'Deuxième NFT de test pour Purple SUI',
  },
];

async function mintTestNFTs() {
  console.log('🎨 Début du mint des NFTs de test...\n');

  for (let i = 0; i < recipients.length; i++) {
    const recipient = recipients[i];
    
    console.log(`📤 Mint ${i + 1}/2 vers ${recipient.address.slice(0, 10)}...`);

    try {
      const response = await axios.post(`${API_URL}/api/nft/mint`, {
        imageName: 'test.png',
        recipientAddress: recipient.address,
        name: recipient.name,
        description: recipient.description,
      }, {
        httpsAgent,
      });

      if (response.data.success) {
        console.log('✅ NFT minté avec succès !');
        console.log(`   Digest: ${response.data.digest}`);
        console.log(`   Image IPFS: ${response.data.imageUrl}`);
        console.log(`   🔗 Voir sur SuiScan: https://suiscan.xyz/testnet/tx/${response.data.digest}`);
        console.log(`   🔗 Voir l'adresse: https://suiscan.xyz/testnet/account/${recipient.address}\n`);
      } else {
        console.log('❌ Erreur lors du mint');
        console.log(`   ${response.data.error}\n`);
      }
    } catch (error: any) {
      console.error('❌ Erreur API:', error.response?.data || error.message);
      if (error.response) {
        console.error('   Status:', error.response.status);
        console.error('   Data:', JSON.stringify(error.response.data, null, 2));
      } else if (error.request) {
        console.error('   Aucune réponse du serveur');
      } else {
        console.error('   Erreur:', error.message);
      }
    }

    // Pause de 2 secondes entre chaque mint
    if (i < recipients.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log('\n✨ Test terminé ! Vérifiez les NFTs dans vos wallets.\n');
  console.log('📖 Instructions pour voir les NFTs :');
  console.log('   1. Ouvrez votre wallet Sui (Slush, Suiet, etc.)');
  console.log('   2. Allez dans l\'onglet "Collectibles" ou "NFTs"');
  console.log('   3. Les NFTs devraient apparaître sous "Purple SUI Test NFT"');
  console.log('   4. Ou vérifiez sur SuiScan avec les liens ci-dessus\n');
}

mintTestNFTs().catch(console.error);
