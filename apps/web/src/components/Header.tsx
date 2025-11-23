import { Twitch } from "lucide-react";
import { Button } from "./ui/button";
import { WalletButton } from "./wallet/WalletButton";

export function Header() {
  const handleTwitchLogin = () => {
    window.location.href = "/auth/login";
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">PS</span>
            </div>
            <span className="text-xl text-white">Purple SUI</span>
          </a>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {/* Nouveau bouton wallet unifié */}
            <WalletButton />
            
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
  );
}