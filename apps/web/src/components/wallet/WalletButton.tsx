'use client';

import { useState } from 'react';
import { Wallet, LogOut, ChevronDown } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { useDisconnectWallet } from '@mysten/dapp-kit';
import { ConnectModal } from './ConnectModal';

/**
 * Bouton de connexion wallet global
 * Affiche "Se connecter" ou l'adresse + bouton déconnexion
 * Utilisable partout dans l'app
 */
export function WalletButton() {
  const { isConnected, suiAddress, loginMethod, disconnect } = useUser();
  const { mutate: disconnectWallet } = useDisconnectWallet();
  const [modalOpen, setModalOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  /**
   * Déconnexion complète
   */
  const handleDisconnect = () => {
    console.log('[WalletButton] Déconnexion');
    
    // Déconnecter le wallet Sui si utilisé
    if (loginMethod === 'slush') {
      disconnectWallet();
    }
    
    // Nettoyer le context utilisateur
    disconnect();
    setShowDropdown(false);
  };

  /**
   * Formater l'adresse Sui
   */
  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // UI: Utilisateur connecté
  if (isConnected && suiAddress) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 px-6 py-2 bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 rounded-lg transition-all"
        >
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-green-400 font-medium">
            {formatAddress(suiAddress)}
          </span>
          <ChevronDown className={`w-4 h-4 text-green-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown */}
        {showDropdown && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowDropdown(false)}
            />
            <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
              <div className="p-3 border-b border-slate-800">
                <p className="text-xs text-slate-500 uppercase font-semibold">Wallet connecté</p>
                <p className="text-sm text-white mt-1 font-mono break-all">{suiAddress}</p>
                <p className="text-xs text-slate-400 mt-1">
                  via {loginMethod === 'zklogin' ? '🔐 Social Login' : '💎 Wallet Sui'}
                </p>
              </div>
              
              <button
                onClick={handleDisconnect}
                className="w-full p-3 flex items-center gap-3 text-red-400 hover:bg-slate-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Déconnexion</span>
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  // UI: Non connecté
  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-lg font-medium transition-all hover:scale-105 shadow-lg shadow-purple-500/25"
      >
        <Wallet className="w-4 h-4" />
        <span>Se connecter</span>
      </button>
      
      <ConnectModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
