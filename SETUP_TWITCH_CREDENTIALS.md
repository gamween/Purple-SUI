# 🔐 Configuration des Credentials Twitch OAuth

## ⚠️ ACTION IMMÉDIATE REQUISE

Le système d'authentification Twitch est **100% implémenté** mais nécessite tes **vraies credentials Twitch** pour fonctionner.

---

## 📝 Étapes à Suivre (5 minutes)

### 1️⃣ Créer l'Application Twitch

1. **Ouvre** : https://dev.twitch.tv/console/apps
2. **Connecte-toi** avec ton compte Twitch
3. **Clique** sur **"Register Your Application"**

### 2️⃣ Remplir le Formulaire

| Champ | Valeur |
|-------|--------|
| **Name** | `StreamSUI` ou `StreamSUI-Dev` |
| **OAuth Redirect URLs** | `http://localhost:3000/auth/twitch/callback` |
| **Category** | `Website Integration` |

⚠️ **IMPORTANT** : L'URL de redirection doit être **EXACTEMENT** :
```
http://localhost:3000/auth/twitch/callback
```
(pas de slash à la fin, respecter la casse)

4. **Clique** sur **"Create"**

### 3️⃣ Récupérer les Credentials

1. **Clique** sur **"Manage"** sur l'application que tu viens de créer
2. **Copie** le **Client ID** (ressemble à : `abc123def456xyz789`)
3. **Clique** sur **"New Secret"**
4. **Copie immédiatement** le **Client Secret** (tu ne pourras plus le revoir !)

### 4️⃣ Configurer le Projet

**Fichier à éditer** : `apps/web/.env.local`

**Remplace ces lignes** :
```env
# ❌ AVANT (placeholders - ne fonctionne pas)
NEXT_PUBLIC_TWITCH_CLIENT_ID=your-twitch-client-id-here
TWITCH_CLIENT_SECRET=your-twitch-client-secret-here
```

**Par tes vraies valeurs** :
```env
# ✅ APRÈS (exemple - remplace par TES valeurs)
NEXT_PUBLIC_TWITCH_CLIENT_ID=abc123def456xyz789
TWITCH_CLIENT_SECRET=secret123uvw456xyz789
```

### 5️⃣ Redémarrer le Serveur

```bash
# Dans le terminal où tourne le serveur
# Appuie sur Ctrl+C pour arrêter

# Puis relance
pnpm dev
```

---

## 🧪 Tester que Ça Marche

### Test Rapide (2 minutes)

1. **Ouvre** : http://localhost:3000
2. **Connecte** ton wallet (WalletButton en haut à droite)
3. **Clique** sur "Connexion Twitch" (bouton violet)
4. **Tu devrais voir** : Page d'autorisation Twitch
5. **Clique** sur "Authorize"
6. **Tu devrais être redirigé** : Vers le callback avec ton username

Si ça fonctionne, tu verras :
- ✅ Loader élégant "Connexion en cours"
- ✅ Ton username Twitch dans le header
- ✅ Avatar Twitch (si disponible)

---

## 🚨 Si Ça Ne Marche Pas

### Erreur : "Configuration OAuth manquante"

**Cause** : Les variables d'environnement ne sont pas chargées

**Solutions** :
1. Vérifier que `.env.local` est bien dans `apps/web/` (pas à la racine)
2. Vérifier qu'il n'y a pas de typo dans les noms des variables
3. Redémarrer le serveur (important !)

### Erreur : "Invalid redirect URI"

**Cause** : L'URL de callback ne correspond pas

**Solutions** :
1. Dans Twitch Console : **EXACTEMENT** `http://localhost:3000/auth/twitch/callback`
2. Dans `.env.local` : **EXACTEMENT** `http://localhost:3000/auth/twitch/callback`
3. Pas d'espace, pas de slash à la fin, respecter http:// (pas https:// en local)

### Erreur : "Invalid client"

**Cause** : Client ID ou Secret incorrect

**Solutions** :
1. Copier-coller à nouveau depuis Twitch Console
2. Vérifier qu'il n'y a pas d'espace avant/après
3. Si le secret est perdu, en générer un nouveau sur Twitch

### Le bouton ne fait rien quand je clique

**Cause** : Variables d'environnement non définies

**Solutions** :
1. Ouvrir DevTools (F12) → Console
2. Chercher le message d'erreur
3. Vérifier que `.env.local` contient les bonnes valeurs
4. Redémarrer le serveur

---

## 📋 Checklist de Configuration

Avant de tester, assure-toi que :

- [ ] Tu as un compte Twitch (gratuit)
- [ ] Application Twitch créée sur https://dev.twitch.tv/console/apps
- [ ] Client ID copié dans `apps/web/.env.local`
- [ ] Client Secret copié dans `apps/web/.env.local`
- [ ] Redirect URI = `http://localhost:3000/auth/twitch/callback` (dans Twitch Console)
- [ ] Redirect URI = `http://localhost:3000/auth/twitch/callback` (dans `.env.local`)
- [ ] Serveur redémarré après modification de `.env.local`
- [ ] Aucune erreur dans la console au démarrage

---

## 🎯 Objectif Final

Une fois configuré, tu auras :

1. **3 rôles distincts** :
   - 💻 **Dev** : Peut utiliser l'app sans Twitch
   - 🎮 **Streamer** : DOIT connecter Twitch pour accepter bounties
   - 👁️ **Viewer** : DOIT connecter Twitch pour recevoir NFTs

2. **Flow complet** :
   - Connexion wallet Sui (zkLogin ou Slush)
   - Choix du rôle
   - Connexion Twitch (si requis)
   - Accès au dashboard

3. **Persistence** :
   - Wallet reste connecté après refresh
   - Twitch reste connecté après refresh
   - Rôle sauvegardé

---

## 💡 Besoin d'Aide ?

### Liens Utiles
- [Twitch Developer Console](https://dev.twitch.tv/console/apps)
- [Documentation Twitch OAuth](https://dev.twitch.tv/docs/authentication)
- [Guide complet d'implémentation](./TWITCH_OAUTH_IMPLEMENTATION.md)

### Logs de Débogage

Le système log toutes les étapes dans la console :
```
[UserContext] Connexion Twitch: { username: "...", userId: "..." }
[TwitchButton] Redirection vers Twitch OAuth: https://...
[TwitchCallback] Échange du code...
[TwitchCallback] Données Twitch: { username: "...", ... }
```

Ouvre DevTools (F12) → Console pour voir ces logs.

---

## ⏱️ Temps Estimé

- **Configuration Twitch** : 3-5 minutes
- **Éditer .env.local** : 1 minute
- **Premier test** : 1 minute
- **Total** : ~5-7 minutes

---

## ✅ Une Fois Configuré

Tu peux supprimer ce fichier, tout sera opérationnel ! 🎉

Le système est **production-ready** (architecture-wise), mais nécessitera un backend API pour sécuriser le `client_secret` en production.

Pour le développement et les tests, le système actuel est parfaitement fonctionnel.

---

*Besoin d'aide ? Vérifie les logs dans la console ou consulte TWITCH_OAUTH_IMPLEMENTATION.md*
