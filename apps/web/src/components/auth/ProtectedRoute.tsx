'use client';

import { ReactNode } from 'react';
import { useUser } from '../../context/UserContext';
import { WalletButton } from '../wallet/WalletButton';
import { Shield, Sparkles } from 'lucide-react';

type UserRole = 'dev' | 'streamer' | 'viewer';

interface ProtectedRouteProps {
  children: ReactNode;
  message?: string;
  requireTwitch?: boolean; // Si true, la connexion Twitch est obligatoire
  allowedRoles?: UserRole[]; // Rôles autorisés à accéder à cette route
}

/**
 * Composant pour protéger les routes selon les critères :
 * - Connexion wallet (toujours requis)
 * - Connexion Twitch (optionnel selon requireTwitch)
 * - Rôle utilisateur (optionnel selon allowedRoles)
 */
export function ProtectedRoute({ 
  children, 
  message = "Connectez votre wallet pour accéder à cette page",
  allowedRoles
}: ProtectedRouteProps) {
  const { isConnected, userRole } = useUser();

  // Vérification 1 : Connexion wallet requise (toujours)
  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center space-y-6 p-12 max-w-md">
          {/* Icon */}
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full blur-xl opacity-50 animate-pulse" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
              <Shield className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-400" />
              Accès Restreint
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              {message}
            </p>
          </div>

          {/* Wallet Button */}
          <div className="pt-4">
            <WalletButton />
          </div>

          {/* Footer Info */}
          <div className="pt-8 border-t border-slate-800">
            <p className="text-xs text-slate-400">
              🔒 Connexion sécurisée via zkLogin (Google/Facebook/Twitch) ou Wallet Sui
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Vérification 2 : Rôle autorisé (si spécifié)
  if (allowedRoles && allowedRoles.length > 0 && userRole && !allowedRoles.includes(userRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center space-y-6 p-12 max-w-md">
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 bg-red-500 rounded-full blur-xl opacity-30" />
            <div className="relative w-24 h-24 bg-red-500/20 border-2 border-red-500 rounded-full flex items-center justify-center">
              <Shield className="w-12 h-12 text-red-400" />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-white">Accès Non Autorisé</h1>
            <p className="text-slate-300">
              Vous n'avez pas les permissions pour accéder à cette page.
            </p>
            <p className="text-sm text-slate-400">
              Rôle actuel : <span className="text-purple-400 font-semibold">{userRole}</span>
            </p>
          </div>

          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  // NOTE: Twitch requirement removed — do not block routes based on Twitch connection.

  // Toutes les vérifications passées : afficher le contenu
  return <>{children}</>;
}
