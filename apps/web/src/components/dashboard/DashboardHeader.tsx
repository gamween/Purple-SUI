import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, User, LogOut, X, Check, MessageSquare, Zap, Coins } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
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
import { useNotifications } from "../../lib/NotificationContext";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface DashboardHeaderProps {
  role: "dev" | "streamer" | "viewer";
}

export function DashboardHeader({ role }: DashboardHeaderProps) {
  // User context (OAuth Twitch + Wallet)
  const { suiAddress, isConnected, twitchData, isTwitchConnected } = useUser();
  
  // Notifications system
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotification } = useNotifications();
  
  // Vérifier si Twitch est requis pour ce rôle
  const requiresTwitch = role === 'streamer' || role === 'viewer';
  
  // Formater l'adresse pour affichage court
  const formatAddress = (address: string | null) => {
    if (!address) return "Non connecté";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const notificationIcons = {
    bounty_offer: Zap,
    bounty_accepted: Check,
    bounty_rejected: X,
    message: MessageSquare,
    donation: Coins,
  };

  const notificationColors = {
    bounty_offer: "text-purple-400 bg-purple-500/10",
    bounty_accepted: "text-green-400 bg-green-500/10",
    bounty_rejected: "text-red-400 bg-red-500/10",
    message: "text-cyan-400 bg-cyan-500/10",
    donation: "text-yellow-400 bg-yellow-500/10",
  };

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      setShowNotifications(false);
    }
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
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5 text-slate-400" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </button>

              {/* Notifications Panel */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-96 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b border-slate-800">
                    <div>
                      <h3 className="text-white font-semibold">Notifications</h3>
                      {unreadCount > 0 && (
                        <p className="text-slate-400 text-xs">{unreadCount} non lue{unreadCount > 1 ? 's' : ''}</p>
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllAsRead}
                        className="text-purple-400 hover:text-purple-300 text-xs"
                      >
                        Tout marquer comme lu
                      </Button>
                    )}
                  </div>

                  {/* Notifications List */}
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <Bell className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-400 text-sm">Aucune notification</p>
                      </div>
                    ) : (
                      notifications.map((notification) => {
                        const Icon = notificationIcons[notification.type];
                        return (
                          <button
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            className={`w-full p-4 border-b border-slate-800 hover:bg-slate-800/50 transition-colors text-left ${
                              !notification.read ? "bg-slate-800/30" : ""
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${notificationColors[notification.type]}`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <p className="text-white text-sm font-semibold">{notification.title}</p>
                                  {!notification.read && (
                                    <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 mt-1" />
                                  )}
                                </div>
                                <p className="text-slate-400 text-sm mb-2">{notification.message}</p>
                                <p className="text-slate-500 text-xs">
                                  {formatDistanceToNow(notification.timestamp, { 
                                    addSuffix: true,
                                    locale: fr 
                                  })}
                                </p>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  clearNotification(notification.id);
                                }}
                                className="text-slate-500 hover:text-slate-300 flex-shrink-0"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

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