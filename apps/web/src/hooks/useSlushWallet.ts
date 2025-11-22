import { useWallets, useConnectWallet, useCurrentAccount } from '@mysten/dapp-kit';
import { useUser } from '../context/UserContext';
import { useEffect } from 'react';

/**
 * Hook pour la connexion avec les wallets Sui natifs
 * Supporte: Sui Wallet, Slush, Ethos, etc.
 */
export function useSlushWallet() {
  const wallets = useWallets();
  const { mutate: connectWallet } = useConnectWallet();
  const currentAccount = useCurrentAccount();
  const { connect, suiAddress } = useUser();

  // Synchroniser l'account wallet avec le context utilisateur
  useEffect(() => {
    if (currentAccount?.address && currentAccount.address !== suiAddress) {
      console.log('[SlushWallet] Wallet détecté, synchronisation context');
      connect(currentAccount.address, 'slush');
    }
  }, [currentAccount, suiAddress, connect]);

  /**
   * Déclencher la connexion wallet
   * Ouvre la modale de sélection du dapp-kit
   */
  const connectSlush = () => {
    console.log('[SlushWallet] Wallets disponibles:', wallets.map(w => w.name));

    // Chercher un wallet Sui
    const suiWallet = wallets.find(w => 
      w.name.toLowerCase().includes('sui') ||
      w.name.toLowerCase().includes('slush') ||
      w.name.toLowerCase().includes('ethos')
    );

    if (wallets.length === 0) {
      alert('Aucun wallet Sui détecté. Installez Sui Wallet, Slush ou Ethos.');
      window.open('https://chromewebstore.google.com/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil', '_blank');
      return;
    }

    // Connecter le premier wallet trouvé (ou déclenche la modale si plusieurs)
    connectWallet(
      { wallet: suiWallet || wallets[0] },
      {
        onSuccess: (result) => {
          const address = result.accounts[0]?.address;
          if (address) {
            console.log('[SlushWallet] Connexion réussie:', address.slice(0, 10) + '...');
            connect(address, 'slush');
          }
        },
        onError: (error) => {
          console.error('[SlushWallet] Erreur connexion:', error);
          alert('Erreur de connexion au wallet. Vérifiez que votre wallet est déverrouillé.');
        },
      }
    );
  };

  return { 
    connectSlush, 
    wallets,
    isInstalled: wallets.length > 0 
  };
}
