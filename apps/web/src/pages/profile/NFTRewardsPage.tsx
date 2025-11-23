import { useState } from "react";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { Input } from "../../components/ui/input";
import { Gift, Search, ExternalLink, Share2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useUserNfts } from "../../hooks/useUserNfts";
import { useCurrentAccount } from "@mysten/dapp-kit";

interface NFTRewardsPageProps {
  role: "dev" | "streamer" | "viewer";
}

export default function NFTRewardsPage({ role }: NFTRewardsPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const currentAccount = useCurrentAccount();
  const { nfts, loading, error } = useUserNfts();

  const filteredNfts = nfts.filter((nft) => {
    const matchesSearch = nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         nft.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // État de non-connexion
  if (!currentAccount) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <DashboardHeader role={role} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Gift className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Mes NFT Rewards</h2>
            <p className="text-slate-400">Connecte ton wallet pour voir tes NFTs</p>
          </div>
        </div>
      </div>
    );
  }

  // État de chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <DashboardHeader role={role} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-slate-400">Chargement de tes NFTs...</p>
          </div>
        </div>
      </div>
    );
  }

  // État d'erreur
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <DashboardHeader role={role} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-red-400 mb-2">{error}</p>
            <p className="text-slate-500 text-sm">Impossible de charger les NFTs</p>
          </div>
        </div>
      </div>
    );
  }

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
              <div className="text-3xl font-bold text-white">{nfts.length}</div>
              <div className="text-slate-400 text-sm">NFT collectés</div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Rechercher un NFT..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-900/50 border-slate-800 text-white"
            />
          </div>

          {/* NFT Grid */}
          {filteredNfts.length === 0 ? (
            <div className="col-span-full p-20 text-center bg-slate-900/50 border border-slate-800 rounded-xl">
              <Gift className="w-20 h-20 text-slate-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">
                {nfts.length === 0 ? "Aucun NFT pour le moment" : "Aucun résultat"}
              </h3>
              <p className="text-slate-400">
                {nfts.length === 0 
                  ? "Participe à des streams pour gagner des récompenses !"
                  : "Essaye une autre recherche"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredNfts.map((nft) => (
                <div
                  key={nft.id}
                  className="bg-slate-900/50 border-2 border-slate-700 rounded-xl overflow-hidden hover:scale-105 hover:border-purple-500/50 transition-all group"
                >
                  {/* NFT Image */}
                  <div className="relative aspect-square bg-gradient-to-br from-purple-500/20 to-blue-500/20">
                    {nft.imageUrl ? (
                      <img
                        src={nft.imageUrl}
                        alt={nft.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/400/6366f1/ffffff?text=NFT';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl">
                        🎨
                      </div>
                    )}
                  </div>

                  {/* NFT Info */}
                  <div className="p-4">
                    <h3 className="text-white font-bold text-lg mb-2 truncate">{nft.name}</h3>
                    <p className="text-slate-400 text-sm mb-3 line-clamp-2">
                      {nft.description || 'Récompense Purple SUI'}
                    </p>
                    
                    <div className="space-y-2 mb-4 text-xs">
                      <div className="flex justify-between text-slate-500">
                        <span>Streamer</span>
                        <span className="text-slate-300">Purple SUI</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Bounty</span>
                        <span className="text-slate-300">Viewer Reward</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-purple-600 hover:bg-purple-700"
                        onClick={() => window.open(`https://suiscan.xyz/testnet/object/${nft.id}`, '_blank')}
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
