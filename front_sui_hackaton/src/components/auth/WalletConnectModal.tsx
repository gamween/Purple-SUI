import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Wallet, ExternalLink } from "lucide-react";

interface WalletConnectModalProps {
  open: boolean;
  onClose: () => void;
  onConnect: () => void;
}

const wallets = [
  {
    name: "Suiet Wallet",
    description: "Le wallet recommandé pour Sui",
    icon: "💎",
    recommended: true,
  },
  {
    name: "Sui Wallet",
    description: "Wallet officiel de Sui",
    icon: "🔷",
    recommended: false,
  },
  {
    name: "Ethos Wallet",
    description: "Wallet multi-chain compatible",
    icon: "⚡",
    recommended: false,
  },
];

export function WalletConnectModal({
  open,
  onClose,
  onConnect,
}: WalletConnectModalProps) {
  const [connecting, setConnecting] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  const handleConnect = async (walletName: string) => {
    setSelectedWallet(walletName);
    setConnecting(true);

    // Simulate wallet connection
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setConnecting(false);
    onConnect();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-800 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-purple-400" />
            Connecter votre wallet Sui
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Choisissez un wallet pour continuer. Vous aurez besoin d'un wallet Sui
            pour recevoir vos paiements et interagir avec les smart contracts.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {wallets.map((wallet) => (
            <button
              key={wallet.name}
              onClick={() => handleConnect(wallet.name)}
              disabled={connecting}
              className="w-full p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-lg transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl">{wallet.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white">{wallet.name}</span>
                    {wallet.recommended && (
                      <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full">
                        Recommandé
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 mt-0.5">
                    {wallet.description}
                  </p>
                </div>
                {connecting && selectedWallet === wallet.name ? (
                  <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-slate-400" />
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg">
          <p className="text-xs text-slate-400 leading-relaxed">
            <span className="text-yellow-400">⚠️ Note:</span> Assurez-vous d'avoir
            installé l'extension de wallet dans votre navigateur. Si vous n'avez
            pas encore de wallet, vous pouvez en télécharger un depuis leur site
            officiel.
          </p>
        </div>

        <div className="flex gap-3 mt-4">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-slate-700 hover:border-slate-600"
            disabled={connecting}
          >
            Annuler
          </Button>
          <Button
            onClick={() => window.open("https://suiet.app", "_blank")}
            variant="ghost"
            className="flex-1"
            disabled={connecting}
          >
            Télécharger Suiet
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
