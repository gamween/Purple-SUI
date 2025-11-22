import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { MessageSquare, TrendingUp, Eye, Edit } from "lucide-react";
import { useNotifications } from "../../lib/NotificationContext";

interface BountyCardProps {
  bounty: any;
  userRole: "dev" | "streamer";
  context?: "marketplace" | "active" | "completed" | "default";
}

export function BountyCard({ bounty, userRole, context = "default" }: BountyCardProps) {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const statusColors = {
    active: "bg-green-500/10 text-green-400 border-green-500/20",
    pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    completed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    available: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  };

  const statusLabels = {
    active: "Active",
    pending: "En attente",
    completed: "Terminée",
    available: "Disponible",
  };

  const handleShowInterest = () => {
    // Naviguer vers la messagerie avec le dev
    navigate(`/streamer/messages?bountyId=${bounty.id}&dev=${bounty.dev}`);
    
    // Ajouter une notification pour le dev (simulé côté streamer)
    addNotification({
      type: "message",
      title: "Intérêt exprimé",
      message: `Vous avez montré votre intérêt pour "${bounty.title}"`,
      actionUrl: `/streamer/messages?bountyId=${bounty.id}`,
      metadata: {
        bountyId: bounty.id,
        devId: bounty.dev
      }
    });
  };

  const handleViewStats = () => {
    // Naviguer vers les stats avec le filtre de cette bounty
    navigate(`/streamer/stats?bountyId=${bounty.id}`);
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-white flex-1 mr-2">{bounty.title}</h3>
        <Badge className={statusColors[bounty.status as keyof typeof statusColors]}>
          {statusLabels[bounty.status as keyof typeof statusLabels]}
        </Badge>
      </div>

      {/* Description */}
      <p className="text-slate-400 text-sm mb-4 line-clamp-2">
        {bounty.description}
      </p>

      {/* Avatar & Name */}
      {(bounty.streamer || bounty.dev) && (
        <div className="flex items-center gap-2 mb-4">
          <img
            src={bounty.streamerAvatar || bounty.devAvatar}
            alt=""
            className="w-6 h-6 rounded-full"
          />
          <span className="text-slate-300 text-sm">
            {bounty.streamer || bounty.dev}
          </span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-slate-800/30 rounded-lg">
        <div>
          <p className="text-slate-500 text-xs mb-1">Montant</p>
          <p className="text-white">{bounty.amount} SUI</p>
        </div>
        <div>
          <p className="text-slate-500 text-xs mb-1">Split</p>
          <p className="text-purple-400">{bounty.split}% streamer</p>
        </div>
      </div>

      {/* Donations (if active) */}
      {bounty.donations !== undefined && (
        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="flex items-center justify-between mb-1">
            <span className="text-green-400 text-sm">Donations</span>
            <span className="text-white">{bounty.donations} SUI</span>
          </div>
          {bounty.myShare && (
            <p className="text-slate-400 text-xs">
              Votre part: {bounty.myShare} SUI ({bounty.split}%)
            </p>
          )}
        </div>
      )}

      {/* Duration */}
      <p className="text-slate-500 text-xs mb-4">{bounty.duration}</p>

      {/* Actions */}
      <div className="flex gap-2">
        {userRole === "dev" && (
          <>
            {bounty.status === "pending" && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
              >
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </Button>
            )}
            {bounty.status !== "pending" && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-slate-700 hover:border-slate-600"
                onClick={() => navigate(`/dev/bounty/${bounty.id}`)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Voir détails
              </Button>
            )}
            {bounty.streamer && (
              <Button
                size="sm"
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => navigate("/dev/chat")}
              >
                <MessageSquare className="w-4 h-4" />
              </Button>
            )}
          </>
        )}

        {userRole === "streamer" && bounty.status === "available" && (
          <Button
            size="sm"
            className="flex-1 bg-purple-600 hover:bg-purple-700"
            onClick={context === "marketplace" ? () => navigate(`/streamer/bounty/${bounty.id}`) : handleShowInterest}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            {context === "marketplace" ? "Voir les détails" : "Montrer mon intérêt"}
          </Button>
        )}

        {userRole === "streamer" && bounty.status === "active" && (
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-slate-700 hover:border-slate-600"
            onClick={handleViewStats}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Voir stats
          </Button>
        )}
      </div>
    </div>
  );
}