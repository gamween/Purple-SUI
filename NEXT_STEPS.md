# 📋 NFT Minting System - Actions Requises

## ✅ Ce qui a été fait

- [x] Créer le dossier `apps/api/nft-designs/` pour les images
- [x] Installer les dépendances : `axios` et `form-data`
- [x] Créer `ipfs-uploader.ts` (upload vers Pinata IPFS)
- [x] Créer `nft-mint.service.ts` (logique de mint on-chain)
- [x] Créer `nft.routes.ts` (API REST endpoints)
- [x] Intégrer les routes NFT dans `index.ts`
- [x] Créer le smart contract `nft.move`
- [x] Créer le hook React `useMintNft`
- [x] Créer le composant `MintNftForm` (exemple d'utilisation)
- [x] Créer le script de test `test-nft-api.sh`
- [x] Ajouter les variables d'environnement Pinata au `.env`
- [x] Créer la documentation complète (`NFT_SYSTEM.md`)

## 🚀 Actions à effectuer maintenant

### 1. Obtenir les clés Pinata (URGENT)

1. Aller sur [https://pinata.cloud](https://pinata.cloud)
2. Créer un compte (gratuit)
3. Aller dans **API Keys** → **New Key**
4. Cocher la permission : `pinFileToIPFS`
5. Générer la clé et copier :
   - `API Key`
   - `API Secret`

### 2. Configurer le `.env`

Ouvrir `apps/api/.env` et remplacer :
```env
PINATA_API_KEY=your-pinata-api-key-here          # <- Remplacer
PINATA_SECRET_KEY=your-pinata-secret-key-here    # <- Remplacer
```

Par vos vraies clés Pinata.

### 3. Ajouter des images NFT

Copier vos designs dans le dossier `apps/api/nft-designs/` :

```bash
# Exemples de commandes
cp ~/Desktop/nft-design1.png apps/api/nft-designs/design1.png
cp ~/Desktop/bounty-reward.png apps/api/nft-designs/bounty_reward.png
```

**Formats acceptés :** PNG, JPG, JPEG  
**Taille recommandée :** 512x512px ou 1024x1024px

### 4. Déployer le smart contract NFT

Le fichier `contracts/sources/nft.move` a été créé. Il faut le déployer :

```bash
cd contracts
sui client publish --gas-budget 100000000
```

**IMPORTANT :** Après le déploiement, copier le **PackageID** affiché et vérifier qu'il correspond bien à celui dans `.env` :

```env
PACKAGE_ID=0xaf077749829c9d993ae424e81acaf8650af3f403ed0dbf9a8ba2742489bc30c0
```

Si le PackageID est différent, mettre à jour le `.env`.

### 5. Tester l'API

```bash
cd apps/api
pnpm dev
```

Dans un autre terminal :

```bash
cd apps/api
./test-nft-api.sh
```

**Étapes du test :**
1. Health check du serveur
2. Liste des designs disponibles
3. Mint d'un NFT de test

### 6. Vérifier le résultat

Après un mint réussi :
- Copier le `digest` de la transaction
- Aller sur : `https://suiscan.xyz/testnet/tx/{digest}`
- Vérifier que le NFT apparaît
- Cliquer sur l'image IPFS pour vérifier qu'elle s'affiche

## 📝 Checklist complète

### Configuration
- [ ] Créer un compte Pinata
- [ ] Obtenir API Key et Secret
- [ ] Ajouter les clés dans `apps/api/.env`
- [ ] Ajouter au moins 1 image dans `nft-designs/`

### Smart Contract
- [ ] Déployer `contracts/sources/nft.move` sur testnet
- [ ] Vérifier le PackageID dans `.env`
- [ ] Confirmer que le wallet backend a du SUI (gas)

### Tests Backend
- [ ] Démarrer le serveur : `cd apps/api && pnpm dev`
- [ ] Tester : `./test-nft-api.sh`
- [ ] Vérifier le résultat sur SuiScan
- [ ] Vérifier l'image sur IPFS

### Tests Frontend (Optionnel)
- [ ] Démarrer le frontend : `cd apps/web && pnpm dev`
- [ ] Créer une page test pour `MintNftForm`
- [ ] Tester le mint depuis l'interface

## 🔧 Troubleshooting

### Erreur : "PINATA_API_KEY not configured"
**Solution :** Vérifier que les clés sont bien dans `.env` et redémarrer le serveur.

### Erreur : "Image not found in nft-designs/"
**Solution :** 
```bash
ls apps/api/nft-designs/
```
Vérifier que l'image existe. Le nom doit correspondre exactement (sensible à la casse).

### Erreur : "Transaction failed" ou "Insufficient gas"
**Solution :** Vérifier le solde du wallet backend :
```bash
sui client gas
```
Si besoin, obtenir du SUI testnet sur : https://discord.gg/sui

### Erreur : "Module not found" lors du mint
**Solution :** Le smart contract `nft.move` n'est pas déployé ou le PackageID est incorrect.
1. Redéployer : `cd contracts && sui client publish --gas-budget 100000000`
2. Mettre à jour le PackageID dans `.env`

## 🎯 Intégration avec les Bounties

Une fois le système fonctionnel, vous pourrez l'intégrer dans le workflow des bounties :

**Exemple d'utilisation :**
```typescript
// Quand une bounty est complétée
await completeBounty(bountyId);

// Envoyer automatiquement un NFT au dev
await mintNftToWallet({
  imageName: 'bounty_reward.png',
  recipientAddress: devWalletAddress,
  name: `Bounty #${bountyId} Completed`,
  description: `Congratulations! You completed bounty #${bountyId}`,
});
```

## 📚 Documentation

La documentation complète se trouve dans :
- `apps/api/NFT_SYSTEM.md` - Guide complet du système
- `apps/api/nft-designs/README.md` - Instructions pour les images

## ❓ Questions ?

Si vous rencontrez des problèmes :
1. Vérifier les logs du serveur backend
2. Vérifier que toutes les variables d'environnement sont configurées
3. Tester avec `curl` avant d'intégrer au frontend
4. Vérifier les transactions sur SuiScan

---

**Prochaine étape immédiate : Obtenir les clés Pinata et les ajouter au `.env` !** 🚀
