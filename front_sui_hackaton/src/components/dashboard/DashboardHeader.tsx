import { useState } from "react";
import { Link } from "react-router-dom";
import { Wallet, Bell, User, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface DashboardHeaderProps {
  role: "dev" | "streamer" | "viewer";
}

export function DashboardHeader({ role }: DashboardHeaderProps) {
  const [walletAddress] = useState("0x7a8f...9b3c");
  const [notifications] = useState(3);

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
            {/* Wallet */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
              <Wallet className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">{walletAddress}</span>
            </div>

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
                <div className="px-3 py-2">
                  <p className="text-sm text-white">
                    {role === "dev" ? "Développeur" : role === "streamer" ? "Streamer" : "Viewer"}
                  </p>
                  <p className="text-xs text-slate-400">{walletAddress}</p>
                </div>
                <DropdownMenuSeparator className="bg-slate-800" />
                <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-800">
                  <User className="w-4 h-4 mr-2" />
                  Mon profil
                </DropdownMenuItem>
                <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-800">
                  <Wallet className="w-4 h-4 mr-2" />
                  Gérer wallet
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