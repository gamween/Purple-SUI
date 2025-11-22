import { useState } from "react";
import { Link } from "react-router-dom";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { Sidebar } from "../../components/dashboard/Sidebar";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Card } from "../../components/ui/card";
import { 
  Search, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  Coins,
  ExternalLink,
  Star
} from "lucide-react";

interface Streamer {
  id: string;
  name: string;
  avatar: string;
  followers: string;
  avgViewers: string;
  activeBounties: number;
  totalGenerated: number;
  myShare: number;
  engagementRate: number;
  twitchUrl: string;
  status: "active" | "inactive";
  rating: number;
}

const streamers: Streamer[] = [
  {
    id: "1",
    name: "GamerElite",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=elite",
    followers: "12.5K",
    avgViewers: "850",
    activeBounties: 2,
    totalGenerated: 210,
    myShare: 63,
    engagementRate: 94,
    twitchUrl: "https://twitch.tv/gamerelite",
    status: "active",
    rating: 4.9
  },
  {
    id: "2",
    name: "StreamerPro",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=pro",
    followers: "8.2K",
    avgViewers: "450",
    activeBounties: 1,
    totalGenerated: 145,
    myShare: 43.5,
    engagementRate: 89,
    twitchUrl: "https://twitch.tv/streamerpro",
    status: "active",
    rating: 4.7
  },
  {
    id: "3",
    name: "CodeMaster",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=master",
    followers: "6.8K",
    avgViewers: "320",
    activeBounties: 1,
    totalGenerated: 156,
    myShare: 46.8,
    engagementRate: 92,
    twitchUrl: "https://twitch.tv/codemaster",
    status: "active",
    rating: 4.8
  },
  {
    id: "4",
    name: "TechNinja",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ninja",
    followers: "5.3K",
    avgViewers: "280",
    activeBounties: 0,
    totalGenerated: 89,
    myShare: 26.7,
    engagementRate: 87,
    twitchUrl: "https://twitch.tv/techninja",
    status: "inactive",
    rating: 4.6
  },
  {
    id: "5",
    name: "ProGamer2024",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=progamer",
    followers: "9.1K",
    avgViewers: "520",
    activeBounties: 2,
    totalGenerated: 178,
    myShare: 53.4,
    engagementRate: 91,
    twitchUrl: "https://twitch.tv/progamer2024",
    status: "active",
    rating: 4.8
  },
  {
    id: "6",
    name: "StreamQueen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=queen",
    followers: "15.2K",
    avgViewers: "920",
    activeBounties: 3,
    totalGenerated: 245,
    myShare: 73.5,
    engagementRate: 95,
    twitchUrl: "https://twitch.tv/streamqueen",
    status: "active",
    rating: 5.0
  }
];

export default function DevStreamers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");

  const filteredStreamers = streamers.filter(streamer => {
    const matchesSearch = streamer.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || streamer.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: streamers.length,
    active: streamers.filter(s => s.status === "active").length,
    totalGenerated: streamers.reduce((sum, s) => sum + s.totalGenerated, 0),
    totalShare: streamers.reduce((sum, s) => sum + s.myShare, 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <DashboardHeader role="dev" />
      
      <div className="flex">
        <Sidebar role="dev" activeItem="streamers" />
        
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-white mb-2">Mes Streamers Partenaires</h1>
                <p className="text-slate-400">Gérez vos collaborations avec les streamers</p>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-slate-900/50 border-slate-800 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Total streamers</p>
                    <p className="text-white text-xl">{stats.total}</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Actifs</p>
                    <p className="text-white text-xl">{stats.active}</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                    <Coins className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Total généré</p>
                    <p className="text-white text-xl">{stats.totalGenerated} SUI</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Coins className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Votre part totale</p>
                    <p className="text-white text-xl">{stats.totalShare.toFixed(1)} SUI</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Rechercher un streamer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-900 border-slate-800 text-white"
                />
              </div>
              
              <div className="flex gap-2">
                {(["all", "active", "inactive"] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-lg text-sm transition-all ${
                      filterStatus === status
                        ? "bg-purple-600 text-white"
                        : "bg-slate-800/50 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    {status === "all" ? "Tous" : status === "active" ? "Actifs" : "Inactifs"}
                  </button>
                ))}
              </div>
            </div>

            {/* Streamers Grid */}
            {filteredStreamers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStreamers.map((streamer) => (
                  <Card key={streamer.id} className="bg-slate-900/50 border-slate-800 p-6 hover:border-slate-700 transition-all group">
                    {/* Header with Avatar and Status */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img 
                            src={streamer.avatar} 
                            alt={streamer.name}
                            className="w-12 h-12 rounded-full"
                          />
                          {streamer.status === "active" && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-white">{streamer.name}</h3>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            <span className="text-slate-400 text-sm">{streamer.rating}</span>
                          </div>
                        </div>
                      </div>
                      <Badge className={
                        streamer.status === "active"
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                      }>
                        {streamer.status === "active" ? "Actif" : "Inactif"}
                      </Badge>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="p-3 bg-slate-800/30 rounded-lg">
                        <p className="text-slate-400 text-xs mb-1">Followers</p>
                        <p className="text-white">{streamer.followers}</p>
                      </div>
                      <div className="p-3 bg-slate-800/30 rounded-lg">
                        <p className="text-slate-400 text-xs mb-1">Viewers moy.</p>
                        <p className="text-white">{streamer.avgViewers}</p>
                      </div>
                    </div>

                    {/* Performance */}
                    <div className="space-y-3 mb-4 p-3 bg-slate-800/20 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Bounties actives</span>
                        <span className="text-purple-400">{streamer.activeBounties}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Total généré</span>
                        <span className="text-white">{streamer.totalGenerated} SUI</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Votre part</span>
                        <span className="text-green-400">{streamer.myShare} SUI</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Engagement</span>
                        <span className="text-cyan-400">{streamer.engagementRate}%</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-slate-700 hover:border-slate-600"
                        asChild
                      >
                        <a href={streamer.twitchUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Twitch
                        </a>
                      </Button>
                      <Button
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700"
                        asChild
                      >
                        <Link to={`/dev/chat?convId=${streamer.id}`}>
                          <MessageSquare className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-slate-900/50 border border-slate-800 rounded-xl">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-slate-600" />
                </div>
                <h3 className="text-white mb-2">Aucun streamer trouvé</h3>
                <p className="text-slate-400">
                  {searchQuery 
                    ? "Essayez une autre recherche" 
                    : "Créez votre première bounty pour commencer à collaborer"}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}