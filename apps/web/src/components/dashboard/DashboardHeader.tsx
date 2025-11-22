import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { WalletButton } from "../wallet/WalletButton";
import { TwitchButton } from "../twitch/TwitchButton";
import { useUser } from "../../context/UserContext";

interface DashboardHeaderProps {
  role: "dev" | "streamer" | "viewer";
}

export function DashboardHeader({ role }: DashboardHeaderProps) {
  const { suiAddress, isConnected, twitchData, isTwitchConnected } = useUser();
  const [notifications] = useState(3);
  
  // Vérifier si Twitch est requis pour ce rôle
  const requiresTwitch = role === 'streamer' || role === 'viewer';
  
  // Formater l'adresse pour affichage court
  const formatAddress = (address: string | null) => {
    if (!address) return "Non connecté";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-lg">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">SB</span>
            </div>
            <span className="text-xl text-white">Sui Bounties</span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Twitch Button - Visible pour tous, obligatoire pour streamer/viewer */}
            <TwitchButton />
            
            {/* Wallet Button - Vrai système de connexion */}
            <WalletButton />

            {/* Notifications */}
            <button className="relative p-2 hover:bg-slate-800 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-slate-400" />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-2 hover:bg-slate-800 rounded-lg transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800">
                <div className="px-3 py-2 space-y-1">
                  <p className="text-sm text-white font-medium">
                    {role === "dev" ? "Développeur" : role === "streamer" ? "Streamer" : "Viewer"}
                  </p>
                  <p className="text-xs text-slate-400">
                    {isConnected ? formatAddress(suiAddress) : "Non connecté"}
                  </p>
                  {isTwitchConnected && twitchData && (
                    <p className="text-xs text-purple-400 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
                      </svg>
                      {twitchData.username}
                    </p>
                  )}
                  {requiresTwitch && !isTwitchConnected && (
                    <p className="text-xs text-amber-400">⚠️ Twitch requis</p>
                  )}
                </div>
                <DropdownMenuSeparator className="bg-slate-800" />
                <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-800">
                  <User className="w-4 h-4 mr-2" />
                  Mon profil
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-800" />
                <DropdownMenuItem
                  className="text-red-400 hover:text-red-300 hover:bg-slate-800"
                  asChild
                >
                  <Link to="/">
                    <LogOut className="w-4 h-4 mr-2" />
                    Déconnexion
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}