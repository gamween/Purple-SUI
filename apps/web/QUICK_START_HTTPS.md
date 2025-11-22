# ⚡ Démarrage Rapide HTTPS - StreamSUI

## 🎯 Configuration en 3 Commandes

```bash
# 1. Configurer HTTPS avec mkcert
cd apps/web
pnpm setup-https

# 2. Mettre à jour .env.local
# Édite le fichier et remplace http:// par https://

# 3. Lancer le serveur HTTPS
pnpm dev:https
```

**Temps total** : 5 minutes ⏱️

---

## 📋 Checklist Rapide

### Avant de Commencer

- [ ] Node.js installé
- [ ] pnpm installé (`npm install -g pnpm`)
- [ ] Compte Twitch (gratuit)

### Configuration HTTPS (Étape 1)

```bash
cd apps/web
pnpm setup-https
```

**Que fait ce script ?**
- ✅ Installe mkcert (si nécessaire)
- ✅ Génère les certificats SSL
- ✅ Crée `certificates/localhost.pem` et `certificates/localhost-key.pem`

**Sortie attendue** :
```
🔐 Configuration HTTPS pour StreamSUI
======================================
✅ mkcert est déjà installé
🔑 Installation du certificat root CA...
✅ CA root installé avec succès
📜 Génération des certificats SSL pour localhost...
✅ Certificats générés avec succès !
🎉 Configuration HTTPS terminée !
```

### Variables d'Environnement (Étape 2)

**Édite `apps/web/.env.local`** :

```env
# Client ID depuis Twitch Console
NEXT_PUBLIC_TWITCH_CLIENT_ID=ton_client_id_ici

# Client Secret (garde-le secret !)
TWITCH_CLIENT_SECRET=ton_secret_ici

# URLs HTTPS (obligatoire)
NEXT_PUBLIC_TWITCH_REDIRECT_URI=https://localhost:3000/auth/twitch/callback
NEXT_PUBLIC_BASE_URL=https://localhost:3000
```

### Twitch Console Configuration

1. **Va sur** : https://dev.twitch.tv/console/apps
2. **Clique** : "Register Your Application" (ou "Manage" si existe)
3. **Configure** :
   - Name: `StreamSUI-Dev`
   - OAuth Redirect URL: `https://localhost:3000/auth/twitch/callback`
   - Category: `Website Integration`
4. **Copie** : Client ID et Client Secret
5. **Sauvegarde**

### Lancer le Serveur (Étape 3)

```bash
pnpm dev:https
```

**Sortie attendue** :
```
VITE v6.3.5  ready in 120 ms

➜  Local:   https://localhost:3000/
➜  Network: use --host to expose
```

**Ouvre dans le navigateur** : https://localhost:3000

⚠️ **Si avertissement de certificat** :
1. Clique sur "Avancé"
2. Clique sur "Continuer vers localhost"

---

## ✅ Test Rapide

1. Ouvre https://localhost:3000
2. Connecte ton wallet (WalletButton)
3. Choisis un rôle (Streamer ou Viewer)
4. Clique sur "Connexion Twitch"
5. Autorise sur Twitch
6. Tu devrais être redirigé avec ton username Twitch affiché

**Si ça marche** : 🎉 Configuration réussie !

**Si ça ne marche pas** : Consulte `HTTPS_LOCAL_GUIDE.md` pour troubleshooting.

---

## 🔄 Commandes Quotidiennes

```bash
# Démarrer en HTTPS (recommandé)
pnpm dev:https

# Démarrer en HTTP (Twitch OAuth ne marchera pas)
pnpm dev

# Build production
pnpm build

# Preview du build
pnpm preview
```

---

## 🐛 Problèmes Fréquents

### "mkcert: command not found"

```bash
# macOS
brew install mkcert

# Linux (Ubuntu)
sudo apt install mkcert

# Puis
pnpm setup-https
```

### "Invalid redirect URI" dans Twitch

**Vérifie que** :
- Twitch Console : `https://localhost:3000/auth/twitch/callback`
- .env.local : `https://localhost:3000/auth/twitch/callback`
- Serveur lancé avec `pnpm dev:https` (pas `pnpm dev`)

### "Port 3000 already in use"

```bash
# Tuer le processus existant
lsof -i :3000
kill -9 <PID>

# Ou relancer
pnpm dev:https
```

### Certificat expiré

```bash
cd apps/web
rm -rf certificates/
pnpm setup-https
```

---

## 📚 Documentation Complète

- **[HTTPS_LOCAL_GUIDE.md](./HTTPS_LOCAL_GUIDE.md)** - Guide complet HTTPS
- **[SETUP_TWITCH_CREDENTIALS.md](../../SETUP_TWITCH_CREDENTIALS.md)** - Configuration Twitch
- **[TWITCH_OAUTH_IMPLEMENTATION.md](../../TWITCH_OAUTH_IMPLEMENTATION.md)** - Architecture OAuth
- **[README.md](./README.md)** - Documentation générale

---

## 💡 Rappels Importants

1. ✅ Toujours utiliser `pnpm dev:https` (pas `pnpm dev`)
2. ✅ Les URLs doivent être **https://** (pas http://)
3. ✅ Twitch Console doit avoir l'URL HTTPS exacte
4. ✅ Ne jamais commiter `.env.local` ou `certificates/`

---

*Besoin d'aide ? Consulte les guides complets ci-dessus.*
