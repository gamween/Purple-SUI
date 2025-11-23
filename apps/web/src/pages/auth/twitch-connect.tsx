'use client';

import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import { TwitchButton } from '../../components/twitch/TwitchButton';

/**
 * Page de connexion Twitch
 * Affichée quand l'utilisateur n'est pas encore connecté à Twitch
 * Permet de connecter son compte Twitch ou revenir au menu
 */
export default function TwitchConnectPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-purple-500/20 rounded-2xl flex items-center justify-center">
            <svg className="w-10 h-10 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Connexion Twitch</h1>
          <p className="text-slate-400">Connectez votre compte Twitch pour continuer</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl p-8 space-y-6 mb-6">
          {/* Info Box */}
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-purple-300 font-medium">Pourquoi Twitch ?</p>
              <p className="text-xs text-purple-200/70 mt-1">Nous utilisons Twitch pour vérifier votre identité et connecter votre profil streameur à la plateforme.</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <div className="flex justify-center">
              <TwitchButton />
            </div>

            <p className="text-xs text-slate-500 text-center">
              Vous allez être redirigé vers Twitch pour autoriser l'application
            </p>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-slate-100 rounded-xl transition-all border border-slate-700/50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au menu</span>
        </button>
      </div>
    </div>
  );
}
