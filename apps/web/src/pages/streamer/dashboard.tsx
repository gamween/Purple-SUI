import { Link, useNavigate } from "react-router-dom";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { Sidebar } from "../../components/dashboard/Sidebar";
import { StatsCard } from "../../components/dashboard/StatsCard";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { ProtectedRoute } from "../../components/auth/ProtectedRoute";
import { 
  Zap, 
  Coins, 
  TrendingUp, 
  Radio,
  ArrowUpRight,
  MessageSquare,
  Eye,
  Activity
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const recentActivity = [
  {
    id: "1",
    type: "donation",
    message: "Nouvelle donation de 15 SUI sur votre stream",
    time: "Il y a 5 min",
    icon: Coins,
    color: "text-green-400",
    bg: "bg-green-500/10"
  },
  {
    id: "2",
    type: "message",
    message: "GameDev Studio vous a envoyé un message",
    time: "Il y a 15 min",
    icon: MessageSquare,
    color: "text-purple-400",
    bg: "bg-purple-500/10"
  },
  {
    id: "3",
    type: "bounty",
    message: "Nouvelle bounty disponible dans le marketplace",
    time: "Il y a 1h",
    icon: Zap,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10"
  },
  {
    id: "4",
    type: "offer",
    message: "Primacy Team vous a envoyé une offre de bounty",
    time: "Il y a 2h",
    icon: Activity,
    color: "text-blue-400",
    bg: "bg-blue-500/10"
  },
];

const activeBounties = [
  {
    id: "1",
    title: "Tournoi Primacy TCG",
    dev: "Primacy Team",
    donations: 145.8,
    myShare: 87.5,
    target: 200,
    viewers: 2100,
    status: "active"
  },
];

const weeklyData = [
  { day: "Lun", earnings: 8 },
  { day: "Mar", earnings: 12 },
  { day: "Mer", earnings: 15 },
  { day: "Jeu", earnings: 22 },
  { day: "Ven", earnings: 28 },
  { day: "Sam", earnings: 35 },
  { day: "Dim", earnings: 42 },
];

const featuredBounties = [
  {
    id: "m1",
    title: "Promotion Sui 8192",
    description: "Stream de 3 heures minimum du jeu puzzle viral sur Sui",
    amount: 50,
    split: 70,
    duration: "14 jours restants",
    status: "available" as const,
    dev: "GameDev Studio",
    devAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=GD",
    category: "Gaming",
  },
  {
    id: "m2",
    title: "Test Cosmocadia MMORPG",
    description: "Présentation du nouveau MMORPG sur Sui avec trading NFT",
    amount: 80,
    split: 75,
    duration: "7 jours restants",
    status: "available" as const,
    dev: "Cosmocadia Team",
    devAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=CT",
    category: "Gaming",
  },
  {
    id: "m3",
    title: "Lancement NFT Genesis",
    description: "Stream de découverte et mint de la collection Genesis",
    amount: 45,
    split: 65,
    duration: "5 jours restants",
    status: "available" as const,
    dev: "NFT Creators",
    devAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=NC",
    category: "NFT",
  },
];

export default function StreamerDashboard() {
  const navigate = useNavigate();
  
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
            {/* Welcome Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-white mb-2">Dashboard Streamer</h1>
                <p className="text-slate-400">Bienvenue ! Voici un aperçu de vos activités</p>
              </div>
              <Button className="gap-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
                <Radio className="w-5 h-5" />
                Go Live
              </Button>
            </div>

            {/* KPI Cards with trends */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatsCard
                title="Revenus cette semaine"
                value="42 SUI"
                icon={<Coins className="w-5 h-5" />}
                trend="+35% vs semaine dernière"
                trendUp={true}
                iconColor="text-green-400"
                iconBg="bg-green-500/20"
              />
              <StatsCard
                title="Bounties actives"
                value="1"
                icon={<Zap className="w-5 h-5" />}
                trend="En cours"
                trendUp={true}
                iconColor="text-purple-400"
                iconBg="bg-purple-500/20"
              />
              <StatsCard
                title="Viewers moyens"
                value="2.1K"
                icon={<Eye className="w-5 h-5" />}
                trend="+18% d'engagement"
                trendUp={true}
                iconColor="text-cyan-400"
                iconBg="bg-cyan-500/20"
              />
              <StatsCard
                title="Opportunités"
                value="5"
                icon={<TrendingUp className="w-5 h-5" />}
                trend="Disponibles maintenant"
                trendUp={true}
                iconColor="text-blue-400"
                iconBg="bg-blue-500/20"
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Weekly Performance Chart - 2 cols */}
              <Card className="lg:col-span-2 bg-slate-900/50 border-slate-800 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-white mb-1">Revenus hebdomadaires</h3>
                    <p className="text-slate-400 text-sm">Gains des 7 derniers jours</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-slate-700" asChild>
                    <Link to="/streamer/stats">
                      Voir plus
                      <ArrowUpRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={weeklyData}>
                    <defs>
                      <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="day" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "#1e293b", 
                        border: "1px solid #334155",
                        borderRadius: "8px"
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="earnings" 
                      stroke="#10b981" 
                      fillOpacity={1}
                      fill="url(#colorEarnings)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>

              {/* Recent Activity - 1 col */}
              <Card className="bg-slate-900/50 border-slate-800 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white">Activité récente</h3>
                  <Activity className="w-5 h-5 text-slate-400" />
                </div>
                <div className="space-y-4">
                  {recentActivity.map((activity) => {
                    const Icon = activity.icon;
                    return (
                      <div key={activity.id} className="flex items-start gap-3">
                        <div className={`${activity.bg} w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-5 h-5 ${activity.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-300 text-sm">{activity.message}</p>
                          <p className="text-slate-500 text-xs mt-1">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Button variant="ghost" className="w-full mt-4 text-slate-400 hover:text-white">
                  Voir toutes les activités
                </Button>
              </Card>
            </div>

            {/* Active Bounties Overview */}
            {activeBounties.length > 0 && (
              <Card className="bg-slate-900/50 border-slate-800 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-white mb-1">Vos bounties actives</h3>
                    <p className="text-slate-400 text-sm">Suivez vos performances en temps réel</p>
                  </div>
                  <Button variant="outline" className="border-slate-700" asChild>
                    <Link to="/streamer/bounties">
                      Voir toutes
                      <ArrowUpRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>

                <div className="space-y-4">
                  {activeBounties.map((bounty) => (
                    <div 
                      key={bounty.id}
                      className="p-4 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-white">{bounty.title}</h4>
                            <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                              ACTIVE
                            </Badge>
                          </div>
                          <p className="text-slate-400 text-sm">Dev: {bounty.dev}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-slate-500 text-xs mb-1">Donations totales</p>
                          <p className="text-green-400">{bounty.donations} SUI</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs mb-1">Votre part</p>
                          <p className="text-purple-400">{bounty.myShare} SUI</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs mb-1">Viewers</p>
                          <p className="text-cyan-400">{bounty.viewers}</p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-600 to-cyan-600 rounded-full transition-all"
                          style={{ width: `${(bounty.donations / bounty.target) * 100}%` }}
                        />
                      </div>
                      <p className="text-slate-500 text-xs mt-2">
                        {((bounty.donations / bounty.target) * 100).toFixed(0)}% de l'objectif ({bounty.target} SUI)
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Featured Bounties from Marketplace */}
            <Card className="bg-slate-900/50 border-slate-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-white mb-1">Bounties en vedette</h3>
                  <p className="text-slate-400 text-sm">Opportunités sélectionnées pour vous</p>
                </div>
                <Button variant="outline" className="border-slate-700" asChild>
                  <Link to="/streamer/bounties">
                    Voir le marketplace
                    <ArrowUpRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredBounties.map((bounty) => (
                  <div 
                    key={bounty.id}
                    className="p-4 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <img 
                        src={bounty.devAvatar} 
                        alt={bounty.dev}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1">
                        <h4 className="text-white text-sm">{bounty.title}</h4>
                        <p className="text-slate-500 text-xs">{bounty.dev}</p>
                      </div>
                    </div>

                    <p className="text-slate-400 text-sm mb-3 line-clamp-2">
                      {bounty.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div>
                        <p className="text-slate-500 text-xs mb-1">Montant</p>
                        <p className="text-green-400 text-sm">{bounty.amount} SUI</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs mb-1">Votre part</p>
                        <p className="text-purple-400 text-sm">{bounty.split}%</p>
                      </div>
                    </div>

                    <Button 
                      size="sm" 
                      className="w-full bg-purple-600 hover:bg-purple-700 group-hover:scale-105 transition-transform"
                      onClick={() => navigate(`/streamer/bounty/${bounty.id}`)}
                    >
                      Voir les détails
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20 p-6 hover:border-purple-500/40 transition-all cursor-pointer group">
                <Link to="/streamer/bounties" className="block">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Zap className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-white mb-1">Explorer bounties</h4>
                      <p className="text-slate-400 text-sm">Trouvez des opportunités</p>
                    </div>
                  </div>
                </Link>
              </Card>

              <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border-cyan-500/20 p-6 hover:border-cyan-500/40 transition-all cursor-pointer group">
                <Link to="/streamer/messages" className="block">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MessageSquare className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="text-white mb-1">Messages</h4>
                      <p className="text-slate-400 text-sm">Discutez avec les devs</p>
                    </div>
                  </div>
                </Link>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20 p-6 hover:border-blue-500/40 transition-all cursor-pointer group">
                <Link to="/streamer/stats" className="block">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-white mb-1">Statistiques</h4>
                      <p className="text-slate-400 text-sm">Analysez vos revenus</p>
                    </div>
                  </div>
                </Link>
              </Card>
            </div>
          </div>
        </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
