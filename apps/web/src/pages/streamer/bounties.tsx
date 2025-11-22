import { useState } from "react";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { Sidebar } from "../../components/dashboard/Sidebar";
import { StatsCard } from "../../components/dashboard/StatsCard";
import { BountyCard } from "../../components/bounties/BountyCard";
import { Coins, Award, TrendingUp, Search } from "lucide-react";
import { Input } from "../../components/ui/input";

interface Bounty {
  id: string;
  title: string;
  description: string;
  amount: number;
  split: number;
  duration: string;
  status: "available" | "active" | "completed";
  dev: string;
  devAvatar: string;
  category: string;
  donations?: number;
  myShare?: number;
}

const marketplaceBounties: Bounty[] = [
  {
    id: "m1",
    title: "Promotion de Sui 8192 - Jeu puzzle blockchain",
    description: "Stream de 3 heures minimum de Sui 8192, le jeu de puzzle viral sur Sui. Montre les mécaniques de jeu et les NFTs gagnables.",
    amount: 50,
    split: 70,
    duration: "14 jours restants",
    status: "available",
    dev: "GameDev Studio",
    devAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=GD",
    category: "Gaming",
  },
  {
    id: "m2",
    title: "Test de Cosmocadia - MMORPG sur Sui",
    description: "Présentation et gameplay du nouveau MMORPG Cosmocadia construit sur Sui, avec focus sur le système de trading NFT",
    amount: 80,
    split: 75,
    duration: "7 jours restants",
    status: "available",
    dev: "Cosmocadia Team",
    devAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=CT",
    category: "Gaming",
  },
  {
    id: "m3",
    title: "Découverte de Blade Quest sur Sui",
    description: "Présentation du RPG action Blade Quest, avec système de crafting d'armes NFT et combats PvP",
    amount: 65,
    split: 70,
    duration: "21 jours restants",
    status: "available",
    dev: "Blade Studios",
    devAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=BS",
    category: "Gaming",
  },
  {
    id: "m4",
    title: "Test de mon application Web3 DeFi",
    description: "Présentation et test en direct de l'application de trading DeFi sur Sui",
    amount: 30,
    split: 80,
    duration: "10 jours restants",
    status: "available",
    dev: "Web3 Builders",
    devAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=WB",
    category: "Tech",
  },
  {
    id: "m5",
    title: "Lancement NFT Collection Genesis",
    description: "Stream de découverte et mint de la collection Genesis sur Sui, avec giveaways pour la communauté",
    amount: 45,
    split: 65,
    duration: "5 jours restants",
    status: "available",
    dev: "NFT Creators",
    devAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=NC",
    category: "NFT",
  },
];

const activeBounties: Bounty[] = [
  {
    id: "a1",
    title: "Tournoi sponsorisé Primacy - TCG Sui",
    description: "Organisation d'un tournoi Primacy avec 100 SUI de prize pool. TCG innovant avec vrais NFTs échangeables.",
    amount: 100,
    split: 60,
    duration: "5 jours restants",
    status: "active",
    dev: "Primacy Team",
    devAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=PT",
    category: "Gaming",
    donations: 145.8,
    myShare: 87.5,
  },
];

const completedBounties: Bounty[] = [
  {
    id: "c1",
    title: "Stream Marathon - OverNight sur Sui",
    description: "Session de 6 heures sur OverNight, le jeu de survie zombie avec économie tokenisée sur Sui",
    amount: 90,
    split: 80,
    duration: "Terminé il y a 3 jours",
    status: "completed",
    dev: "OverNight Dev",
    devAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=OD",
    category: "Gaming",
    donations: 98.5,
    myShare: 78.8,
  },
  {
    id: "c2",
    title: "Découverte Walrus Protocol",
    description: "Présentation du protocole de stockage décentralisé Walrus sur Sui",
    amount: 40,
    split: 75,
    duration: "Terminé il y a 1 semaine",
    status: "completed",
    dev: "Walrus Team",
    devAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=WT",
    category: "Tech",
    donations: 52.3,
    myShare: 39.2,
  },
];

export default function StreamerBounties() {
  const [activeTab, setActiveTab] = useState<"marketplace" | "active" | "completed">("marketplace");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const stats = {
    activeBounties: activeBounties.length,
    totalEarned: completedBounties.reduce((sum, b) => sum + (b.myShare || 0), 0) + 
                 activeBounties.reduce((sum, b) => sum + (b.myShare || 0), 0),
    availableOpportunities: marketplaceBounties.length,
  };

  const getBountiesByTab = () => {
    switch (activeTab) {
      case "marketplace":
        return marketplaceBounties;
      case "active":
        return activeBounties;
      case "completed":
        return completedBounties;
      default:
        return [];
    }
  };

  const filteredBounties = getBountiesByTab().filter((bounty) => {
    const matchesSearch = bounty.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bounty.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || bounty.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <DashboardHeader role="streamer" />
      
      <div className="flex">
        <Sidebar role="streamer" activeItem="bounties" />
        
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-white mb-2">Bounties & Opportunités</h1>
              <p className="text-slate-400">Trouvez des sponsorships et gérez vos collaborations</p>
            </div>

            {/* Stats KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard
                title="Bounties actives"
                value={stats.activeBounties}
                icon={<Award className="w-5 h-5" />}
                trend="En cours"
                iconColor="text-purple-400"
                iconBg="bg-purple-500/20"
              />
              <StatsCard
                title="Total gagné"
                value={`${stats.totalEarned.toFixed(1)} SUI`}
                icon={<Coins className="w-5 h-5" />}
                trend="+18% vs mois dernier"
                trendUp={true}
                iconColor="text-green-400"
                iconBg="bg-green-500/20"
              />
              <StatsCard
                title="Opportunités disponibles"
                value={stats.availableOpportunities}
                icon={<TrendingUp className="w-5 h-5" />}
                trend="Dans le marketplace"
                iconColor="text-cyan-400"
                iconBg="bg-cyan-500/20"
              />
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-3 border-b border-slate-800">
              {[
                { key: "marketplace" as const, label: `Marketplace (${marketplaceBounties.length})` },
                { key: "active" as const, label: `Mes Bounties (${activeBounties.length})` },
                { key: "completed" as const, label: `Historique (${completedBounties.length})` },
              ].map(({ key, label }) => (
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

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Rechercher une bounty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-900 border-slate-800 text-white"
                />
              </div>
              <select 
                className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 text-sm"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">Toutes catégories</option>
                <option value="Gaming">Gaming</option>
                <option value="Tech">Tech</option>
                <option value="NFT">NFT</option>
              </select>
              <select className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 text-sm">
                <option>Tous montants</option>
                <option>0-50 SUI</option>
                <option>50-100 SUI</option>
                <option>100+ SUI</option>
              </select>
            </div>

            {/* Bounties Grid */}
            {filteredBounties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBounties.map((bounty) => (
                  <BountyCard 
                    key={bounty.id} 
                    bounty={bounty} 
                    userRole="streamer"
                    context={activeTab}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-xl">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-slate-600" />
                </div>
                <h3 className="text-white mb-2">
                  {searchQuery || categoryFilter !== "all" 
                    ? "Aucune bounty trouvée" 
                    : `Aucune bounty ${activeTab}`}
                </h3>
                <p className="text-slate-400">
                  {searchQuery || categoryFilter !== "all"
                    ? "Essayez de modifier vos filtres de recherche"
                    : activeTab === "marketplace" 
                      ? "Les nouvelles opportunités apparaîtront ici"
                      : activeTab === "active"
                      ? "Explorez le marketplace pour trouver des bounties"
                      : "Vos bounties terminées apparaîtront ici"}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
