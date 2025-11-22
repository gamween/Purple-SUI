import { useState, useEffect } from "react";
import { Wallet, Twitch } from "lucide-react";
import { Button } from "./ui/button";
import { WalletConnectModal } from "./auth/WalletConnectModal";

export function Header() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [showWalletModal, setShowWalletModal] = useState(false);

  useEffect(() => {
    // Check if wallet is already connected
    checkExistingConnection();
  }, []);

  const checkExistingConnection = async () => {
    // Check for Suiet wallet
    if (typeof window !== 'undefined' && (window as any).suietWallet) {
      try {
        const wallet = (window as any).suietWallet;
        const accounts = await wallet.getAccounts();
        if (accounts && accounts.length > 0) {
          const address = accounts[0];
          setWalletAddress(formatAddress(address));
          setWalletConnected(true);
        }
      } catch (error) {
        console.log("No wallet connected");
      }
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleWalletConnect = async () => {
    try {
      // Try to connect to Suiet wallet
      if (typeof window !== 'undefined' && (window as any).suietWallet) {
        const wallet = (window as any).suietWallet;
        const accounts = await wallet.requestAccounts();
        
        if (accounts && accounts.length > 0) {
          const address = accounts[0];
          setWalletAddress(formatAddress(address));
          setWalletConnected(true);
          setShowWalletModal(false);
        }
      } else {
        // Simulate wallet connection for demo
        const mockAddress = "0x7a8f9b2c4d1e6f8a3b5c7d9e1f2a4b6c8d0e2f4a";
        setWalletAddress(formatAddress(mockAddress));
        setWalletConnected(true);
        setShowWalletModal(false);
      }
    } catch (error) {
      console.error("Wallet connection failed:", error);
    }
  };

  const handleTwitchLogin = () => {
    window.location.href = "/auth/login";
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">SB</span>
              </div>
              <span className="text-xl text-white">Sui Bounties</span>
            </a>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              {walletConnected ? (
                <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-green-400">{walletAddress}</span>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setShowWalletModal(true)}
                  className="gap-2 border-slate-700 hover:border-slate-600 bg-slate-900/50"
                >
                  <Wallet className="w-4 h-4" />
                  <span className="hidden sm:inline">Connecter Wallet</span>
                </Button>
              )}
              
              <Button
                onClick={handleTwitchLogin}
                className="gap-2 bg-purple-600 hover:bg-purple-700"
              >
                <Twitch className="w-4 h-4" />
                <span className="hidden sm:inline">Connexion Twitch</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <WalletConnectModal
        open={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onConnect={handleWalletConnect}
      />
    </>
  );
}