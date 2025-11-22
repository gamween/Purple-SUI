import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { Sidebar } from "../../components/dashboard/Sidebar";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { 
  ArrowLeft, 
  ExternalLink, 
  Copy, 
  CheckCircle2, 
  Clock, 
  Users, 
  TrendingUp,
  MessageSquare,
  AlertCircle,
  Calendar,
  Coins,
  Download
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "react-toastify";

// Mock data - en production, cela viendrait d'une API
const bountyData = {
  id: "1",
  title: "Promotion de mon jeu Valorant",
  description: "Je recherche un streamer pour promouvoir mon nouveau jeu Valorant. Le stream doit durer au minimum 3 heures avec mention régulière du projet et interaction avec la communauté.",
  amount: 50,
  split: 70,
  status: "active",
  createdAt: "15 Nov 2024",
  duration: "14 jours restants",
  endDate: "30 Nov 2024",
  streamer: {
    name: "StreamerPro",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=pro",
    followers: "8.2K",
    avgViewers: "450"
  },
  contract: {
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    network: "Sui Mainnet",
    createdAt: "2024-11-15T10:30:00Z",
  },
  donations: 35.5,
  requirements: [
    "Stream de 3 heures minimum",
    "Mention du projet toutes les 30 minutes",
    "Interaction active avec le chat",
    "Utilisation des overlays fournis"
  ],
  stats: {
    totalViewers: 2500,
    peakViewers: 650,
    avgViewTime: "45 min",
    chatMessages: 1250
  }
};

const donationsTimeline = [
  { time: "14h", amount: 5 },
  { time: "15h", amount: 8 },
  { time: "16h", amount: 12 },
  { time: "17h", amount: 15 },
  { time: "18h", amount: 20 },
  { time: "19h", amount: 28 },
  { time: "20h", amount: 35.5 },
];

export default function BountyDetail() {
  const { id } = useParams();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <DashboardHeader role="dev" />
      
      <div className="flex">
        <Sidebar role="dev" activeItem="bounties" />
        
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Back Button */}
            <Link to="/dev/bounties">
              <Button variant="ghost" className="gap-2 text-slate-400 hover:text-white">
                <ArrowLeft className="w-4 h-4" />
                Retour aux bounties
              </Button>
            </Link>

            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-white">{bountyData.title}</h1>
                  <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                    Active
                  </Badge>
                </div>
                <p className="text-slate-400 max-w-3xl">
                  {bountyData.description}
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" className="gap-2 border-slate-700">
                  <MessageSquare className="w-4 h-4" />
                  Contacter
                </Button>
                <Button className="gap-2 bg-red-600 hover:bg-red-700">
                  <AlertCircle className="w-4 h-4" />
                  Terminer bounty
                </Button>
              </div>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-slate-900/50 border-slate-800 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Coins className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Donations totales</p>
                    <p className="text-white text-xl">{bountyData.donations} SUI</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Total viewers</p>
                    <p className="text-white text-xl">{bountyData.stats.totalViewers}</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Pic viewers</p>
                    <p className="text-white text-xl">{bountyData.stats.peakViewers}</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Temps restant</p>
                    <p className="text-white text-xl">14j</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="bg-slate-900/50 border border-slate-800">
                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="contract">Contrat</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="streamer">Streamer</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Bounty Details */}
                  <Card className="bg-slate-900/50 border-slate-800 p-6">
                    <h3 className="text-white mb-4">Détails de la bounty</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between py-3 border-b border-slate-800">
                        <span className="text-slate-400">Montant</span>
                        <span className="text-white">{bountyData.amount} SUI</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-slate-800">
                        <span className="text-slate-400">Split streamer</span>
                        <span className="text-purple-400">{bountyData.split}%</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-slate-800">
                        <span className="text-slate-400">Votre part</span>
                        <span className="text-green-400">{100 - bountyData.split}%</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-slate-800">
                        <span className="text-slate-400">Date de création</span>
                        <span className="text-white">{bountyData.createdAt}</span>
                      </div>
                      <div className="flex justify-between py-3">
                        <span className="text-slate-400">Date de fin</span>
                        <span className="text-white">{bountyData.endDate}</span>
                      </div>
                    </div>
                  </Card>

                  {/* Requirements */}
                  <Card className="bg-slate-900/50 border-slate-800 p-6">
                    <h3 className="text-white mb-4">Exigences du contrat</h3>
                    <div className="space-y-3">
                      {bountyData.requirements.map((req, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-300">{req}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* Donations Timeline */}
                <Card className="bg-slate-900/50 border-slate-800 p-6">
                  <h3 className="text-white mb-4">Timeline des donations</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={donationsTimeline}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="time" stroke="#94a3b8" />
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
                        dataKey="amount" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        dot={{ fill: "#10b981", r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </TabsContent>

              {/* Contract Tab */}
              <TabsContent value="contract" className="space-y-6">
                <Card className="bg-slate-900/50 border-slate-800 p-6">
                  <h3 className="text-white mb-6">Informations du smart contract</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="text-slate-400 text-sm mb-2 block">Adresse du contrat</label>
                      <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                        <code className="flex-1 text-purple-400 font-mono text-sm">
                          {bountyData.contract.address}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(bountyData.contract.address)}
                        >
                          {copied ? (
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4 text-slate-400" />
                          )}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4 text-slate-400" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-400 text-sm mb-2 block">Réseau</label>
                      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                        <span className="text-white">{bountyData.contract.network}</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-400 text-sm mb-2 block">État du contrat</label>
                      <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                          <span className="text-green-400">Actif et vérifié</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-400 text-sm mb-2 block">Paramètres du contrat</label>
                      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Split automatique</span>
                          <span className="text-white">✓ Activé</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Streamer share</span>
                          <span className="text-purple-400">{bountyData.split}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Dev share</span>
                          <span className="text-cyan-400">{100 - bountyData.split}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Distribution</span>
                          <span className="text-white">Temps réel</span>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full gap-2 bg-purple-600 hover:bg-purple-700">
                      <ExternalLink className="w-4 h-4" />
                      Voir sur l'explorateur Sui
                    </Button>
                  </div>
                </Card>

                {/* Contract Actions */}
                <Card className="bg-slate-900/50 border-slate-800 p-6">
                  <h3 className="text-white mb-4">Actions du contrat</h3>
                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      onClick={() => toast.success("Message envoyé au streamer")}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Contacter le streamer
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full border-slate-700 hover:border-slate-600"
                      onClick={() => toast.info("Export des statistiques en cours...")}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Exporter les stats
                    </Button>
                  </div>
                </Card>
              </TabsContent>

              {/* Performance Tab */}
              <TabsContent value="performance" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-slate-900/50 border-slate-800 p-6">
                    <h3 className="text-white mb-4">Métriques de stream</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between py-3 border-b border-slate-800">
                        <span className="text-slate-400">Total viewers</span>
                        <span className="text-white">{bountyData.stats.totalViewers}</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-slate-800">
                        <span className="text-slate-400">Pic viewers</span>
                        <span className="text-white">{bountyData.stats.peakViewers}</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-slate-800">
                        <span className="text-slate-400">Temps de visionnage moyen</span>
                        <span className="text-white">{bountyData.stats.avgViewTime}</span>
                      </div>
                      <div className="flex justify-between py-3">
                        <span className="text-slate-400">Messages chat</span>
                        <span className="text-white">{bountyData.stats.chatMessages}</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-slate-900/50 border-slate-800 p-6">
                    <h3 className="text-white mb-4">ROI & Performance</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between py-3 border-b border-slate-800">
                        <span className="text-slate-400">Investissement initial</span>
                        <span className="text-white">{bountyData.amount} SUI</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-slate-800">
                        <span className="text-slate-400">Donations reçues</span>
                        <span className="text-green-400">{bountyData.donations} SUI</span>
                      </div>
                      <div className="flex justify-between py-3 border-b border-slate-800">
                        <span className="text-slate-400">Votre part (30%)</span>
                        <span className="text-cyan-400">{(bountyData.donations * 0.3).toFixed(2)} SUI</span>
                      </div>
                      <div className="flex justify-between py-3">
                        <span className="text-slate-400">ROI estimé</span>
                        <span className="text-green-400">+{((bountyData.donations / bountyData.amount - 1) * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>

              {/* Streamer Tab */}
              <TabsContent value="streamer" className="space-y-6">
                <Card className="bg-slate-900/50 border-slate-800 p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <img 
                        src={bountyData.streamer.avatar} 
                        alt={bountyData.streamer.name}
                        className="w-20 h-20 rounded-full"
                      />
                      <div>
                        <h3 className="text-white mb-1">{bountyData.streamer.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span>{bountyData.streamer.followers} followers</span>
                          <span>•</span>
                          <span>{bountyData.streamer.avgViewers} viewers moyens</span>
                        </div>
                      </div>
                    </div>
                    <Button className="gap-2 bg-purple-600 hover:bg-purple-700">
                      <MessageSquare className="w-4 h-4" />
                      Contacter
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-slate-800/30 rounded-lg">
                      <p className="text-slate-400 text-sm mb-1">Total généré</p>
                      <p className="text-white text-xl">{bountyData.donations} SUI</p>
                    </div>
                    <div className="p-4 bg-slate-800/30 rounded-lg">
                      <p className="text-slate-400 text-sm mb-1">Part streamer</p>
                      <p className="text-purple-400 text-xl">{(bountyData.donations * bountyData.split / 100).toFixed(2)} SUI</p>
                    </div>
                    <div className="p-4 bg-slate-800/30 rounded-lg">
                      <p className="text-slate-400 text-sm mb-1">Taux d'engagement</p>
                      <p className="text-green-400 text-xl">92%</p>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}