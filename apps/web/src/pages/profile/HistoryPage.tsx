import { useState } from "react";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { History, Search, ArrowUpRight, ArrowDownLeft, Zap, Gift } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface HistoryPageProps {
  role: "dev" | "streamer" | "viewer";
}

interface Transaction {
  id: string;
  type: "bounty_completed" | "bounty_created" | "donation_sent" | "donation_received" | "nft_received";
  title: string;
  description: string;
  amount?: number;
  timestamp: Date;
  status: "completed" | "pending" | "failed";
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "bounty_completed",
    title: "Bounty complété",
    description: "Créer une animation de victoire",
    amount: 500,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: "completed",
  },
  {
    id: "2",
    type: "nft_received",
    title: "NFT Reward reçu",
    description: "Purple Champion Badge",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    status: "completed",
  },
  {
    id: "3",
    type: "donation_sent",
    title: "Donation envoyée",
    description: "À StreamerPro",
    amount: 50,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: "completed",
  },
  {
    id: "4",
    type: "bounty_created",
    title: "Bounty créé",
    description: "Finir le niveau boss sans dégâts",
    amount: 750,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: "completed",
  },
  {
    id: "5",
    type: "donation_received",
    title: "Donation reçue",
    description: "De Viewer789",
    amount: 100,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    status: "completed",
  },
];

export default function HistoryPage({ role }: HistoryPageProps) {
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const getIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "bounty_completed":
      case "bounty_created":
        return Zap;
      case "donation_sent":
        return ArrowUpRight;
      case "donation_received":
        return ArrowDownLeft;
      case "nft_received":
        return Gift;
      default:
        return History;
    }
  };

  const getColor = (type: Transaction["type"]) => {
    switch (type) {
      case "bounty_completed":
        return "text-green-400 bg-green-500/10";
      case "bounty_created":
        return "text-purple-400 bg-purple-500/10";
      case "donation_sent":
        return "text-orange-400 bg-orange-500/10";
      case "donation_received":
        return "text-cyan-400 bg-cyan-500/10";
      case "nft_received":
        return "text-yellow-400 bg-yellow-500/10";
      default:
        return "text-slate-400 bg-slate-500/10";
    }
  };

  const filteredTransactions = mockTransactions.filter((transaction) => {
    const matchesFilter = filter === "all" || transaction.type.includes(filter);
    const matchesSearch = transaction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <DashboardHeader role={role} />
      
      <main className="max-w-5xl mx-auto p-8">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Historique</h1>
            <p className="text-slate-400">Consultez toutes vos transactions et activités</p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Rechercher une transaction..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-900/50 border-slate-800 text-white"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-lg text-slate-300 flex items-center gap-2"
            >
              <option value="all">Toutes les transactions</option>
              <option value="bounty">Bounties</option>
              <option value="donation">Donations</option>
              <option value="nft">NFT Rewards</option>
            </select>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
              <div className="text-slate-400 text-sm mb-1">Total transactions</div>
              <div className="text-2xl font-bold text-white">{mockTransactions.length}</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
              <div className="text-slate-400 text-sm mb-1">Gains totaux</div>
              <div className="text-2xl font-bold text-green-400">1,350 SUI</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
              <div className="text-slate-400 text-sm mb-1">Dépenses totales</div>
              <div className="text-2xl font-bold text-orange-400">800 SUI</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
              <div className="text-slate-400 text-sm mb-1">NFT reçus</div>
              <div className="text-2xl font-bold text-yellow-400">5</div>
            </div>
          </div>

          {/* Transactions List */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
            <div className="divide-y divide-slate-800">
              {filteredTransactions.length === 0 ? (
                <div className="p-12 text-center">
                  <History className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">Aucune transaction trouvée</p>
                </div>
              ) : (
                filteredTransactions.map((transaction) => {
                  const Icon = getIcon(transaction.type);
                  const colorClass = getColor(transaction.type);
                  
                  return (
                    <div
                      key={transaction.id}
                      className="p-6 hover:bg-slate-800/30 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div>
                              <h3 className="text-white font-semibold">{transaction.title}</h3>
                              <p className="text-slate-400 text-sm">{transaction.description}</p>
                            </div>
                            {transaction.amount && (
                              <div className={`text-lg font-bold ${
                                transaction.type.includes("received") || transaction.type.includes("completed")
                                  ? "text-green-400"
                                  : "text-orange-400"
                              }`}>
                                {transaction.type.includes("received") || transaction.type.includes("completed") ? "+" : "-"}
                                {transaction.amount} SUI
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <span className="text-slate-500 text-xs">
                              {formatDistanceToNow(transaction.timestamp, {
                                addSuffix: true,
                                locale: fr,
                              })}
                            </span>
                            <Badge
                              className={
                                transaction.status === "completed"
                                  ? "bg-green-500/10 text-green-400 border-0"
                                  : transaction.status === "pending"
                                  ? "bg-yellow-500/10 text-yellow-400 border-0"
                                  : "bg-red-500/10 text-red-400 border-0"
                              }
                            >
                              {transaction.status === "completed"
                                ? "Complété"
                                : transaction.status === "pending"
                                ? "En attente"
                                : "Échoué"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
