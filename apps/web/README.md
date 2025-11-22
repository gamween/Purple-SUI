# StreamSUI - Web Application

Application web pour StreamSUI, plateforme de bounties gaming avec authentification Twitch OAuth et wallet Sui.

## 🚀 Démarrage Rapide

### Installation des Dépendances

```bash
# Depuis la racine du monorepo
pnpm install
```

### Développement Standard (HTTP)

```bash
# Depuis apps/web/
pnpm dev
```

L'application sera accessible sur **http://localhost:3000**

⚠️ **Note** : L'authentification Twitch OAuth ne fonctionnera **pas** en HTTP. Utilise HTTPS (voir ci-dessous).

---

## 🔐 Configuration HTTPS Local (Requis pour Twitch OAuth)

Twitch nécessite **HTTPS obligatoirement** depuis 2024, même en développement local.

### Étape 1 : Configuration Automatique des Certificats SSL

```bash
# Depuis apps/web/
pnpm setup-https
```

Ce script va :
- ✅ Installer `mkcert` (si nécessaire)
- ✅ Installer le certificat root CA sur ton système
- ✅ Générer les certificats SSL pour `localhost`
- ✅ Créer le dossier `certificates/` avec les fichiers `.pem`

### Étape 2 : Lancer le Serveur HTTPS

```bash
# Depuis apps/web/
pnpm dev:https
```

L'application sera accessible sur **https://localhost:3000**

### Étape 3 : Configurer Twitch Developer Console

1. Va sur https://dev.twitch.tv/console/apps
2. Sélectionne ton application (ou crée-en une nouvelle)
3. Dans **OAuth Redirect URLs**, ajoute :
   ```
   https://localhost:3000/auth/twitch/callback
   ```
4. Sauvegarde

### Étape 4 : Configurer .env.local

Mets à jour `apps/web/.env.local` avec tes credentials Twitch :

```env
# Client ID depuis Twitch Console
NEXT_PUBLIC_TWITCH_CLIENT_ID=ton_client_id_ici

# Client Secret (garde-le secret !)
TWITCH_CLIENT_SECRET=ton_secret_ici

# Redirect URI (HTTPS obligatoire)
NEXT_PUBLIC_TWITCH_REDIRECT_URI=https://localhost:3000/auth/twitch/callback

# URL de base
NEXT_PUBLIC_BASE_URL=https://localhost:3000
```

💡 **Astuce** : Un fichier `.env.local.example` est disponible comme template.

---

## 🛠️ Commandes Disponibles

| Commande | Description |
|----------|-------------|
| `pnpm dev` | Serveur de développement HTTP (port 3000) |
| `pnpm dev:https` | Serveur de développement HTTPS (port 3000) |
| `pnpm setup-https` | Configure les certificats SSL avec mkcert |
| `pnpm build` | Build de production |
| `pnpm preview` | Preview du build |
| `pnpm lint` | Vérification ESLint |
| `pnpm lint:fix` | Correction automatique ESLint |

---

## 🔧 Troubleshooting HTTPS

### "mkcert: command not found"

**Solution** : Installe mkcert manuellement selon ton OS :

**macOS** :
```bash
brew install mkcert
brew install nss # Pour Firefox
```

**Linux (Ubuntu/Debian)** :
```bash
sudo apt install mkcert libnss3-tools
```

**Windows** :
```bash
choco install mkcert
```

Puis relance `pnpm setup-https`

### "Certificat non sécurisé" dans le navigateur

**Solution** : Le certificat est auto-signé mais sûr. Clique sur :
1. "Avancé" ou "Advanced"
2. "Continuer vers localhost (non sécurisé)" ou "Proceed to localhost"

Ou réinstalle le CA root :
```bash
mkcert -install
```

### Twitch OAuth redirige vers HTTP au lieu de HTTPS

**Solution** : Vérifie que :
1. `.env.local` contient `https://` (pas `http://`)
2. Twitch Console contient exactement la même URL HTTPS
3. Le serveur est lancé avec `pnpm dev:https` (pas `pnpm dev`)

### Erreur "UNABLE_TO_VERIFY_LEAF_SIGNATURE"

**Solution** : Variable d'environnement Node.js manquante.

**Temporaire** (pour la session) :
```bash
export NODE_EXTRA_CA_CERTS="$(mkcert -CAROOT)/rootCA.pem"
pnpm dev:https
```

**Permanent** (ajouter à `.zshrc` ou `.bashrc`) :
```bash
echo 'export NODE_EXTRA_CA_CERTS="$(mkcert -CAROOT)/rootCA.pem"' >> ~/.zshrc
source ~/.zshrc
```

### Les certificats ont expiré

**Solution** : Régénère-les :
```bash
cd apps/web
rm -rf certificates/
pnpm setup-https
```

---

## 📁 Structure du Projet

```
apps/web/
├── certificates/          # Certificats SSL (ignoré par git)
│   ├── localhost.pem      # Certificat SSL
│   └── localhost-key.pem  # Clé privée SSL
├── src/
│   ├── components/        # Composants React
│   │   ├── auth/         # Authentification (ProtectedRoute, etc.)
│   │   ├── dashboard/    # Composants dashboard
│   │   ├── twitch/       # TwitchButton
│   │   └── wallet/       # WalletButton
│   ├── context/          # React Context (UserContext)
│   ├── pages/            # Pages de l'application
│   │   ├── auth/         # Pages d'authentification
│   │   ├── dev/          # Dashboard développeur
│   │   ├── streamer/     # Dashboard streamer
│   │   └── viewer/       # Dashboard viewer
│   └── App.tsx           # Composant racine
├── .env.local            # Variables d'environnement (non versionné)
├── .env.local.example    # Template pour .env.local
├── setup-https.sh        # Script configuration HTTPS
├── vite.config.ts        # Configuration Vite
└── package.json
```

---

## 🎯 Flow d'Authentification

```
1. Landing Page
   ↓ Connecter Wallet (zkLogin/Slush)
2. Role Selection
   ↓ Choisir rôle (Dev/Streamer/Viewer)
3. Dashboard avec ProtectedRoute
   ↓ Vérification Twitch (si requis)
4. Connexion Twitch OAuth (HTTPS)
   ↓ Autorisation sur Twitch
5. Callback → Dashboard débloqué
```

**Règles métier** :
- 💻 **Dev** : Twitch optionnel
- 🎮 **Streamer** : Twitch **obligatoire**
- 👁️ **Viewer** : Twitch **obligatoire**

---

## 🌐 Variables d'Environnement

Voir `.env.local.example` pour la liste complète des variables disponibles.

**Variables critiques** :
- `NEXT_PUBLIC_TWITCH_CLIENT_ID` - Client ID Twitch
- `TWITCH_CLIENT_SECRET` - Secret Twitch (ne jamais commiter !)
- `NEXT_PUBLIC_TWITCH_REDIRECT_URI` - URL de callback OAuth
- `NEXT_PUBLIC_BASE_URL` - URL de base de l'app
- `VITE_SUI_NETWORK` - Réseau Sui (devnet/testnet/mainnet)

---

## 🔒 Sécurité

### Certificats SSL
- Générés localement avec `mkcert`
- Valides **uniquement** pour `localhost`
- **Non versionnés** (gitignore)
- Auto-signés mais sécurisés

### Secrets
- Ne **jamais** commiter `.env.local`
- Utiliser `.env.local.example` comme template
- Le `TWITCH_CLIENT_SECRET` doit rester privé

### Production
- Utiliser de **vrais certificats SSL** (Let's Encrypt)
- Créer un **backend API** pour l'échange du code OAuth
- Ne pas exposer le `client_secret` côté client

---

## 📚 Documentation Complète

- **[TWITCH_OAUTH_IMPLEMENTATION.md](./TWITCH_OAUTH_IMPLEMENTATION.md)** - Guide technique complet OAuth
- **[SETUP_TWITCH_CREDENTIALS.md](./SETUP_TWITCH_CREDENTIALS.md)** - Configuration des credentials

---

## 🐛 Support

Pour toute question ou problème :
1. Vérifie la section **Troubleshooting** ci-dessus
2. Consulte les logs dans la console du navigateur (F12)
3. Vérifie que les certificats sont bien générés (`ls -la certificates/`)
4. Relance `pnpm setup-https` en cas de doute

---

## 📝 Licence

Projet privé - StreamSUI © 2025
