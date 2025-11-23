'use client';

import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowLeft, Wallet } from 'lucide-react';
import { ConnectModal } from '../../components/wallet/ConnectModal';
import { useState } from 'react';

/**
 * Page de connexion Wallet
 * Affichée quand l'utilisateur n'est pas encore connecté au wallet Sui
 * Permet de connecter son wallet ou revenir au menu
 */
export default function WalletConnectPage() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const handleConnect = () => {
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-cyan-500/20 rounded-2xl flex items-center justify-center">
            <Wallet className="w-10 h-10 text-cyan-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Connexion Wallet</h1>
          <p className="text-slate-400">Connectez votre wallet Sui pour continuer</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl p-8 space-y-6 mb-6">
          {/* Info Box */}
          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4 flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-cyan-300 font-medium">Wallet Sui</p>
              <p className="text-xs text-cyan-200/70 mt-1">Votre wallet Sui sécurise vos transactions et votre identité sur la blockchain.</p>
            </div>
          </div>

          {/* Connection Options */}
          <div className="space-y-3">
            {/* zkLogin Option */}
            <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-xl p-4 hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-cyan-500/20 transition-all cursor-pointer"
              onClick={handleConnect}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-bold text-purple-400">🔐</span>
                </div>
                <div>
                  <p className="font-medium text-white">zkLogin</p>
                  <p className="text-xs text-slate-400 mt-1">Connectez-vous avec Google, Facebook ou Apple</p>
                </div>
              </div>
            </div>

            {/* Wallet Slush Option */}
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-4 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-blue-500/20 transition-all cursor-pointer"
              onClick={handleConnect}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-bold text-cyan-400">💎</span>
                </div>
                <div>
                  <p className="font-medium text-white">Wallet Sui</p>
                  <p className="text-xs text-slate-400 mt-1">Connectez votre wallet Sui officiel</p>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <button
            onClick={handleConnect}
            className="w-full px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-cyan-500/25"
          >
            Connecter mon wallet
          </button>
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

      {/* Modal de connexion wallet */}
      <ConnectModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
