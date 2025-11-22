import { useState } from "react";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { Sidebar } from "../../components/dashboard/Sidebar";
import { StatsCard } from "../../components/dashboard/StatsCard";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { TrendingUp, Users, Coins, Zap, Eye, ArrowUpRight } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";

const earningsData = [
  { month: "Jan", earnings: 85 },
  { month: "Fév", earnings: 95 },
  { month: "Mar", earnings: 120 },
  { month: "Avr", earnings: 140 },
  { month: "Mai", earnings: 180 },
  { month: "Juin", earnings: 210 },
];

const viewerEngagement = [
  { day: "Lun", viewers: 650, donations: 8 },
  { day: "Mar", viewers: 820, donations: 12 },
  { day: "Mer", viewers: 950, donations: 15 },
  { day: "Jeu", viewers: 1200, donations: 22 },
  { day: "Ven", viewers: 1450, donations: 28 },
  { day: "Sam", viewers: 1850, donations: 35 },
  { day: "Dim", viewers: 2100, donations: 42 },
];

const bountiesRevenue = [
  { name: "Primacy TCG", revenue: 87.5, hours: 6, color: "#8b5cf6" },
  { name: "OverNight", revenue: 78.8, hours: 6, color: "#06b6d4" },
  { name: "Genesis NFT", revenue: 39.2, hours: 3, color: "#10b981" },
  { name: "Walrus Protocol", revenue: 32.5, hours: 2, color: "#f59e0b" },
];

const categoryBreakdown = [
  { name: "Gaming", value: 165, color: "#8b5cf6" },
  { name: "NFT", value: 52, color: "#06b6d4" },
  { name: "Tech", value: 32, color: "#10b981" },
];

const topPerformingStreams = [
  { 
    rank: 1, 
    bounty: "Tournoi Primacy TCG", 
    revenue: 87.5, 
    viewers: 2100,
    duration: "6h",
    date: "Il y a 5 jours"
  },
  { 
    rank: 2, 
    bounty: "OverNight Marathon", 
    revenue: 78.8, 
    viewers: 1850,
    duration: "6h",
    date: "Il y a 1 semaine"
  },
  { 
    rank: 3, 
    bounty: "Genesis Collection Launch", 
    revenue: 39.2, 
    viewers: 1200,
    duration: "3h",
    date: "Il y a 2 semaines"
  },
  { 
    rank: 4, 
    bounty: "Walrus Protocol Demo", 
    revenue: 32.5, 
    viewers: 950,
    duration: "2h",
    date: "Il y a 3 semaines"
  },
];

export default function StreamerStats() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">("30d");

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <DashboardHeader role="streamer" />
      
      <div className="flex">
        <Sidebar role="streamer" activeItem="stats" />
        
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-white mb-2">Statistiques & Performance</h1>
                <p className="text-slate-400">Analysez vos performances et revenus</p>
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
                title="Revenus totaux"
                value="238 SUI"
                icon={<Coins className="w-5 h-5" />}
                trend="+25% vs mois dernier"
                trendUp={true}
                iconColor="text-green-400"
                iconBg="bg-green-500/20"
              />
              <StatsCard
                title="Bounties complétées"
                value="4"
                icon={<Zap className="w-5 h-5" />}
                trend="+2 ce mois"
                trendUp={true}
                iconColor="text-purple-400"
                iconBg="bg-purple-500/20"
              />
              <StatsCard
                title="Viewers moyens"
                value="1.4K"
                icon={<Users className="w-5 h-5" />}
                trend="+18% d'engagement"
                trendUp={true}
                iconColor="text-cyan-400"
                iconBg="bg-cyan-500/20"
              />
              <StatsCard
                title="Taux de conversion"
                value="2.8%"
                icon={<TrendingUp className="w-5 h-5" />}
                trend="+0.5pts vs mois dernier"
                trendUp={true}
                iconColor="text-blue-400"
                iconBg="bg-blue-500/20"
              />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Earnings Over Time */}
              <Card className="bg-slate-900/50 border-slate-800 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-white mb-1">Évolution des revenus</h3>
                    <p className="text-slate-400 text-sm">Revenus en SUI par mois</p>
                  </div>
                  <div className="flex items-center gap-1 text-green-400 text-sm">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>+32%</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={earningsData}>
                    <defs>
                      <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
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

              {/* Category Distribution */}
              <Card className="bg-slate-900/50 border-slate-800 p-6">
                <div className="mb-6">
                  <h3 className="text-white mb-1">Revenus par catégorie</h3>
                  <p className="text-slate-400 text-sm">Répartition de vos gains</p>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryBreakdown.map((entry, index) => (
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

            {/* Viewer Engagement Chart */}
            <Card className="bg-slate-900/50 border-slate-800 p-6">
              <div className="mb-6">
                <h3 className="text-white mb-1">Engagement hebdomadaire</h3>
                <p className="text-slate-400 text-sm">Viewers et donations des 7 derniers jours</p>
              </div>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={viewerEngagement}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="day" stroke="#94a3b8" />
                  <YAxis yAxisId="left" stroke="#94a3b8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#1e293b", 
                      border: "1px solid #334155",
                      borderRadius: "8px"
                    }}
                  />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="viewers" 
                    stroke="#06b6d4" 
                    strokeWidth={3}
                    dot={{ fill: "#06b6d4", r: 5 }}
                    name="Viewers"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="donations" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: "#10b981", r: 5 }}
                    name="Donations (SUI)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Bounties Performance */}
            <Card className="bg-slate-900/50 border-slate-800 p-6">
              <div className="mb-6">
                <h3 className="text-white mb-1">Performance par bounty</h3>
                <p className="text-slate-400 text-sm">Revenus générés par bounty</p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={bountiesRevenue}>
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
                  <Bar dataKey="revenue" name="Revenus (SUI)">
                    {bountiesRevenue.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Top Performing Streams */}
            <Card className="bg-slate-900/50 border-slate-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-white mb-1">Meilleurs streams</h3>
                  <p className="text-slate-400 text-sm">Vos streams les plus performants</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {topPerformingStreams.map((stream) => (
                  <div 
                    key={stream.rank}
                    className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-purple-500/20 rounded-lg">
                      <span className="text-purple-400 font-semibold">#{stream.rank}</span>
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-white mb-1">{stream.bounty}</p>
                      <div className="flex items-center gap-4 text-slate-400 text-sm">
                        <span>{stream.date}</span>
                        <span>•</span>
                        <span>{stream.duration}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-green-400 font-semibold">{stream.revenue} SUI</p>
                      <div className="flex items-center gap-1 text-slate-400 text-sm">
                        <Eye className="w-3 h-3" />
                        <span>{stream.viewers.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="sm" className="hover:bg-slate-700">
                      <ArrowUpRight className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Revenue Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Coins className="w-6 h-6 text-purple-400" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-green-400" />
                </div>
                <h4 className="text-white text-2xl mb-1">59.5 SUI</h4>
                <p className="text-slate-400 text-sm">Revenu moyen par bounty</p>
                <p className="text-green-400 text-xs mt-2">+12% vs mois dernier</p>
              </Card>

              <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border-cyan-500/20 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-cyan-400" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-green-400" />
                </div>
                <h4 className="text-white text-2xl mb-1">4.2h</h4>
                <p className="text-slate-400 text-sm">Durée moyenne de stream</p>
                <p className="text-green-400 text-xs mt-2">+0.5h vs mois dernier</p>
              </Card>

              <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-green-400" />
                </div>
                <h4 className="text-white text-2xl mb-1">1,425</h4>
                <p className="text-slate-400 text-sm">Viewers moyens</p>
                <p className="text-green-400 text-xs mt-2">+285 vs mois dernier</p>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
