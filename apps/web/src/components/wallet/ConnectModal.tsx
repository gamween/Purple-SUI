"use client";

import { createPortal } from 'react-dom';
import { X, Wallet as WalletIcon, Tv } from 'lucide-react';
import { useSlushWallet } from '../../hooks/useSlushWallet';
import { useUser } from '../../context/UserContext';

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal de connexion wallet
 * Affiche 2 options: Wallet Sui et Twitch
 */
export function ConnectModal({ isOpen, onClose }: ConnectModalProps) {
  const { connectSlush, isInstalled } = useSlushWallet();
  const { isTwitchConnected, twitchData } = useUser();

  if (typeof document === 'undefined') return null;
  if (!isOpen) return null;

  const handleWalletConnect = () => {
    connectSlush();
    onClose();
  };

  const handleTwitchConnect = () => {
    const clientId = import.meta.env.VITE_TWITCH_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_TWITCH_REDIRECT_URI;
    
    if (!clientId || !redirectUri) {
      console.error('[ConnectModal] Configuration OAuth Twitch manquante:', { clientId: !!clientId, redirectUri: !!redirectUri });
      alert('Configuration Twitch OAuth incomplète. Vérifiez votre .env.local');
      return;
    }

    // Sauvegarder l'URL actuelle pour y retourner après l'authentification
    sessionStorage.setItem('twitch_return_url', window.location.pathname + window.location.search);
    console.log('[ConnectModal] URL de retour sauvegardée:', window.location.pathname);

    // Construire l'URL d'autorisation Twitch OAuth (Implicit Flow)
    const authUrl = new URL('https://id.twitch.tv/oauth2/authorize');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', redirectUri); // Frontend: https://localhost:3000/auth/twitch/callback
    authUrl.searchParams.set('response_type', 'token'); // ← IMPLICIT FLOW (pas de Client Secret requis)
    authUrl.searchParams.set('scope', 'user:read:email');

    console.log('[ConnectModal] Redirection vers Twitch OAuth (Implicit Flow):', authUrl.toString());
    
    // Redirection vers la page d'autorisation Twitch
    window.location.href = authUrl.toString();
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in-0 duration-200 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 w-full max-w-md mx-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <WalletIcon className="w-5 h-5 text-purple-400" />
                Se connecter à StreamSUI
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Choisissez votre méthode de connexion
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Option 1: Wallet Sui */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <WalletIcon className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
                Wallet Crypto
              </h3>
            </div>

            <button
              onClick={handleWalletConnect}
              className="w-full group p-4 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 hover:from-purple-500/20 hover:to-cyan-500/20 border border-purple-500/30 hover:border-purple-500/50 rounded-xl transition-all hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <WalletIcon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">Wallet Sui</span>
                    {!isInstalled && (
                      <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full">
                        Non installé
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">
                    Sui Wallet, Slush, Ethos...
                  </p>
                </div>
                <svg className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-slate-900 text-slate-500">ET AUSSI</span>
            </div>
          </div>

          {/* Option 2: Twitch pour Streamers */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Tv className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
                Compte Twitch
              </h3>
              {isTwitchConnected && (
                <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full">
                  Connecté
                </span>
              )}
            </div>

            <button
              onClick={handleTwitchConnect}
              disabled={isTwitchConnected}
              className="w-full group p-4 bg-gradient-to-r from-purple-600/10 to-purple-700/10 hover:from-purple-600/20 hover:to-purple-700/20 border border-purple-500/30 hover:border-purple-500/50 rounded-xl transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
                  </svg>
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">
                      {isTwitchConnected && twitchData ? twitchData.username : 'Connecter Twitch'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {isTwitchConnected ? 'Compte Twitch actif' : 'Pour les streamers uniquement'}
                  </p>
                </div>
                <svg className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-800/30 border-t border-slate-800 rounded-b-2xl">
          <p className="text-xs text-slate-400 text-center">
            🔒 Connexion sécurisée • Vos clés restent privées
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
