import { useState } from "react";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { Sidebar } from "../../components/dashboard/Sidebar";
import { StatsCard } from "../../components/dashboard/StatsCard";
import { BountyCard } from "../../components/bounties/BountyCard";
import { Button } from "../../components/ui/button";
import { ProtectedRoute } from "../../components/auth/ProtectedRoute";
import { Coins, Award, TrendingUp, Radio } from "lucide-react";

const mockMarketplaceBounties = [
  {
    id: "1",
    title: "Promotion de mon jeu Valorant",
    description: "Stream de 3 heures minimum sur Valorant avec mention du jeu",
    amount: 50,
    split: 70,
    duration: "14 jours restants",
    status: "available" as const,
    dev: "GameDev Studio",
    devAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=GD",
    category: "Gaming",
  },
  {
    id: "2",
    title: "Test de mon application Web3",
    description: "Présentation et test en direct de l'application",
    amount: 30,
    split: 80,
    duration: "7 jours restants",
    status: "available" as const,
    dev: "Web3 Builders",
    devAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=WB",
    category: "Tech",
  },
];

const mockActiveBounties = [
  {
    id: "3",
    title: "Tournoi sponsorisé League of Legends",
    description: "Organisation d'un tournoi avec 100 SUI de prize pool",
    amount: 100,
    split: 60,
    duration: "5 jours restants",
    status: "active" as const,
    dev: "Esports Pro",
    devAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=EP",
    donations: 145.8,
    myShare: 87.5,
  },
];

export default function StreamerDashboard() {
  const [activeTab, setActiveTab] = useState<"marketplace" | "active" | "history">("marketplace");

  const stats = {
    totalReceived: 287.5,
    activeBounties: 1,
    avgDonations: 145.8,
  };

  return (
    <ProtectedRoute 
      message="Connectez votre wallet pour accéder au dashboard streamer"
      requireTwitch={true}
      allowedRoles={['streamer']}
    >
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <DashboardHeader role="streamer" />
      
      <div className="flex">
        <Sidebar role="streamer" activeItem="dashboard" />
        
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-white mb-2">Marketplace des Bounties</h1>
                <p className="text-slate-400">Découvrez les opportunités de sponsoring disponibles</p>
              </div>
              <Button className="gap-2 bg-purple-600 hover:bg-purple-700">
                <Radio className="w-5 h-5" />
                Go Live
              </Button>
            </div>

            {/* Stats KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard
                title="Total reçu"
                value={`${stats.totalReceived} SUI`}
                icon={<Coins className="w-5 h-5" />}
                trend="+15% ce mois"
                iconColor="text-purple-400"
                iconBg="bg-purple-500/20"
              />
              <StatsCard
                title="Bounties actives"
                value={stats.activeBounties}
                icon={<Award className="w-5 h-5" />}
                trend="1 en cours"
                iconColor="text-cyan-400"
                iconBg="bg-cyan-500/20"
              />
              <StatsCard
                title="Avg donations"
                value={`${stats.avgDonations} SUI`}
                icon={<TrendingUp className="w-5 h-5" />}
                trend="Par bounty"
                iconColor="text-green-400"
                iconBg="bg-green-500/20"
              />
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-3 border-b border-slate-800">
              {([
                { key: "marketplace", label: "Marketplace" },
                { key: "active", label: `Mes Bounties (${mockActiveBounties.length})` },
                { key: "history", label: "Historique" },
              ] as const).map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-4 py-3 text-sm transition-all relative ${
                    activeTab === key
                      ? "text-white"
                      : "text-slate-400 hover:text-slate-300"
                  }`}
                >
                  {label}
                  {activeTab === key && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500" />
                  )}
                </button>
              ))}
            </div>

            {/* Content */}
            {activeTab === "marketplace" && (
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-slate-400 text-sm">Filtrer:</span>
                  <select className="px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 text-sm">
                    <option>Toutes catégories</option>
                    <option>Gaming</option>
                    <option>Tech</option>
                    <option>Just Chatting</option>
                  </select>
                  <select className="px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 text-sm">
                    <option>Tous montants</option>
                    <option>0-50 SUI</option>
                    <option>50-100 SUI</option>
                    <option>100+ SUI</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockMarketplaceBounties.map((bounty) => (
                    <BountyCard key={bounty.id} bounty={bounty} userRole="streamer" />
                  ))}
                </div>
              </div>
            )}

            {activeTab === "active" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockActiveBounties.map((bounty) => (
                  <BountyCard key={bounty.id} bounty={bounty} userRole="streamer" />
                ))}
              </div>
            )}

            {activeTab === "history" && (
              <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-xl">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-slate-600" />
                </div>
                <h3 className="text-white mb-2">Aucun historique</h3>
                <p className="text-slate-400">Vos bounties complétées apparaîtront ici</p>
              </div>
            )}
          </div>
        </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
