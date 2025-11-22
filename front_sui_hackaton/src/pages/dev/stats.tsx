import { useState } from "react";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { Sidebar } from "../../components/dashboard/Sidebar";
import { StatsCard } from "../../components/dashboard/StatsCard";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { TrendingUp, Users, Coins, Zap, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";

const donationsData = [
  { month: "Jan", donations: 120 },
  { month: "Fév", donations: 150 },
  { month: "Mar", donations: 180 },
  { month: "Avr", donations: 220 },
  { month: "Mai", donations: 280 },
  { month: "Juin", donations: 310 },
];

const bountiesPerformance = [
  { name: "Valorant Promo", donations: 145, views: 2500 },
  { name: "Web3 App Test", donations: 89, views: 1800 },
  { name: "League Tournoi", donations: 210, views: 3200 },
  { name: "NFT Launch", donations: 156, views: 2100 },
];

const streamerDistribution = [
  { name: "StreamerPro", value: 145, color: "#8b5cf6" },
  { name: "GamerElite", value: 210, color: "#06b6d4" },
  { name: "TechNinja", value: 89, color: "#10b981" },
  { name: "CodeMaster", value: 156, color: "#f59e0b" },
];

const topStreamers = [
  { rank: 1, name: "GamerElite", donations: 210, followers: "12.5K", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=elite" },
  { rank: 2, name: "StreamerPro", donations: 145, followers: "8.2K", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=pro" },
  { rank: 3, name: "CodeMaster", donations: 156, followers: "6.8K", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=master" },
  { rank: 4, name: "TechNinja", donations: 89, followers: "5.3K", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ninja" },
];

export default function DevStats() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">("30d");

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <DashboardHeader role="dev" />
      
      <div className="flex">
        <Sidebar role="dev" activeItem="stats" />
        
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-white mb-2">Statistiques & Analytics</h1>
                <p className="text-slate-400">Analysez les performances de vos bounties</p>
              </div>
              
              {/* Time Range Selector */}
              <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-800 rounded-lg p-1">
                {(["7d", "30d", "90d", "1y"] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-2 rounded-md text-sm transition-all ${
                      timeRange === range
                        ? "bg-purple-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {range === "7d" ? "7 jours" : range === "30d" ? "30 jours" : range === "90d" ? "90 jours" : "1 an"}
                  </button>
                ))}
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatsCard
                title="Total donations"
                value="1,310 SUI"
                icon={<Coins className="w-5 h-5" />}
                trend="+18.2% vs mois dernier"
                trendUp={true}
                iconColor="text-green-400"
                iconBg="bg-green-500/20"
              />
              <StatsCard
                title="Bounties actives"
                value="8"
                icon={<Zap className="w-5 h-5" />}
                trend="+2 cette semaine"
                trendUp={true}
                iconColor="text-purple-400"
                iconBg="bg-purple-500/20"
              />
              <StatsCard
                title="Streamers partenaires"
                value="12"
                icon={<Users className="w-5 h-5" />}
                trend="+3 ce mois"
                trendUp={true}
                iconColor="text-cyan-400"
                iconBg="bg-cyan-500/20"
              />
              <StatsCard
                title="Portée totale"
                value="42.8K"
                icon={<TrendingUp className="w-5 h-5" />}
                trend="+25% vs mois dernier"
                trendUp={true}
                iconColor="text-blue-400"
                iconBg="bg-blue-500/20"
              />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Donations Over Time */}
              <Card className="bg-slate-900/50 border-slate-800 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-white mb-1">Évolution des donations</h3>
                    <p className="text-slate-400 text-sm">Donations en SUI par mois</p>
                  </div>
                  <div className="flex items-center gap-1 text-green-400 text-sm">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>+28%</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={donationsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "#1e293b", 
                        border: "1px solid #334155",
                        borderRadius: "8px"
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="donations" 
                      stroke="#8b5cf6" 
                      strokeWidth={3}
                      dot={{ fill: "#8b5cf6", r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              {/* Streamer Distribution */}
              <Card className="bg-slate-900/50 border-slate-800 p-6">
                <div className="mb-6">
                  <h3 className="text-white mb-1">Distribution par streamer</h3>
                  <p className="text-slate-400 text-sm">Répartition des donations</p>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={streamerDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {streamerDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "#1e293b", 
                        border: "1px solid #334155",
                        borderRadius: "8px"
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Bounties Performance */}
            <Card className="bg-slate-900/50 border-slate-800 p-6">
              <div className="mb-6">
                <h3 className="text-white mb-1">Performance des bounties</h3>
                <p className="text-slate-400 text-sm">Comparaison donations vs portée</p>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={bountiesPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#1e293b", 
                      border: "1px solid #334155",
                      borderRadius: "8px"
                    }}
                  />
                  <Legend />
                  <Bar dataKey="donations" fill="#8b5cf6" name="Donations (SUI)" />
                  <Bar dataKey="views" fill="#06b6d4" name="Vues" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Top Streamers Table */}
            <Card className="bg-slate-900/50 border-slate-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-white mb-1">Top Streamers</h3>
                  <p className="text-slate-400 text-sm">Vos meilleurs partenaires</p>
                </div>
                <Button variant="outline" className="border-slate-700 hover:border-slate-600" asChild>
                  <Link to="/dev/streamers">Voir tous</Link>
                </Button>
              </div>
              
              <div className="space-y-4">
                {topStreamers.map((streamer) => (
                  <div 
                    key={streamer.rank}
                    className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-purple-500/20 rounded-lg">
                      <span className="text-purple-400 font-semibold">#{streamer.rank}</span>
                    </div>
                    
                    <img 
                      src={streamer.avatar} 
                      alt={streamer.name}
                      className="w-10 h-10 rounded-full"
                    />
                    
                    <div className="flex-1">
                      <p className="text-white">{streamer.name}</p>
                      <p className="text-slate-400 text-sm">{streamer.followers} followers</p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-green-400">{streamer.donations} SUI</p>
                      <p className="text-slate-500 text-sm">Total donations</p>
                    </div>
                    
                    <Button variant="ghost" size="sm" className="hover:bg-slate-700">
                      <ArrowUpRight className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}