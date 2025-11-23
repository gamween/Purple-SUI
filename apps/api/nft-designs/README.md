# NFT Designs

Ce dossier contient les images des NFTs qui seront mintés sur la blockchain Sui.

## Formats acceptés
- PNG (recommandé)
- JPG/JPEG
- Taille recommandée : 512x512px ou 1024x1024px

## Designs disponibles

Ajoute tes images ici avec des noms explicites :

- `purple-sui-winner.png` - NFT pour les viewers engagés
- `top-supporter.png` - NFT pour les top donateurs
- `stream-legend.png` - NFT pour participations multiples
- `test.png` - NFT pour les tests
- etc.

## Utilisation

Les images sont uploadées automatiquement vers IPFS (Pinata) lors du mint.
Le nom du fichier est utilisé dans l'API : `/api/nft/mint`

Exemple :
```json
{
  "imageName": "purple-sui-winner.png",
  "recipientAddress": "0x...",
  "name": "Purple SUI Winner",
  "description": "Top viewer reward"
}
```
