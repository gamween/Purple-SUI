# 🔐 Guide Complet HTTPS Local - StreamSUI

## 🎯 Pourquoi HTTPS en Local ?

**Twitch a rendu HTTPS obligatoire** même pour `localhost` depuis 2024. Les URLs `http://localhost` ne sont plus acceptées pour OAuth.

---

## ⚡ Configuration Rapide (3 minutes)

### Étape 1 : Installer mkcert et Générer les Certificats

```bash
cd apps/web
pnpm setup-https
```

Ce script automatique va :
1. ✅ Détecter ton OS (macOS/Linux/Windows)
2. ✅ Installer `mkcert` si nécessaire
3. ✅ Installer le CA root sur ton système
4. ✅ Générer `localhost.pem` et `localhost-key.pem`
5. ✅ Créer le dossier `certificates/`

### Étape 2 : Mettre à Jour .env.local

Édite `apps/web/.env.local` :

```env
# Passer de HTTP à HTTPS
NEXT_PUBLIC_TWITCH_REDIRECT_URI=https://localhost:3000/auth/twitch/callback
NEXT_PUBLIC_BASE_URL=https://localhost:3000
```

### Étape 3 : Mettre à Jour Twitch Console

1. Va sur https://dev.twitch.tv/console/apps
2. Sélectionne ton application
3. Dans **OAuth Redirect URLs**, remplace :
   - ❌ `http://localhost:3000/auth/twitch/callback`
   - ✅ `https://localhost:3000/auth/twitch/callback`
4. Sauvegarde

### Étape 4 : Lancer le Serveur HTTPS

```bash
pnpm dev:https
```

Ouvre https://localhost:3000 dans ton navigateur.

---

## 🔧 Installation Manuelle de mkcert (si le script échoue)

### macOS (avec Homebrew)

```bash
brew install mkcert
brew install nss # Pour Firefox
mkcert -install
```

### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install mkcert libnss3-tools
mkcert -install
```

### Linux (Arch)

```bash
sudo pacman -S mkcert nss
mkcert -install
```

### Windows (avec Chocolatey)

```powershell
choco install mkcert
mkcert -install
```

### Génération Manuelle des Certificats

Si le script a échoué :

```bash
cd apps/web
mkdir -p certificates
cd certificates
mkcert -key-file localhost-key.pem -cert-file localhost.pem localhost 127.0.0.1 ::1
cd ..
```

Puis relance `pnpm dev:https`

---

## 🛠️ Comment Ça Marche ?

### Architecture

```
┌─────────────────────────────────────────────┐
│  1. mkcert génère un CA root               │
│     Installé dans le système               │
│     (Keychain sur macOS, etc.)             │
└──────────────────┬──────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────┐
│  2. mkcert génère certificats localhost    │
│     - localhost.pem (certificat)           │
│     - localhost-key.pem (clé privée)       │
└──────────────────┬──────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────┐
│  3. Vite charge les certificats            │
│     vite.config.ts → https: {...}          │
└──────────────────┬──────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────┐
│  4. Navigateur fait confiance au CA        │
│     ✅ Pas d'avertissement de sécurité     │
│     ✅ Twitch OAuth accepte l'URL          │
└─────────────────────────────────────────────┘
```

### Fichiers de Configuration

**vite.config.ts** (déjà configuré) :
```typescript
import fs from 'fs';
import path from 'path';

const httpsConfig = () => {
  const keyPath = path.resolve(__dirname, 'certificates/localhost-key.pem');
  const certPath = path.resolve(__dirname, 'certificates/localhost.pem');
  
  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    return {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };
  }
  return undefined;
};

export default defineConfig({
  server: {
    https: httpsConfig(),
    // ...
  }
});
```

**package.json** (déjà configuré) :
```json
{
  "scripts": {
    "dev": "vite",
    "dev:https": "vite --https --host",
    "setup-https": "bash setup-https.sh"
  }
}
```

---

## 🐛 Troubleshooting

### Problème : "Certificate verification failed"

**Cause** : Le CA root n'est pas installé

**Solution** :
```bash
mkcert -install
```

Puis redémarre ton navigateur.

### Problème : "ERR_CERT_AUTHORITY_INVALID" dans Chrome

**Cause** : Chrome ne fait pas confiance au CA

**Solution** :
```bash
# Réinstaller le CA
mkcert -uninstall
mkcert -install

# Redémarrer Chrome
```

**Alternative** : Clique sur "Avancé" → "Continuer vers localhost"

### Problème : Firefox ne fait pas confiance au certificat

**Cause** : Firefox utilise son propre trust store

**Solution macOS** :
```bash
brew install nss
mkcert -install
```

**Solution Linux** :
```bash
sudo apt install libnss3-tools
mkcert -install
```

Redémarre Firefox.

### Problème : "UNABLE_TO_VERIFY_LEAF_SIGNATURE" dans Node.js

**Cause** : Node.js ne fait pas confiance au CA

**Solution Temporaire** :
```bash
export NODE_EXTRA_CA_CERTS="$(mkcert -CAROOT)/rootCA.pem"
pnpm dev:https
```

**Solution Permanente** (ajouter à `.zshrc` ou `.bashrc`) :
```bash
echo 'export NODE_EXTRA_CA_CERTS="$(mkcert -CAROOT)/rootCA.pem"' >> ~/.zshrc
source ~/.zshrc
```

### Problème : "Port 3000 already in use"

**Cause** : Un autre serveur tourne déjà

**Solution** :
```bash
# Trouver le processus
lsof -i :3000

# Tuer le processus
kill -9 <PID>

# Ou changer le port dans vite.config.ts
server: {
  port: 3001,
  https: httpsConfig(),
}
```

### Problème : Les certificats ont expiré

**Cause** : mkcert génère des certificats valides 10 ans, mais peut-être régénérés

**Solution** :
```bash
cd apps/web
rm -rf certificates/
pnpm setup-https
```

### Problème : "setup-https.sh: Permission denied"

**Cause** : Le script n'est pas exécutable

**Solution** :
```bash
chmod +x setup-https.sh
pnpm setup-https
```

---

## 🔒 Sécurité

### Certificats Locaux

- ✅ **Sûrs** : Générés et signés par ton propre CA
- ✅ **Privés** : Ne quittent jamais ta machine
- ✅ **Locaux** : Valides uniquement pour `localhost`
- ✅ **Non versionnés** : `.gitignore` protège les certificats

### Différences avec la Production

| Aspect | Local (mkcert) | Production |
|--------|----------------|------------|
| **Autorité** | CA auto-signé local | Let's Encrypt, DigiCert, etc. |
| **Validité** | 10 ans | 90 jours (Let's Encrypt) |
| **Domaines** | localhost uniquement | Domaine public |
| **Coût** | Gratuit | Gratuit (Let's Encrypt) |
| **Setup** | 5 minutes | 30 minutes |

### Bonnes Pratiques

1. ✅ Ne **jamais** commiter les certificats (`.gitignore`)
2. ✅ Ne **jamais** utiliser les certificats locaux en production
3. ✅ Régénérer les certificats si compromis
4. ✅ Utiliser des variables d'environnement pour les URLs

---

## 🌐 Configuration Multi-Environnements

### .env.local (Développement HTTPS)

```env
NEXT_PUBLIC_BASE_URL=https://localhost:3000
NEXT_PUBLIC_TWITCH_REDIRECT_URI=https://localhost:3000/auth/twitch/callback
```

### .env.production (Production)

```env
NEXT_PUBLIC_BASE_URL=https://streamsui.com
NEXT_PUBLIC_TWITCH_REDIRECT_URI=https://streamsui.com/auth/twitch/callback
```

### Twitch Console (Multi-URLs)

Tu peux ajouter **plusieurs** redirect URIs :
```
https://localhost:3000/auth/twitch/callback     # Dev local
https://staging.streamsui.com/auth/twitch/callback  # Staging
https://streamsui.com/auth/twitch/callback     # Production
```

---

## 📊 Checklist de Validation

### Configuration Initiale

- [ ] `mkcert` installé (`mkcert -version`)
- [ ] CA root installé (`mkcert -install`)
- [ ] Certificats générés dans `apps/web/certificates/`
- [ ] `localhost.pem` existe
- [ ] `localhost-key.pem` existe

### Variables d'Environnement

- [ ] `.env.local` contient `https://` (pas `http://`)
- [ ] `NEXT_PUBLIC_TWITCH_REDIRECT_URI` est correct
- [ ] `NEXT_PUBLIC_BASE_URL` est correct
- [ ] Client ID et Secret Twitch configurés

### Twitch Console

- [ ] Application Twitch créée
- [ ] Redirect URI = `https://localhost:3000/auth/twitch/callback`
- [ ] URL **exactement identique** à `.env.local`
- [ ] Application sauvegardée

### Test de Fonctionnement

- [ ] `pnpm dev:https` démarre sans erreur
- [ ] https://localhost:3000 s'ouvre dans le navigateur
- [ ] Pas d'avertissement de certificat (ou accepté)
- [ ] Connexion Twitch OAuth fonctionne
- [ ] Callback redirige correctement

---

## 🚀 Commandes Utiles

```bash
# Configuration complète
pnpm setup-https

# Lancer HTTPS
pnpm dev:https

# Vérifier mkcert
mkcert -version

# Localiser le CA root
mkcert -CAROOT

# Lister les certificats installés (macOS)
security find-certificate -a | grep mkcert

# Régénérer les certificats
cd apps/web
rm -rf certificates/
pnpm setup-https

# Désinstaller le CA (nettoyage complet)
mkcert -uninstall
```

---

## 📚 Ressources

- [mkcert GitHub](https://github.com/FiloSottile/mkcert)
- [Vite HTTPS Configuration](https://vitejs.dev/config/server-options.html#server-https)
- [Twitch OAuth Documentation](https://dev.twitch.tv/docs/authentication)

---

## ✅ Résumé

1. **Exécute** : `pnpm setup-https`
2. **Édite** : `.env.local` avec HTTPS URLs
3. **Configure** : Twitch Console avec HTTPS callback
4. **Lance** : `pnpm dev:https`
5. **Teste** : https://localhost:3000

**Temps total** : ~5 minutes

---

*Configuration HTTPS générée automatiquement pour StreamSUI*
