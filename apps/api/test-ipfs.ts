import { uploadImageToIPFS } from './src/utils/ipfs-uploader.js';

console.log('🧪 Test upload IPFS...\n');

uploadImageToIPFS('test.png')
  .then((url) => {
    console.log('\n✅ Upload réussi !');
    console.log('URL:', url);
  })
  .catch((error) => {
    console.error('\n❌ Upload échoué !');
    console.error('Error:', error);
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
  });
