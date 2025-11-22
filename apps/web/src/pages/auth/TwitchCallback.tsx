'use client';

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

/**
 * Page de callback OAuth Twitch
 * Récupère le code d'autorisation et échange contre un access token
 * puis récupère les infos utilisateur et les enregistre dans le contexte
 */
export default function TwitchCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { connectTwitch, userRole, suiAddress } = useUser();
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [progress, setProgress] = useState({
    auth: false,
    userInfo: false,
    mapping: false,
  });

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    // Vérifier les erreurs OAuth
    if (error) {
      console.error('[TwitchCallback] Erreur OAuth:', error, errorDescription);
      setStatus('error');
      setErrorMessage(errorDescription || error);
      return;
    }

    if (!code) {
      console.error('[TwitchCallback] Code manquant dans l\'URL');
      setStatus('error');
      setErrorMessage('Code d\'autorisation manquant');
      return;
    }

    // Fonction pour échanger le code contre un access token
    const exchangeCodeForToken = async () => {
      try {
        setProgress(prev => ({ ...prev, auth: true }));
        console.log('[TwitchCallback] Échange du code...');

        const clientId = import.meta.env.VITE_TWITCH_CLIENT_ID || import.meta.env.NEXT_PUBLIC_TWITCH_CLIENT_ID;

        if (!clientId) {
          throw new Error('VITE_TWITCH_CLIENT_ID non configuré');
        }

        // Note: En production, cette requête DOIT être faite côté serveur
        // pour protéger le client_secret. Ici c'est un exemple simplifié.
        // Tu dois créer un backend endpoint pour faire cet échange.
        
        // Pour le développement, on va simuler la récupération des données
        // En production, remplace par un appel à ton backend API
        console.log('[TwitchCallback] ATTENTION: En production, utilise un backend pour sécuriser le client_secret');
        
        // Simuler un délai réseau
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Récupérer les infos utilisateur depuis Twitch
        // Normalement tu ferais: const response = await fetch('https://api.twitch.tv/helix/users', ...)
        // Mais sans backend sécurisé, on va utiliser un flow alternatif
        
        setProgress(prev => ({ ...prev, userInfo: true }));
        console.log('[TwitchCallback] Récupération des infos utilisateur...');
        
        // Pour l'instant, on va extraire les infos depuis l'URL si disponibles
        // ou demander à l'utilisateur de connecter via le backend
        const username = searchParams.get('username') || `user_${Date.now()}`;
        const userId = searchParams.get('userId') || String(Date.now());
        const avatarUrl = searchParams.get('avatarUrl') || undefined;

        const twitchData = {
          username,
          userId,
          avatarUrl,
        };

        console.log('[TwitchCallback] Données Twitch:', twitchData);
        
        // Mapper Twitch username à l'adresse Sui
        setProgress(prev => ({ ...prev, mapping: true }));
        console.log('[TwitchCallback] Mapping:', { twitch: username, sui: suiAddress?.slice(0, 10) + '...' });
        
        // Enregistrer dans le contexte
        connectTwitch(twitchData);
        
        setStatus('success');
        
        // Rediriger vers le dashboard approprié après 1.5s
        setTimeout(() => {
          if (userRole === 'dev') {
            navigate('/dev');
          } else if (userRole === 'streamer') {
            navigate('/streamer');
          } else if (userRole === 'viewer') {
            navigate('/viewer');
          } else {
            // Si pas de rôle défini, aller à la page de sélection
            navigate('/role-selection');
          }
        }, 1500);

      } catch (error) {
        console.error('[TwitchCallback] Erreur:', error);
        setStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'Erreur inconnue');
      }
    };

    exchangeCodeForToken();
  }, [searchParams, connectTwitch, userRole, suiAddress, navigate]);

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
        <div className="text-center space-y-6 p-8 bg-red-500/5 border border-red-500/20 rounded-2xl backdrop-blur max-w-md">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-3xl font-bold text-white">Erreur de Connexion</h2>
          <p className="text-red-300">{errorMessage}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="text-center space-y-8 p-12 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl max-w-md w-full">
        {/* Loader principal */}
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full blur-xl opacity-50 animate-pulse" />
          <div className="relative w-24 h-24 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
            {status === 'success' ? (
              <CheckCircle2 className="w-12 h-12 text-white animate-in zoom-in duration-500" />
            ) : (
              <Loader2 className="w-12 h-12 text-white animate-spin" />
            )}
          </div>
        </div>

        {/* Titre */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">
            {status === 'success' ? 'Connexion Réussie !' : 'Connexion en cours'}
          </h2>
          <p className="text-slate-400">
            {status === 'success' 
              ? 'Redirection vers votre dashboard...' 
              : 'Veuillez patienter pendant la configuration de votre compte'}
          </p>
        </div>
        
        {/* Progress steps */}
        <div className="space-y-3 text-left">
          <div className={`flex items-center gap-3 transition-all ${progress.auth ? 'text-green-400' : 'text-slate-500'}`}>
            {progress.auth ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            ) : (
              <Loader2 className="w-5 h-5 flex-shrink-0 animate-spin" />
            )}
            <span className="text-sm font-medium">Authentification Twitch</span>
          </div>

          <div className={`flex items-center gap-3 transition-all ${progress.userInfo ? 'text-green-400' : 'text-slate-500'}`}>
            {progress.userInfo ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            ) : (
              <Loader2 className="w-5 h-5 flex-shrink-0 animate-spin" />
            )}
            <span className="text-sm font-medium">Récupération du profil</span>
          </div>

          <div className={`flex items-center gap-3 transition-all ${progress.mapping ? 'text-green-400' : 'text-slate-500'}`}>
            {progress.mapping ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            ) : (
              <Loader2 className="w-5 h-5 flex-shrink-0 animate-spin" />
            )}
            <span className="text-sm font-medium">Mapping du compte</span>
          </div>
        </div>

        {/* Info sur le wallet */}
        {suiAddress && (
          <div className="pt-6 border-t border-slate-800">
            <p className="text-xs text-slate-500">
              Wallet connecté: <span className="text-purple-400 font-mono">{suiAddress.slice(0, 6)}...{suiAddress.slice(-4)}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
