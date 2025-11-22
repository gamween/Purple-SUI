import { Link } from "react-router-dom";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { Sidebar } from "../../components/dashboard/Sidebar";
import { StatsCard } from "../../components/dashboard/StatsCard";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { 
  Zap, 
  Coins, 
  Users, 
  TrendingUp, 
  ArrowUpRight,
  MessageSquare,
  Eye,
  Calendar,
  Activity
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const recentActivity = [
  {
    id: "1",
    type: "donation",
    message: "Nouvelle donation de 15 SUI sur 'Sui 8192 Promo'",
    time: "Il y a 5 min",
    icon: Coins,
    color: "text-green-400",
    bg: "bg-green-500/10"
  },
  {
    id: "2",
    type: "message",
    message: "GamerElite vous a envoyé un message",
    time: "Il y a 15 min",
    icon: MessageSquare,
    color: "text-purple-400",
    bg: "bg-purple-500/10"
  },
  {
    id: "3",
    type: "bounty",
    message: "Bounty 'Cosmocadia MMORPG' a atteint 50 SUI",
    time: "Il y a 1h",
    icon: Zap,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10"
  },
  {
    id: "4",
    type: "streamer",
    message: "StreamerPro a commencé son stream",
    time: "Il y a 2h",
    icon: Activity,
    color: "text-blue-400",
    bg: "bg-blue-500/10"
  },
];

const activeBounties = [
  {
    id: "1",
    title: "Sui 8192 - Jeu puzzle",
    streamer: "StreamerPro",
    donations: 35.5,
    target: 50,
    viewers: 450,
    status: "live"
  },
  {
    id: "2",
    title: "Cosmocadia MMORPG",
    streamer: "GamerElite",
    donations: 52.3,
    target: 80,
    viewers: 820,
    status: "live"
  },
  {
    id: "3",
    title: "Blade Quest RPG",
    streamer: null,
    donations: 0,
    target: 65,
    viewers: 0,
    status: "pending"
  },
];

const weeklyData = [
  { day: "Lun", donations: 12, viewers: 850 },
  { day: "Mar", donations: 18, viewers: 920 },
  { day: "Mer", donations: 25, viewers: 1200 },
  { day: "Jeu", donations: 32, viewers: 1450 },
  { day: "Ven", donations: 45, viewers: 1800 },
  { day: "Sam", donations: 62, viewers: 2300 },
  { day: "Dim", donations: 88, viewers: 2850 },
];

export default function DevDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <DashboardHeader role="dev" />
      
      <div className="flex">
        <Sidebar role="dev" activeItem="dashboard" />
        
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Welcome Header */}
            <div>
              <h1 className="text-white mb-2">Dashboard Développeur</h1>
              <p className="text-slate-400">Bienvenue ! Voici un aperçu de vos activités</p>
            </div>

            {/* KPI Cards with trends */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatsCard
                title="Donations cette semaine"
                value="88 SUI"
                icon={<Coins className="w-5 h-5" />}
                trend="+42% vs semaine dernière"
                trendUp={true}
                iconColor="text-green-400"
                iconBg="bg-green-500/20"
              />
              <StatsCard
                title="Bounties actives"
                value="5"
                icon={<Zap className="w-5 h-5" />}
                trend="+2 cette semaine"
                trendUp={true}
                iconColor="text-purple-400"
                iconBg="bg-purple-500/20"
              />
              <StatsCard
                title="Viewers totaux"
                value="2.8K"
                icon={<Users className="w-5 h-5" />}
                trend="+18% d'engagement"
                trendUp={true}
                iconColor="text-cyan-400"
                iconBg="bg-cyan-500/20"
              />
              <StatsCard
                title="ROI moyen"
                value="+156%"
                icon={<TrendingUp className="w-5 h-5" />}
                trend="+12pts vs mois dernier"
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
                    <h3 className="text-white mb-1">Performance hebdomadaire</h3>
                    <p className="text-slate-400 text-sm">Donations et engagement des 7 derniers jours</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-slate-700" asChild>
                    <Link to="/dev/stats">
                      Voir plus
                      <ArrowUpRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={weeklyData}>
                    <defs>
                      <linearGradient id="colorDonations" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
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
                      dataKey="donations" 
                      stroke="#8b5cf6" 
                      fillOpacity={1}
                      fill="url(#colorDonations)"
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
            <Card className="bg-slate-900/50 border-slate-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-white mb-1">Bounties actives</h3>
                  <p className="text-slate-400 text-sm">Suivez vos bounties en temps réel</p>
                </div>
                <Button variant="outline" className="border-slate-700" asChild>
                  <Link to="/dev/bounties">
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
                          {bounty.status === "live" ? (
                            <Badge className="bg-red-500/10 text-red-400 border-red-500/20">
                              <span className="w-2 h-2 bg-red-400 rounded-full mr-2 animate-pulse" />
                              LIVE
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                              En attente
                            </Badge>
                          )}
                        </div>
                        {bounty.streamer && (
                          <p className="text-slate-400 text-sm">Streamer: {bounty.streamer}</p>
                        )}
                      </div>
                      <Link to={`/dev/bounty/${bounty.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-slate-500 text-xs mb-1">Donations</p>
                        <p className="text-green-400">{bounty.donations} SUI</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs mb-1">Objectif</p>
                        <p className="text-white">{bounty.target} SUI</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs mb-1">Viewers</p>
                        <p className="text-cyan-400">{bounty.viewers}</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full transition-all"
                        style={{ width: `${(bounty.donations / bounty.target) * 100}%` }}
                      />
                    </div>
                    <p className="text-slate-500 text-xs mt-2">
                      {((bounty.donations / bounty.target) * 100).toFixed(0)}% de l'objectif atteint
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20 p-6 hover:border-purple-500/40 transition-all cursor-pointer group">
                <Link to="/dev/bounties" className="block">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Zap className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-white mb-1">Créer une bounty</h4>
                      <p className="text-slate-400 text-sm">Lancez une nouvelle campagne</p>
                    </div>
                  </div>
                </Link>
              </Card>

              <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border-cyan-500/20 p-6 hover:border-cyan-500/40 transition-all cursor-pointer group">
                <Link to="/dev/streamers" className="block">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Users className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="text-white mb-1">Mes streamers</h4>
                      <p className="text-slate-400 text-sm">Gérez vos partenaires</p>
                    </div>
                  </div>
                </Link>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20 p-6 hover:border-blue-500/40 transition-all cursor-pointer group">
                <Link to="/dev/stats" className="block">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-white mb-1">Statistiques</h4>
                      <p className="text-slate-400 text-sm">Analysez vos performances</p>
                    </div>
                  </div>
                </Link>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
