import { useState } from "react";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { Sidebar } from "../../components/dashboard/Sidebar";
import { StatsCard } from "../../components/dashboard/StatsCard";
import { BountyCard } from "../../components/bounties/BountyCard";
import { CreateBountyModal } from "../../components/dashboard/CreateBountyModal";
import { Button } from "../../components/ui/button";
import { Plus, Coins, Users, Zap } from "lucide-react";

interface Bounty {
  id: string;
  title: string;
  description: string;
  amount: number;
  split: number;
  duration: string;
  status: "active" | "pending" | "completed";
  streamer: string | null;
  streamerAvatar?: string;
  donations: number;
  requirements?: string[];
}

const initialBounties: Bounty[] = [
  {
    id: "1",
    title: "Promotion de Sui 8192 - Jeu puzzle blockchain",
    description: "Stream de 3 heures minimum de Sui 8192, le jeu de puzzle viral sur Sui. Montre les mécaniques de jeu et les NFTs gagnables.",
    amount: 50,
    split: 70,
    duration: "14 jours restants",
    status: "active" as const,
    streamer: "StreamerPro",
    streamerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=streamer1",
    donations: 35.5,
  },
  {
    id: "2",
    title: "Test de Cosmocadia - MMORPG sur Sui",
    description: "Présentation et gameplay du nouveau MMORPG Cosmocadia construit sur Sui, avec focus sur le système de trading NFT",
    amount: 80,
    split: 75,
    duration: "7 jours restants",
    status: "active" as const,
    streamer: "GamerElite",
    streamerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=streamer2",
    donations: 52.3,
  },
  {
    id: "3",
    title: "Tournoi Primacy - Jeu de cartes TCG Sui",
    description: "Organisation d'un tournoi Primacy avec 100 SUI de prize pool. TCG innovant avec vrais NFTs échangeables.",
    amount: 100,
    split: 60,
    duration: "Terminé",
    status: "completed" as const,
    streamer: "CardMasterPro",
    streamerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=cardmaster",
    donations: 145.8,
  },
  {
    id: "4",
    title: "Découverte de Blade Quest sur Sui",
    description: "Présentation du RPG action Blade Quest, avec système de crafting d'armes NFT et combats PvP",
    amount: 65,
    split: 70,
    duration: "21 jours restants",
    status: "pending" as const,
    streamer: null,
    donations: 0,
  },
  {
    id: "5",
    title: "Stream Marathon - OverNight sur Sui",
    description: "Session de 6 heures sur OverNight, le jeu de survie zombie avec économie tokenisée sur Sui",
    amount: 90,
    split: 80,
    duration: "10 jours restants",
    status: "pending" as const,
    streamer: null,
    donations: 0,
  },
];

export default function DevBounties() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "pending" | "completed">("all");
  const [bounties, setBounties] = useState<Bounty[]>(initialBounties);

  const filteredBounties = bounties.filter(
    (bounty) => filter === "all" || bounty.status === filter
  );

  const stats = {
    activeBounties: bounties.filter((b) => b.status === "active").length,
    totalDistributed: bounties.reduce((sum, b) => sum + b.donations, 0),
    activeStreamers: bounties.filter((b) => b.streamer).length,
  };

  const handleCreateBounty = (newBounty: any) => {
    const bounty: Bounty = {
      id: Date.now().toString(),
      title: newBounty.title,
      description: newBounty.description,
      amount: parseFloat(newBounty.amount),
      split: parseInt(newBounty.split),
      duration: newBounty.duration,
      status: "pending",
      streamer: null,
      donations: 0,
      requirements: newBounty.requirements || [],
    };
    
    setBounties(prev => [bounty, ...prev]);
    setShowCreateModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <DashboardHeader role="dev" />
      
      <div className="flex">
        <Sidebar role="dev" activeItem="bounties" />
        
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-white mb-2">Mes Bounties</h1>
                <p className="text-slate-400">Gérez vos sponsorships et suivez leurs performances</p>
              </div>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="gap-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
              >
                <Plus className="w-5 h-5" />
                Créer une bounty
              </Button>
            </div>

            {/* Stats KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard
                title="Bounties actives"
                value={stats.activeBounties}
                icon={<Zap className="w-5 h-5" />}
                trend="+2 ce mois"
                iconColor="text-purple-400"
                iconBg="bg-purple-500/20"
              />
              <StatsCard
                title="SUI distribués"
                value={`${stats.totalDistributed.toFixed(1)} SUI`}
                icon={<Coins className="w-5 h-5" />}
                trend="+12.5% vs mois dernier"
                iconColor="text-cyan-400"
                iconBg="bg-cyan-500/20"
              />
              <StatsCard
                title="Streamers actifs"
                value={stats.activeStreamers}
                icon={<Users className="w-5 h-5" />}
                trend="3 collaborations"
                iconColor="text-green-400"
                iconBg="bg-green-500/20"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
              <span className="text-slate-400 text-sm">Filtrer par:</span>
              {(["all", "active", "pending", "completed"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    filter === status
                      ? "bg-purple-600 text-white"
                      : "bg-slate-800/50 text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  {status === "all" ? "Toutes" : status === "active" ? "Actives" : status === "pending" ? "En attente" : "Terminées"}
                </button>
              ))}
            </div>

            {/* Bounties Grid */}
            {filteredBounties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBounties.map((bounty) => (
                  <BountyCard key={bounty.id} bounty={bounty} userRole="dev" />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-xl">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-slate-600" />
                </div>
                <h3 className="text-white mb-2">Aucune bounty {filter !== "all" && filter}</h3>
                <p className="text-slate-400 mb-6">
                  {filter === "all" 
                    ? "Créez votre première bounty pour commencer"
                    : `Aucune bounty ${filter} pour le moment`}
                </p>
                {filter === "all" && (
                  <Button
                    onClick={() => setShowCreateModal(true)}
                    className="gap-2 bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="w-5 h-5" />
                    Créer une bounty
                  </Button>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      <CreateBountyModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateBounty}
      />
    </div>
  );
}