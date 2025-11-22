'use client';

import { X, Sparkles, Wallet as WalletIcon } from 'lucide-react';
import { useZkLogin, SocialProvider } from '../../hooks/useZkLogin';
import { useSlushWallet } from '../../hooks/useSlushWallet';

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal de connexion wallet
 * Affiche 2 options: zkLogin (social) et Wallet Sui
 */
export function ConnectModal({ isOpen, onClose }: ConnectModalProps) {
  const zkLogin = useZkLogin();
  const { connectSlush, isInstalled } = useSlushWallet();

  if (!isOpen) return null;

  const handleZkLogin = async (provider: SocialProvider) => {
    await zkLogin.loginWithProvider(provider);
    // La redirection OAuth va fermer la modal automatiquement
  };

  const handleWalletConnect = () => {
    connectSlush();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in-0 duration-200">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 w-full max-w-md animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Se connecter à StreamSUI
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Choisissez votre méthode de connexion préférée
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
          {/* Option 1: zkLogin Social */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
                Connexion Sociale
              </h3>
              <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full">
                Recommandé
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {/* Google */}
              <button
                onClick={() => handleZkLogin('google')}
                disabled={zkLogin.loading}
                className="group relative p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-purple-500/50 rounded-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </div>
                  <span className="text-xs text-slate-300 font-medium">Google</span>
                </div>
              </button>

              {/* Facebook */}
              <button
                onClick={() => handleZkLogin('facebook')}
                disabled={zkLogin.loading}
                className="group relative p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-purple-500/50 rounded-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <span className="text-xs text-slate-300 font-medium">Facebook</span>
                </div>
              </button>

              {/* Twitch */}
              <button
                onClick={() => handleZkLogin('twitch')}
                disabled={zkLogin.loading}
                className="group relative p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-purple-500/50 rounded-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.571 4.714h1.715v5.143H11.57zm0 6.857h1.715V20H11.57z"/>
                      <path d="M18.286 1.714L22 5.429v9.143l-3.714 3.714h-3.715l-2.285 2.286H9.43v-2.286H5.714V7.714L7.43 1.714zM18.857 14.857V6.857h-12v8h2.857v2.286l2.286-2.286z"/>
                    </svg>
                  </div>
                  <span className="text-xs text-slate-300 font-medium">Twitch</span>
                </div>
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              <span className="text-yellow-400">💡</span> Connexion instantanée sans extension. 
              Un wallet Sui est créé automatiquement.
            </p>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-slate-900 text-slate-500">OU</span>
            </div>
          </div>

          {/* Option 2: Wallet Sui */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <WalletIcon className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-white uppercase tracking-wide">
                Wallet Crypto
              </h3>
            </div>

            <button
              onClick={handleWalletConnect}
              disabled={zkLogin.loading}
              className="w-full group p-4 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 hover:from-purple-500/20 hover:to-cyan-500/20 border border-purple-500/30 hover:border-purple-500/50 rounded-xl transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
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
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-800/30 border-t border-slate-800 rounded-b-2xl">
          <p className="text-xs text-slate-400 text-center">
            🔒 Connexion sécurisée • Vos clés restent privées
          </p>
        </div>
      </div>
    </div>
  );
}
