# 🎯 Système de Connexion Wallet StreamSUI

## ✅ Refonte Complète Terminée

Ce document décrit le nouveau système de connexion wallet unifié pour StreamSUI.

---

## 📦 Architecture

### Structure des Fichiers

```
apps/web/src/
├── providers/
│   └── SuiProvider.tsx          # Provider Sui + React Query
├── context/
│   └── UserContext.tsx          # État global utilisateur (localStorage)
├── hooks/
│   ├── useZkLogin.ts            # Hook connexion sociale (OAuth)
│   └── useSlushWallet.ts        # Hook wallet Sui natif
└── components/wallet/
    ├── WalletButton.tsx         # Bouton global de connexion
    └── ConnectModal.tsx         # Modal popup avec options
```

### Stack Technique

- **@mysten/dapp-kit 0.18.0** - SDK Sui wallet
- **@mysten/sui 1.38.0** - Client Sui blockchain
- **@mysten/zklogin 0.8.1** - zkLogin (deprecated, migration prévue)
- **@tanstack/react-query 5.87.1** - État serveur
- **React Context API** - État global + localStorage

---

## 🚀 Utilisation

### 1. Dans N'importe Quel Composant

```tsx
import { useUser } from '@/context/UserContext';

export function MyComponent() {
  const { isConnected, suiAddress, loginMethod, disconnect } = useUser();

  if (!isConnected) {
    return <div>Veuillez vous connecter</div>;
  }

  return (
    <div>
      <p>Connecté: {suiAddress}</p>
      <p>Via: {loginMethod === 'zklogin' ? 'Social Login' : 'Wallet Sui'}</p>
      <button onClick={disconnect}>Déconnexion</button>
    </div>
  );
}
```

### 2. Ajouter le Bouton dans une Page

```tsx
import { WalletButton } from '@/components/wallet/WalletButton';

export function MyPage() {
  return (
    <div>
      <nav>
        <WalletButton />
      </nav>
    </div>
  );
}
```

---

## 🔑 Fonctionnalités

### ✅ Connexion Sociale (zkLogin)

- **Google** - OAuth 2.0
- **Facebook** - OAuth 2.0  
- **Twitch** - OAuth 2.0

**Avantages:**
- Pas d'extension nécessaire
- Wallet Sui créé automatiquement
- Expérience utilisateur simplifiée

### ✅ Wallet Sui Natif

- **Sui Wallet** (officiel)
- **Slush** (wallet communautaire)
- **Ethos** (multi-chain)

**Avantages:**
- Contrôle total des clés
- Compatible autres dApps
- Signature de transactions

---

## ⚙️ Configuration

### Variables d'Environnement

Créer `.env` dans `apps/web/`:

```env
# OAuth Client IDs (à obtenir depuis les consoles développeur)
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
VITE_FACEBOOK_CLIENT_ID=your-facebook-app-id
VITE_TWITCH_CLIENT_ID=your-twitch-client-id
```

### Obtenir les Client IDs

1. **Google**: https://console.cloud.google.com
   - Créer un projet OAuth 2.0
   - Redirect URI: `http://localhost:3000/auth/callback`

2. **Facebook**: https://developers.facebook.com
   - Créer une app Facebook Login
   - Redirect URI: `http://localhost:3000/auth/callback`

3. **Twitch**: https://dev.twitch.tv
   - Créer une application
   - Redirect URI: `http://localhost:3000/auth/callback`

---

## 🔄 Flow de Connexion

### zkLogin (Social)

1. Utilisateur clique sur "Google/Facebook/Twitch"
2. Redirection vers OAuth provider
3. Authentification sur le provider
4. Callback avec `id_token` ou `access_token`
5. Génération adresse Sui depuis le token
6. Sauvegarde dans UserContext + localStorage

### Wallet Sui

1. Utilisateur clique sur "Wallet Sui"
2. Détection des wallets installés
3. Ouverture modale de connexion (dapp-kit)
4. Approbation dans l'extension wallet
5. Récupération adresse
6. Sauvegarde dans UserContext + localStorage

---

## 🧪 Tests

### Checklist Fonctionnelle

- [x] Modal s'ouvre au clic sur "Se connecter"
- [x] 3 options zkLogin (Google/Facebook/Twitch)
- [x] Option Wallet Sui
- [x] Détection wallets installés
- [x] Connexion zkLogin (mock address pour l'instant)
- [x] Connexion Wallet Sui
- [x] Adresse affichée dans Header
- [x] Dropdown avec infos wallet
- [x] Déconnexion fonctionne
- [x] Session persistée (localStorage)
- [x] État partagé sur toutes les pages
- [x] Rechargement page = session restaurée

### Tests Manuels

1. **Test zkLogin:**
   ```bash
   # Cliquer sur Google/Facebook/Twitch
   # Vérifier redirection OAuth
   # Vérifier callback génère une adresse
   ```

2. **Test Wallet Sui:**
   ```bash
   # Installer Sui Wallet extension
   # Cliquer sur "Wallet Sui"
   # Approuver dans l'extension
   # Vérifier adresse récupérée
   ```

3. **Test Persistence:**
   ```bash
   # Se connecter
   # Rafraîchir la page (Cmd+R)
   # Vérifier toujours connecté
   ```

4. **Test Multi-Pages:**
   ```bash
   # Se connecter sur page A
   # Naviguer vers page B
   # Vérifier toujours connecté
   ```

5. **Test Déconnexion:**
   ```bash
   # Ouvrir dropdown
   # Cliquer "Déconnexion"
   # Vérifier localStorage vide
   # Vérifier bouton "Se connecter" affiché
   ```

---

## 🐛 Dépannage

### Modal ne s'ouvre pas

- Vérifier la console (F12)
- Vérifier `WalletButton` est dans un `<UserProvider>`

### Wallet Sui non détecté

- Installer l'extension Sui Wallet
- Recharger la page après installation
- Vérifier l'extension est déverrouillée

### Session non restaurée

- Vérifier localStorage: `localStorage.getItem('streamSui_user_session')`
- Vérifier `UserProvider` est au root de l'app
- Vérifier pas d'erreur dans la console

### zkLogin ne fonctionne pas

- Vérifier les variables d'environnement `.env`
- Vérifier les Redirect URIs dans les consoles OAuth
- Pour l'instant: génération mock, implémentation complète à venir

---

## 🔧 TODOs / Améliorations

### Court Terme
- [ ] Implémenter la vraie génération zkLogin avec `@mysten/sui/zklogin`
- [ ] Ajouter gestion d'erreurs OAuth plus robuste
- [ ] Tests unitaires (Vitest)
- [ ] Tests E2E (Playwright)

### Moyen Terme
- [ ] Migrer de `@mysten/zklogin` vers `@mysten/sui/zklogin`
- [ ] Ajouter support Ledger hardware wallet
- [ ] Mode multi-wallet (plusieurs adresses)
- [ ] Gestion des networks (testnet/mainnet switcher)

### Long Terme
- [ ] Session tokens + refresh tokens
- [ ] Signatures de messages
- [ ] Transactions sponsorisées (gasless)
- [ ] Analytics connexions

---

## 📝 Changelog

### v2.0.0 - Refonte Complète (22 Nov 2025)

**✨ Nouveau:**
- Architecture complètement refaite from scratch
- Context global `UserProvider` avec localStorage
- Hook `useUser()` utilisable partout
- Modal popup moderne avec animations
- Support zkLogin (Google/Facebook/Twitch)
- Support wallets Sui natifs
- Persistence session cross-pages

**🗑️ Supprimé:**
- `ConnectWallet.tsx` (ancienne version cassée)
- `WalletConnectModal.tsx` (système obsolète)
- Ancien `UserContext.tsx` (incomplet)
- Ancien `useZkLogin.ts` (bugs)

**🔧 Modifié:**
- `providers.tsx` - Simplifié avec nouveaux providers
- `Header.tsx` - Intégration `WalletButton`
- `callback.tsx` - Support zkLogin callback

---

## 📚 Documentation Technique

### UserContext API

```typescript
interface UserContextType {
  suiAddress: string | null;          // Adresse Sui de l'utilisateur
  loginMethod: 'zklogin' | 'slush' | null;  // Méthode de connexion
  isConnected: boolean;                // État de connexion
  connect: (address: string, method: LoginMethod) => void;
  disconnect: () => void;
}
```

### useZkLogin API

```typescript
{
  loginWithProvider: (provider: 'google' | 'facebook' | 'twitch') => Promise<void>;
  handleCallback: () => Promise<string | null>;  // Pour la page callback
  loading: boolean;
  error: string | null;
}
```

### useSlushWallet API

```typescript
{
  connectSlush: () => void;           // Déclenche la connexion
  wallets: WalletInfo[];              // Wallets détectés
  isInstalled: boolean;               // Au moins 1 wallet installé
}
```

---

## 🤝 Support

Pour toute question ou bug, ouvre une issue sur GitHub ou contacte l'équipe dev.

**Dernière mise à jour:** 22 novembre 2025
