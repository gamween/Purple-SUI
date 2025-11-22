import { useState } from 'react';
import { useUser } from '../context/UserContext';

export type SocialProvider = 'google' | 'facebook' | 'twitch';

/**
 * Hook pour la connexion via zkLogin (OAuth social)
 * Gère le flow OAuth avec Google, Facebook, et Twitch
 */
export function useZkLogin() {
  const { connect } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Initier la connexion sociale
   */
  const loginWithProvider = async (provider: SocialProvider) => {
    setLoading(true);
    setError(null);

    try {
      // Sauvegarder le provider pour le callback
      sessionStorage.setItem('zklogin_provider', provider);

      // Configuration OAuth par provider
      const redirectUri = `${window.location.origin}/auth/callback`;
      const clientIds = {
        google: (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
        facebook: (import.meta as any).env?.VITE_FACEBOOK_CLIENT_ID || 'YOUR_FACEBOOK_APP_ID',
        twitch: (import.meta as any).env?.VITE_TWITCH_CLIENT_ID || 'YOUR_TWITCH_CLIENT_ID',
      };

      let authUrl: string;

      switch (provider) {
        case 'google':
          authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
            `client_id=${clientIds.google}&` +
            `redirect_uri=${encodeURIComponent(redirectUri)}&` +
            `response_type=id_token&` +
            `scope=openid%20email%20profile&` +
            `nonce=${generateNonce()}`;
          break;

        case 'facebook':
          authUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
            `client_id=${clientIds.facebook}&` +
            `redirect_uri=${encodeURIComponent(redirectUri)}&` +
            `response_type=token&` +
            `scope=email,public_profile`;
          break;

        case 'twitch':
          authUrl = `https://id.twitch.tv/oauth2/authorize?` +
            `client_id=${clientIds.twitch}&` +
            `redirect_uri=${encodeURIComponent(redirectUri)}&` +
            `response_type=token&` +
            `scope=user:read:email`;
          break;

        default:
          throw new Error(`Provider non supporté: ${provider}`);
      }

      console.log('[zkLogin] Redirection OAuth:', provider);
      window.location.href = authUrl;

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur de connexion';
      setError(message);
      console.error('[zkLogin] Erreur:', err);
      setLoading(false);
    }
  };

  /**
   * Traiter le callback OAuth (à appeler dans /auth/callback)
   */
  const handleCallback = async (): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      const provider = sessionStorage.getItem('zklogin_provider') as SocialProvider;
      if (!provider) {
        throw new Error('Provider manquant');
      }

      // Récupérer le token depuis l'URL hash
      const params = new URLSearchParams(window.location.hash.substring(1));
      const idToken = params.get('id_token') || params.get('access_token');

      if (!idToken) {
        throw new Error('Token OAuth manquant');
      }

      console.log('[zkLogin] Token reçu, génération adresse...');

      // TODO: Implémenter la vraie génération zkLogin avec @mysten/sui/zklogin
      // Pour l'instant: mock avec hash du token
      const mockAddress = await generateSuiAddressFromToken(idToken);

      // Sauvegarder dans le context
      connect(mockAddress, 'zklogin');

      // Nettoyer
      sessionStorage.removeItem('zklogin_provider');

      console.log('[zkLogin] Connexion réussie:', mockAddress.slice(0, 10) + '...');
      return mockAddress;

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur callback';
      setError(message);
      console.error('[zkLogin] Erreur callback:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { 
    loginWithProvider, 
    handleCallback,
    loading, 
    error 
  };
}

/**
 * Génère un nonce aléatoire pour OAuth
 */
function generateNonce(): string {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
}

/**
 * Génère une adresse Sui depuis un token OAuth
 * TODO: Remplacer par la vraie implémentation zkLogin
 */
async function generateSuiAddressFromToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return '0x' + hashHex.substring(0, 64);
}
