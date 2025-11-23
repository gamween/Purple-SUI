import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Users, Zap, ExternalLink, AlertCircle, Gift } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { toast } from "sonner";

interface StreamerCardProps {
  streamer: {
    id: string;
    name: string;
    avatar: string;
    isLive: boolean;
    viewers: number;
    category: string;
    activeBounties: number;
    thumbnail: string;
    twitchUsername?: string;
    twitchUrl?: string;
  };
}

export function StreamerCard({ streamer }: StreamerCardProps) {
  const handleWatchStream = () => {
    if (streamer.isLive && streamer.twitchUrl) {
      // Ouvrir le stream Twitch dans un nouvel onglet
      window.open(streamer.twitchUrl, '_blank');
    } else if (streamer.isLive && !streamer.twitchUrl) {
      // Le streamer est marqué live mais pas de lien
      toast.error("Stream temporairement indisponible", {
        description: "Le streamer n'a pas encore configuré son lien Twitch."
      });
    } else {
      // Le streamer est offline
      toast.info("Streamer hors ligne", {
        description: `${streamer.name} n'est pas en stream actuellement.`
      });
    }
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all group">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-slate-800">
        <ImageWithFallback
          src={streamer.thumbnail}
          alt={streamer.name}
          className="w-full h-full object-cover"
        />
        
        {/* Live Badge */}
        {streamer.isLive && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-red-600 text-white border-0">
              <div className="w-2 h-2 bg-white rounded-full mr-1.5 animate-pulse" />
              LIVE
            </Badge>
          </div>
        )}

        {/* Viewers */}
        {streamer.isLive && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs text-white">
            <Users className="w-3 h-3" />
            {streamer.viewers.toLocaleString()}
          </div>
        )}

        {/* Bounties Badge */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 bg-purple-600/90 backdrop-blur-sm rounded text-xs text-white">
          <Zap className="w-3 h-3" />
          {streamer.activeBounties} {streamer.activeBounties > 1 ? "bounties" : "bounty"}
        </div>
        
        {/* NFT Rewards indicator */}
        {streamer.activeBounties > 0 && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 backdrop-blur-sm rounded text-xs text-white font-semibold shadow-lg">
            <Gift className="w-3 h-3" />
            NFT
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <img
            src={streamer.avatar}
            alt={streamer.name}
            className="w-10 h-10 rounded-full border-2 border-slate-700"
          />
          <div className="flex-1">
            <h3 className="text-white">{streamer.name}</h3>
            <p className="text-slate-400 text-sm">{streamer.category}</p>
          </div>
        </div>

        <Button
          className="w-full bg-purple-600 hover:bg-purple-700 group-hover:shadow-lg group-hover:shadow-purple-500/20 transition-all"
          onClick={handleWatchStream}
        >
          {streamer.isLive ? (
            <>
              <ExternalLink className="w-4 h-4 mr-2" />
              Regarder le stream
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 mr-2" />
              Hors ligne
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
