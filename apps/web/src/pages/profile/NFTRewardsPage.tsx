import { useState } from "react";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Gift, Search, ExternalLink, Download, Share2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

interface NFTRewardsPageProps {
  role: "dev" | "streamer" | "viewer";
}

interface NFTReward {
  id: string;
  name: string;
  description: string;
  image: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  earnedDate: Date;
  streamer: string;
  bountyName: string;
}

const mockNFTs: NFTReward[] = [
  {
    id: "1",
    name: "Purple Champion Badge",
    description: "Awarded for completing 10 bounties",
    image: "https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=400&h=400&fit=crop",
    rarity: "legendary",
    earnedDate: new Date(Date.now() - 5 * 60 * 60 * 1000),
    streamer: "StreamerPro",
    bountyName: "Créer une animation de victoire",
  },
  {
    id: "2",
    name: "Victory Dance NFT",
    description: "Exclusive animation reward",
    image: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=400&h=400&fit=crop",
    rarity: "epic",
    earnedDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
    streamer: "GamerElite",
    bountyName: "Finir le niveau boss",
  },
  {
    id: "3",
    name: "First Donation Medal",
    description: "Your first contribution to a streamer",
    image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=400&h=400&fit=crop",
    rarity: "rare",
    earnedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    streamer: "TechStreamer",
    bountyName: "Première donation",
  },
  {
    id: "4",
    name: "Speed Runner Trophy",
    description: "Completed bounty in record time",
    image: "https://images.unsplash.com/photo-1614294148960-9aa740632a87?w=400&h=400&fit=crop",
    rarity: "epic",
    earnedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    streamer: "CreativePlayer",
    bountyName: "Speedrun challenge",
  },
  {
    id: "5",
    name: "Community Supporter",
    description: "Active member of Purple SUI",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=400&fit=crop",
    rarity: "common",
    earnedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    streamer: "Purple SUI",
    bountyName: "Rejoindre la communauté",
  },
];

export default function NFTRewardsPage({ role }: NFTRewardsPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRarity, setFilterRarity] = useState<string>("all");

  const getRarityColor = (rarity: NFTReward["rarity"]) => {
    switch (rarity) {
      case "legendary":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
      case "epic":
        return "text-purple-400 bg-purple-500/10 border-purple-500/20";
      case "rare":
        return "text-cyan-400 bg-cyan-500/10 border-cyan-500/20";
      case "common":
        return "text-slate-400 bg-slate-500/10 border-slate-500/20";
      default:
        return "text-slate-400 bg-slate-500/10 border-slate-500/20";
    }
  };

  const getRarityBorderColor = (rarity: NFTReward["rarity"]) => {
    switch (rarity) {
      case "legendary":
        return "border-yellow-500/50 shadow-lg shadow-yellow-500/20";
      case "epic":
        return "border-purple-500/50 shadow-lg shadow-purple-500/20";
      case "rare":
        return "border-cyan-500/50 shadow-lg shadow-cyan-500/20";
      case "common":
        return "border-slate-700";
      default:
        return "border-slate-700";
    }
  };

  const filteredNFTs = mockNFTs.filter((nft) => {
    const matchesSearch = nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         nft.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRarity = filterRarity === "all" || nft.rarity === filterRarity;
    return matchesSearch && matchesRarity;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <DashboardHeader role={role} />
      
      <main className="max-w-7xl mx-auto p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <Gift className="w-8 h-8 text-yellow-400" />
                Mes NFT Rewards
              </h1>
              <p className="text-slate-400">Collection de vos récompenses exclusives</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{mockNFTs.length}</div>
              <div className="text-slate-400 text-sm">NFT collectés</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Rechercher un NFT..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-900/50 border-slate-800 text-white"
              />
            </div>
            <select
              value={filterRarity}
              onChange={(e) => setFilterRarity(e.target.value)}
              className="px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-lg text-slate-300"
            >
              <option value="all">Toutes les raretés</option>
              <option value="legendary">Légendaire</option>
              <option value="epic">Épique</option>
              <option value="rare">Rare</option>
              <option value="common">Commun</option>
            </select>
          </div>

          {/* Rarity Distribution */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20 rounded-xl p-4">
              <div className="text-yellow-400 text-2xl font-bold mb-1">1</div>
              <div className="text-slate-300 text-sm">Légendaire</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl p-4">
              <div className="text-purple-400 text-2xl font-bold mb-1">2</div>
              <div className="text-slate-300 text-sm">Épique</div>
            </div>
            <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/20 rounded-xl p-4">
              <div className="text-cyan-400 text-2xl font-bold mb-1">1</div>
              <div className="text-slate-300 text-sm">Rare</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
              <div className="text-slate-400 text-2xl font-bold mb-1">1</div>
              <div className="text-slate-300 text-sm">Commun</div>
            </div>
          </div>

          {/* NFT Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNFTs.length === 0 ? (
              <div className="col-span-full p-12 text-center bg-slate-900/50 border border-slate-800 rounded-xl">
                <Gift className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">Aucun NFT trouvé</p>
              </div>
            ) : (
              filteredNFTs.map((nft) => (
                <div
                  key={nft.id}
                  className={`bg-slate-900/50 border-2 rounded-xl overflow-hidden hover:scale-105 transition-all group ${getRarityBorderColor(nft.rarity)}`}
                >
                  {/* NFT Image */}
                  <div className="relative aspect-square bg-slate-800">
                    <ImageWithFallback
                      src={nft.image}
                      alt={nft.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className={`${getRarityColor(nft.rarity)} capitalize border`}>
                        {nft.rarity === "legendary" ? "Légendaire" : 
                         nft.rarity === "epic" ? "Épique" :
                         nft.rarity === "rare" ? "Rare" : "Commun"}
                      </Badge>
                    </div>
                  </div>

                  {/* NFT Info */}
                  <div className="p-4">
                    <h3 className="text-white font-bold text-lg mb-2">{nft.name}</h3>
                    <p className="text-slate-400 text-sm mb-3">{nft.description}</p>
                    
                    <div className="space-y-2 mb-4 text-xs">
                      <div className="flex justify-between text-slate-500">
                        <span>Streamer</span>
                        <span className="text-slate-300">{nft.streamer}</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Bounty</span>
                        <span className="text-slate-300">{nft.bountyName}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-purple-600 hover:bg-purple-700"
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Voir
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-700 text-slate-300 hover:bg-slate-800"
                      >
                        <Share2 className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-700 text-slate-300 hover:bg-slate-800"
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
