import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { StreamerCard } from "../../components/viewer/StreamerCard";
import { Input } from "../../components/ui/input";
import { Search } from "lucide-react";

const mockStreamers = [
  {
    id: "1",
    name: "StreamerPro",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=streamer1",
    isLive: true,
    viewers: 1250,
    category: "Valorant",
    activeBounties: 2,
    thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=225&fit=crop",
  },
  {
    id: "2",
    name: "GamerElite",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=streamer2",
    isLive: true,
    viewers: 850,
    category: "League of Legends",
    activeBounties: 1,
    thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=225&fit=crop",
  },
  {
    id: "3",
    name: "TechStreamer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=streamer3",
    isLive: false,
    viewers: 0,
    category: "Programming",
    activeBounties: 1,
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=225&fit=crop",
  },
  {
    id: "4",
    name: "CreativePlayer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=streamer4",
    isLive: true,
    viewers: 2100,
    category: "Minecraft",
    activeBounties: 3,
    thumbnail: "https://images.unsplash.com/photo-1614294148960-9aa740632a87?w=400&h=225&fit=crop",
  },
];

export default function ViewerBrowse() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <DashboardHeader role="viewer" />
      
      <main className="max-w-7xl mx-auto p-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-white mb-2">Streamers avec bounties actifs</h1>
            <p className="text-slate-400">Soutenez vos streamers favoris et gagnez des NFT rewards</p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Rechercher un streamer..."
                className="pl-10 bg-slate-900/50 border-slate-800 text-white"
              />
            </div>
            <select className="px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-lg text-slate-300">
              <option>Toutes catégories</option>
              <option>Gaming</option>
              <option>Tech</option>
              <option>Just Chatting</option>
              <option>Creative</option>
            </select>
            <select className="px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-lg text-slate-300">
              <option>Tous les statuts</option>
              <option>En live</option>
              <option>Hors ligne</option>
            </select>
          </div>

          {/* Live Badge */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-slate-300 text-sm">
              {mockStreamers.filter(s => s.isLive).length} streamers en live
            </span>
          </div>

          {/* Streamers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockStreamers.map((streamer) => (
              <StreamerCard key={streamer.id} streamer={streamer} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
