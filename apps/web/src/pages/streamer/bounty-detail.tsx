import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { Sidebar } from "../../components/dashboard/Sidebar";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card } from "../../components/ui/card";
import { 
  ArrowLeft, 
  MessageSquare, 
  Clock, 
  Coins, 
  Users,
  CheckCircle2,
  Calendar,
  TrendingUp,
  Zap,
  AlertCircle
} from "lucide-react";
import { useNotifications } from "../../lib/NotificationContext";
import { toast } from "sonner";

// Mock data - à remplacer par des vraies données de l'API
const allBounties = {
  "m1": {
    id: "m1",
    title: "Promotion Sui 8192 - Jeu puzzle blockchain",
    description: "Stream de 3 heures minimum de Sui 8192, le jeu de puzzle viral sur Sui. Montre les mécaniques de jeu et les NFTs gagnables.",
    longDescription: "Sui 8192 est un jeu de puzzle innovant construit sur la blockchain Sui. Nous recherchons des streamers passionnés pour présenter notre jeu à leur communauté. Le stream doit inclure une démonstration complète des mécaniques de jeu, du système de NFTs, et de l'expérience utilisateur Web3.",
    amount: 50,
    split: 70,
    duration: "14 jours restants",
    status: "available" as const,
    dev: "GameDev Studio",
    devAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=GD",
    category: "Gaming",
    requirements: [
      "Stream de minimum 3 heures en une seule session",
      "Mention du jeu dans le titre du stream et la description",
      "Explication détaillée des mécaniques blockchain du jeu",
      "Au moins 2 posts sur les réseaux sociaux (Twitter/X, Discord)",
      "Répondre aux questions des viewers sur le jeu",
      "Enregistrement du VOD disponible pendant 7 jours minimum"
    ],
    deliverables: [
      "Lien du stream (live + VOD)",
      "Screenshots des posts sur réseaux sociaux",
      "Statistiques du stream (viewers moyens, peak viewers, chat activity)"
    ],
    targetAudience: "Joueurs casual et semi-hardcore intéressés par les jeux puzzle et le Web3",
    estimatedViewers: "500-2000",
    deadline: "2025-12-06",
    technicalRequirements: [
      "Connexion stable pour streamer en 1080p minimum",
      "Wallet Sui configuré pour démonstration",
      "Compte de test fourni avec des tokens"
    ]
  },
  "m2": {
    id: "m2",
    title: "Test Cosmocadia - MMORPG sur Sui",
    description: "Présentation du nouveau MMORPG Cosmocadia sur Sui avec trading NFT",
    longDescription: "Cosmocadia est un MMORPG next-gen avec une économie entièrement on-chain. Nous cherchons des streamers pour une session de découverte approfondie.",
    amount: 80,
    split: 75,
    duration: "7 jours restants",
    status: "available" as const,
    dev: "Cosmocadia Team",
    devAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=CT",
    category: "Gaming",
    requirements: [
      "Stream de 4 heures minimum",
      "Test du système de crafting",
      "Démonstration du trading NFT",
      "Participation à au moins un combat PvP",
      "Tour complet du monde du jeu"
    ],
    deliverables: [
      "VOD du stream complet",
      "Feedback détaillé sur l'expérience",
      "Captures d'écran des meilleurs moments"
    ],
    targetAudience: "Gamers MMO et collectionneurs NFT",
    estimatedViewers: "1000-3000",
    deadline: "2025-11-29",
    technicalRequirements: [
      "PC avec GPU décent (GTX 1060 minimum)",
      "16GB RAM minimum",
      "Wallet Sui avec accès testnet"
    ]
  },
  "m3": {
    id: "m3",
    title: "Lancement NFT Genesis",
    description: "Stream de découverte et mint de la collection Genesis",
    longDescription: "Découvrez notre collection NFT Genesis, la première collection d'art génératif sur Sui avec utilités uniques.",
    amount: 45,
    split: 65,
    duration: "5 jours restants",
    status: "available" as const,
    dev: "NFT Creators",
    devAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=NC",
    category: "NFT",
    requirements: [
      "Stream de 2 heures minimum pendant le mint",
      "Mint de 3 NFTs en direct",
      "Explication des utilités et roadmap",
      "Session Q&A avec la communauté"
    ],
    deliverables: [
      "Lien du stream",
      "NFTs mintés visible on-chain",
      "Post-recap sur les réseaux"
    ],
    targetAudience: "Collectionneurs NFT et early adopters",
    estimatedViewers: "300-1000",
    deadline: "2025-11-27",
    technicalRequirements: [
      "Wallet Sui configuré",
      "Fonds suffisants pour les mint (remboursés)"
    ]
  },
  "a1": {
    id: "a1",
    title: "Tournoi Primacy TCG",
    description: "Organisation d'un tournoi Primacy avec 100 SUI de prize pool",
    longDescription: "Organisez et streamez un tournoi compétitif de Primacy, le jeu de cartes TCG sur Sui.",
    amount: 100,
    split: 60,
    duration: "5 jours restants",
    status: "active" as const,
    dev: "Primacy Team",
    devAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=PT",
    category: "Gaming",
    donations: 145.8,
    myShare: 87.5,
    requirements: [
      "Organisation du tournoi avec minimum 8 participants",
      "Stream de 5 heures pour toute la durée du tournoi",
      "Distribution du prize pool aux gagnants",
      "Promotion du tournoi 3 jours avant"
    ],
    deliverables: [
      "VOD complet du tournoi",
      "Résultats et classement",
      "Preuves de distribution du prize pool"
    ],
    targetAudience: "Joueurs compétitifs TCG",
    estimatedViewers: "1500-3000",
    deadline: "2025-11-27",
    technicalRequirements: [
      "Setup pour gérer le tournoi",
      "Discord pour coordination"
    ]
  }
};

export default function StreamerBountyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [accepted, setAccepted] = useState(false);

  const bounty = id ? allBounties[id as keyof typeof allBounties] : null;

  if (!bounty) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <DashboardHeader role="streamer" />
        <div className="flex">
          <Sidebar role="streamer" activeItem="bounties" />
          <main className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center py-16">
                <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h1 className="text-white text-2xl mb-2">Bounty introuvable</h1>
                <p className="text-slate-400 mb-6">Cette bounty n'existe pas ou a été supprimée.</p>
                <Button onClick={() => navigate("/streamer/bounties")}>
                  Retour aux bounties
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const statusColors = {
    active: "bg-green-500/10 text-green-400 border-green-500/20",
    available: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  };

  const handleShowInterest = () => {
    setAccepted(true);
    
    // Naviguer vers la messagerie
    navigate(`/streamer/messages?bountyId=${bounty.id}&dev=${bounty.dev}`);
    
    // Ajouter une notification
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

    toast.success("Message envoyé au développeur !");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <DashboardHeader role="streamer" />
      
      <div className="flex">
        <Sidebar role="streamer" activeItem="bounties" />
        
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>

            {/* Header Card */}
            <Card className="bg-slate-900/50 border-slate-800 p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className={statusColors[bounty.status as keyof typeof statusColors]}>
                      {bounty.status === "active" ? "Active" : "Disponible"}
                    </Badge>
                    <Badge variant="outline" className="border-slate-700 text-slate-400">
                      {bounty.category}
                    </Badge>
                  </div>
                  <h1 className="text-white text-3xl mb-3">{bounty.title}</h1>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <img 
                        src={bounty.devAvatar} 
                        alt={bounty.dev}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-slate-300">{bounty.dev}</span>
                    </div>
                    <span className="text-slate-500">•</span>
                    <div className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-4 h-4" />
                      <span>{bounty.duration}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Coins className="w-5 h-5 text-green-400" />
                    <span className="text-slate-400 text-sm">Montant total</span>
                  </div>
                  <p className="text-white text-2xl font-bold">{bounty.amount} SUI</p>
                </div>
                <div className="bg-slate-800/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                    <span className="text-slate-400 text-sm">Votre part</span>
                  </div>
                  <p className="text-white text-2xl font-bold">{bounty.split}%</p>
                  <p className="text-slate-500 text-xs">= {(bounty.amount * bounty.split / 100).toFixed(1)} SUI</p>
                </div>
                <div className="bg-slate-800/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-cyan-400" />
                    <span className="text-slate-400 text-sm">Viewers estimés</span>
                  </div>
                  <p className="text-white text-2xl font-bold">{bounty.estimatedViewers}</p>
                </div>
              </div>

              {/* Performance if active */}
              {bounty.status === "active" && bounty.donations && (
                <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-green-400 font-semibold">Donations actuelles</span>
                    <span className="text-white text-lg">{bounty.donations} SUI</span>
                  </div>
                  {bounty.myShare && (
                    <p className="text-slate-400 text-sm">
                      Votre part actuelle: <span className="text-green-400 font-semibold">{bounty.myShare} SUI</span>
                    </p>
                  )}
                </div>
              )}
            </Card>

            {/* Description */}
            <Card className="bg-slate-900/50 border-slate-800 p-6">
              <h2 className="text-white text-xl mb-4">Description détaillée</h2>
              <p className="text-slate-300 leading-relaxed mb-4">{bounty.longDescription}</p>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Users className="w-4 h-4" />
                <span>Public cible: {bounty.targetAudience}</span>
              </div>
            </Card>

            {/* Requirements */}
            <Card className="bg-slate-900/50 border-slate-800 p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-6 h-6 text-purple-400" />
                <h2 className="text-white text-xl">Exigences</h2>
              </div>
              <div className="space-y-3">
                {bounty.requirements?.map((req, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-slate-800/30 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-purple-400 text-sm font-semibold">{idx + 1}</span>
                    </div>
                    <p className="text-slate-300 flex-1">{req}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Deliverables */}
            <Card className="bg-slate-900/50 border-slate-800 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-6 h-6 text-cyan-400" />
                <h2 className="text-white text-xl">Livrables attendus</h2>
              </div>
              <div className="space-y-2">
                {bounty.deliverables?.map((deliverable, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <p>{deliverable}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Technical Requirements */}
            {bounty.technicalRequirements && (
              <Card className="bg-slate-900/50 border-slate-800 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-white text-xl">Prérequis techniques</h2>
                </div>
                <div className="space-y-2">
                  {bounty.technicalRequirements.map((req, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-slate-300">
                      <div className="w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0 mt-2" />
                      <p>{req}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Timeline */}
            <Card className="bg-slate-900/50 border-slate-800 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-6 h-6 text-blue-400" />
                <h2 className="text-white text-xl">Timeline</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                  <span className="text-slate-300">Date limite</span>
                  <span className="text-white font-semibold">{new Date(bounty.deadline).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                  <span className="text-slate-300">Temps restant</span>
                  <span className="text-cyan-400 font-semibold">{bounty.duration}</span>
                </div>
              </div>
            </Card>

            {/* Action Button */}
            {bounty.status === "available" && !accepted && (
              <Card className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-500/20 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white text-lg mb-1">Prêt à accepter cette bounty ?</h3>
                    <p className="text-slate-400 text-sm">
                      Assurez-vous d'avoir lu toutes les exigences et prérequis
                    </p>
                  </div>
                  <Button
                    size="lg"
                    onClick={handleShowInterest}
                    className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 gap-2"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Montrer mon intérêt
                  </Button>
                </div>
              </Card>
            )}

            {bounty.status === "active" && (
              <Card className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 border-green-500/20 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white text-lg mb-1">Bounty en cours</h3>
                    <p className="text-slate-400 text-sm">
                      Continuez votre excellent travail ! Les donations affluent.
                    </p>
                  </div>
                  <Button
                    size="lg"
                    onClick={() => navigate("/streamer/stats?bountyId=" + bounty.id)}
                    className="bg-green-600 hover:bg-green-700 gap-2"
                  >
                    <TrendingUp className="w-5 h-5" />
                    Voir les stats
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
