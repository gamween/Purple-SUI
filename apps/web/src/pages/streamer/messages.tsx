import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { DashboardHeader } from "../../components/dashboard/DashboardHeader";
import { Sidebar } from "../../components/dashboard/Sidebar";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Search, Send, MoreVertical, Paperclip, Smile, Check, X, Clock, List, Zap } from "lucide-react";
import { toast } from "sonner";
import { useNotifications } from "../../lib/NotificationContext";

interface Conversation {
  id: string;
  dev: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  bounty: string;
  online: boolean;
}

interface Message {
  id: string;
  sender: "me" | "dev";
  text?: string;
  timestamp: string;
  type?: "text" | "bounty_offer";
  bountyOffer?: {
    title: string;
    description: string;
    amount: string;
    split: string;
    duration: string;
    requirements: string[];
    status: "pending" | "accepted" | "rejected";
  };
}

const conversations: Conversation[] = [
  {
    id: "1",
    dev: "GameDev Studio",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=GD",
    lastMessage: "Super ! Merci pour ton intérêt",
    timestamp: "Il y a 5 min",
    unread: 1,
    bounty: "Sui 8192 Promo",
    online: true,
  },
  {
    id: "2",
    dev: "Primacy Team",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=PT",
    lastMessage: "Le tournoi démarre ce soir !",
    timestamp: "Il y a 1h",
    unread: 0,
    bounty: "Tournoi Primacy",
    online: true,
  },
  {
    id: "3",
    dev: "Web3 Builders",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=WB",
    lastMessage: "Voici les détails de la bounty",
    timestamp: "Il y a 3h",
    unread: 2,
    bounty: "DeFi App Test",
    online: false,
  },
  {
    id: "4",
    dev: "NFT Creators",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=NC",
    lastMessage: "As-tu des questions ?",
    timestamp: "Hier",
    unread: 0,
    bounty: "Genesis Collection",
    online: false,
  },
];

const conversationMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "1",
      sender: "me",
      text: "Salut ! J'ai vu votre bounty pour Sui 8192. Ça m'intéresse vraiment !",
      timestamp: "14:30",
    },
    {
      id: "2",
      sender: "dev",
      text: "Excellent ! Content de voir ton intérêt. Tu as de l'expérience avec les jeux puzzle ?",
      timestamp: "14:32",
    },
    {
      id: "3",
      sender: "me",
      text: "Oui ! J'ai déjà streamé des jeux similaires. J'ai une communauté de 8K followers très engagés.",
      timestamp: "14:33",
    },
    {
      id: "4",
      sender: "dev",
      text: "Parfait ! Je t'envoie une offre détaillée.",
      timestamp: "14:35",
    },
    {
      id: "5",
      sender: "dev",
      timestamp: "14:36",
      type: "bounty_offer",
      bountyOffer: {
        title: "Promotion Sui 8192 - Jeu Puzzle",
        description: "Stream de 3 heures minimum de Sui 8192. Présente les mécaniques de jeu et les NFTs gagnables à ta communauté.",
        amount: "50",
        split: "70",
        duration: "14",
        requirements: [
          "Stream de minimum 3 heures",
          "Mention du jeu dans le titre du stream",
          "Explication des mécaniques blockchain",
          "Au moins 2 posts sur les réseaux sociaux"
        ],
        status: "pending",
      },
    },
    {
      id: "6",
      sender: "dev",
      text: "Super ! Merci pour ton intérêt",
      timestamp: "14:40",
    },
  ],
  "2": [
    {
      id: "1",
      sender: "dev",
      text: "Hey ! Prêt pour le tournoi ce soir ?",
      timestamp: "13:15",
    },
    {
      id: "2",
      sender: "me",
      text: "Oui, tout est configuré ! Le prize pool est confirmé ?",
      timestamp: "13:18",
    },
    {
      id: "3",
      sender: "dev",
      text: "Le tournoi démarre ce soir !",
      timestamp: "13:20",
    },
  ],
  "3": [
    {
      id: "1",
      sender: "dev",
      text: "Bonjour ! J'ai vu ton profil et je pense que tu serais parfait pour notre bounty.",
      timestamp: "11:30",
    },
    {
      id: "2",
      sender: "dev",
      timestamp: "11:32",
      type: "bounty_offer",
      bountyOffer: {
        title: "Test Application DeFi Web3",
        description: "Présentation et test en direct de notre nouvelle app de trading DeFi sur Sui.",
        amount: "30",
        split: "80",
        duration: "10",
        requirements: [
          "Stream de 2 heures minimum",
          "Test complet des fonctionnalités",
          "Feedback en temps réel",
        ],
        status: "pending",
      },
    },
    {
      id: "3",
      sender: "dev",
      text: "Voici les détails de la bounty",
      timestamp: "11:35",
    },
  ],
  "4": [
    {
      id: "1",
      sender: "me",
      text: "Salut ! Votre collection Genesis a l'air incroyable !",
      timestamp: "Hier 16:30",
    },
    {
      id: "2",
      sender: "dev",
      text: "Merci ! On cherche des streamers pour le lancement. Intéressé ?",
      timestamp: "Hier 16:45",
    },
    {
      id: "3",
      sender: "dev",
      text: "As-tu des questions ?",
      timestamp: "Hier 17:00",
    },
  ],
};

export default function StreamerMessages() {
  const [selectedConv, setSelectedConv] = useState<string>("1");
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState<Record<string, Message[]>>(() => {
    try {
      const stored = localStorage.getItem("messages_state");
      return stored ? JSON.parse(stored) : conversationMessages;
    } catch (e) {
      return conversationMessages;
    }
  });
  const [searchParams] = useSearchParams();
  const { addNotification } = useNotifications();

  const selectedConversation = conversations.find(c => c.id === selectedConv);
  
  const filteredConversations = conversations.filter(conv => 
    conv.dev.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.bounty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (messageText.trim() && selectedConv) {
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: "me",
        text: messageText,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        type: "text",
      };
      
      setMessages(prev => ({
        ...prev,
        [selectedConv]: [...(prev[selectedConv] || []), newMessage]
      }));
      
      setMessageText("");
    }
  };

  const handleAcceptBountyOffer = (messageId: string) => {
    setMessages(prev => ({
      ...prev,
      [selectedConv]: prev[selectedConv].map(msg => 
        msg.id === messageId && msg.bountyOffer
          ? { ...msg, bountyOffer: { ...msg.bountyOffer, status: "accepted" } }
          : msg
      )
    }));

    // Récupérer les infos de l'offre
    const message = messages[selectedConv].find(m => m.id === messageId);
    const bountyTitle = message?.bountyOffer?.title || "Bounty";

    // Envoyer une notification
    addNotification({
      type: "bounty_accepted",
      title: "Bounty acceptée !",
      message: `Vous avez accepté l'offre "${bountyTitle}"`,
      actionUrl: "/streamer/bounties",
      metadata: {
        bountyId: messageId,
        devId: selectedConversation?.dev
      }
    });

    // Ajouter la bounty acceptée dans le stockage local pour qu'elle apparaisse
    // dans la page "Mes Bounties" (streamer/bounties.tsx lira ce storage au montage)
    try {
      const stored = localStorage.getItem("activeBounties");
      const parsed = stored ? JSON.parse(stored) : [];

      // Avoid duplicates: check if an entry from this messageId already exists
      const exists = parsed.some((p: any) => p?.sourceMessageId === messageId);
      if (!exists) {
        const newBounty = {
          id: `accepted-${messageId}-${Date.now()}`,
          title: message?.bountyOffer?.title || "Bounty",
          description: message?.bountyOffer?.description || "",
          amount: Number(message?.bountyOffer?.amount || 0),
          split: Number(message?.bountyOffer?.split || 0),
          duration: `${message?.bountyOffer?.duration || "0"} jours restants`,
          status: "active",
          dev: selectedConversation?.dev || "",
          devAvatar: selectedConversation?.avatar || "",
          category: "Gaming",
          // track origin so we can avoid duplicates across sessions
          sourceMessageId: messageId,
        };

        parsed.unshift(newBounty);
        localStorage.setItem("activeBounties", JSON.stringify(parsed));
      }
    } catch (e) {
      // ignore storage errors
    }

    toast.success("✅ Bounty acceptée ! Elle a été ajoutée à vos bounties actives.");
    
    // Simuler l'envoi d'un message de confirmation
    setTimeout(() => {
      const confirmMessage: Message = {
        id: Date.now().toString(),
        sender: "me",
        text: "J'accepte votre offre ! Hâte de commencer cette collaboration 🎉",
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        type: "text",
      };
      
      setMessages(prev => ({
        ...prev,
        [selectedConv]: [...(prev[selectedConv] || []), confirmMessage]
      }));
    }, 500);
  };

  const handleRejectBountyOffer = (messageId: string) => {
    setMessages(prev => ({
      ...prev,
      [selectedConv]: prev[selectedConv].map(msg => 
        msg.id === messageId && msg.bountyOffer
          ? { ...msg, bountyOffer: { ...msg.bountyOffer, status: "rejected" } }
          : msg
      )
    }));

    // Récupérer les infos de l'offre
    const message = messages[selectedConv].find(m => m.id === messageId);
    const bountyTitle = message?.bountyOffer?.title || "Bounty";

    // Envoyer une notification
    addNotification({
      type: "bounty_rejected",
      title: "Offre refusée",
      message: `Vous avez refusé l'offre "${bountyTitle}"`,
      metadata: {
        bountyId: messageId,
        devId: selectedConversation?.dev
      }
    });

    toast.error("❌ Offre refusée");
    
    // Simuler l'envoi d'un message de refus
    setTimeout(() => {
      const rejectMessage: Message = {
        id: Date.now().toString(),
        sender: "me",
        text: "Merci pour l'offre, mais je dois décliner pour le moment.",
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        type: "text",
      };
      
      setMessages(prev => ({
        ...prev,
        [selectedConv]: [...(prev[selectedConv] || []), rejectMessage]
      }));
    }, 500);
  };

  useEffect(() => {
    const convId = searchParams.get("convId");
    if (convId && conversations.some(c => c.id === convId)) {
      setSelectedConv(convId);
    }
  }, [searchParams]);

  // Persist messages state so accepted/rejected offers survive reloads
  useEffect(() => {
    try {
      localStorage.setItem("messages_state", JSON.stringify(messages));
    } catch (e) {
      // ignore storage errors
    }
  }, [messages]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <DashboardHeader role="streamer" />
      
      <div className="flex">
        <Sidebar role="streamer" activeItem="messages" />
        
        <main className="flex-1 flex h-[calc(100vh-73px)]">
          {/* Conversations List */}
          <div className="w-96 border-r border-slate-800 bg-slate-950/50 flex flex-col">
            {/* Search Header */}
            <div className="p-4 border-b border-slate-800">
              <h2 className="text-white mb-4">Messages</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Rechercher une conversation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-900 border-slate-800 text-white"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConv(conv.id)}
                  className={`w-full p-4 border-b border-slate-800 hover:bg-slate-900/50 transition-colors text-left ${
                    selectedConv === conv.id ? "bg-slate-900/70" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <img 
                        src={conv.avatar} 
                        alt={conv.dev}
                        className="w-12 h-12 rounded-full"
                      />
                      {conv.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-950 rounded-full" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white">{conv.dev}</span>
                        {conv.unread > 0 && (
                          <Badge className="bg-purple-600 text-white text-xs">
                            {conv.unread}
                          </Badge>
                        )}
                      </div>
                      <p className="text-slate-400 text-sm mb-1 truncate">
                        {conv.lastMessage}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-xs">{conv.bounty}</span>
                        <span className="text-slate-500 text-xs">{conv.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-slate-800 bg-slate-950/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img 
                          src={selectedConversation.avatar} 
                          alt={selectedConversation.dev}
                          className="w-10 h-10 rounded-full"
                        />
                        {selectedConversation.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-950 rounded-full" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-white">{selectedConversation.dev}</h3>
                        <p className="text-slate-400 text-sm">
                          {selectedConversation.online ? "En ligne" : "Hors ligne"} • {selectedConversation.bounty}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-5 h-5 text-slate-400" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages[selectedConv]?.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`max-w-md ${message.sender === "me" ? "order-2" : "order-1"}`}>
                        <div
                          className={`px-4 py-3 rounded-2xl ${
                            message.sender === "me"
                              ? "bg-purple-600 text-white"
                              : "bg-slate-800 text-slate-100"
                          }`}
                        >
                          {message.type === "text" && <p>{message.text}</p>}
                          {message.type === "bounty_offer" && (
                            <div className="flex flex-col space-y-3">
                              <div className="border-b border-white/20 pb-2">
                                <div className="flex items-center gap-2 mb-2">
                                  <Zap className={`w-5 h-5 ${message.sender === "me" ? "text-yellow-300" : "text-purple-400"}`} />
                                  <h4 className="font-semibold">Offre de Bounty</h4>
                                </div>
                                <h5 className="font-semibold mb-1">{message.bountyOffer?.title}</h5>
                                <p className="text-sm opacity-90">{message.bountyOffer?.description}</p>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="flex items-center gap-1">
                                  <Zap className={`w-4 h-4 ${message.sender === "me" ? "text-yellow-300" : "text-purple-400"}`} />
                                  <span>{message.bountyOffer?.amount} SUI</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Check className={`w-4 h-4 ${message.sender === "me" ? "text-green-300" : "text-green-400"}`} />
                                  <span>{message.bountyOffer?.split}% pour vous</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className={`w-4 h-4 ${message.sender === "me" ? "text-slate-300" : "text-slate-400"}`} />
                                  <span>{message.bountyOffer?.duration} jours</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <List className={`w-4 h-4 ${message.sender === "me" ? "text-slate-300" : "text-slate-400"}`} />
                                  <span>{message.bountyOffer?.requirements.length} exigences</span>
                                </div>
                              </div>

                              {/* Exigences détaillées */}
                              {message.bountyOffer?.requirements && message.bountyOffer.requirements.length > 0 && (
                                <div className="bg-black/20 rounded-lg p-3 text-sm space-y-1">
                                  <p className="font-semibold text-xs mb-2 opacity-70">EXIGENCES :</p>
                                  {message.bountyOffer.requirements.map((req, idx) => (
                                    <div key={idx} className="flex gap-2">
                                      <span className="opacity-70">{idx + 1}.</span>
                                      <span>{req}</span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Actions pour le streamer qui reçoit l'offre */}
                              {message.sender === "dev" && (
                                <div className="pt-2 border-t border-white/20">
                                  {message.bountyOffer?.status === "pending" && (
                                    <div className="flex gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 bg-green-500 text-white hover:bg-green-600 border-0"
                                        onClick={() => handleAcceptBountyOffer(message.id)}
                                      >
                                        <Check className="w-4 h-4 mr-2" />
                                        Accepter
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 bg-red-500 text-white hover:bg-red-600 border-0"
                                        onClick={() => handleRejectBountyOffer(message.id)}
                                      >
                                        <X className="w-4 h-4 mr-2" />
                                        Refuser
                                      </Button>
                                    </div>
                                  )}
                                  {message.bountyOffer?.status === "accepted" && (
                                    <div className="flex items-center gap-2 text-sm bg-green-500/20 rounded px-3 py-2">
                                      <Check className="w-4 h-4 text-green-400" />
                                      <span className="text-green-200">Vous avez accepté cette offre ✓</span>
                                    </div>
                                  )}
                                  {message.bountyOffer?.status === "rejected" && (
                                    <div className="flex items-center gap-2 text-sm bg-red-500/20 rounded px-3 py-2">
                                      <X className="w-4 h-4 text-red-400" />
                                      <span className="text-red-200">Vous avez refusé cette offre</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <p className={`text-xs text-slate-500 mt-1 ${
                          message.sender === "me" ? "text-right" : "text-left"
                        }`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-slate-800 bg-slate-950/50">
                  <div className="flex items-end gap-3">
                    <Button variant="ghost" size="sm" className="mb-2">
                      <Paperclip className="w-5 h-5 text-slate-400" />
                    </Button>
                    
                    <div className="flex-1">
                      <Input
                        placeholder="Écrivez votre message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        className="bg-slate-900 border-slate-800 text-white"
                      />
                    </div>
                    
                    <Button variant="ghost" size="sm" className="mb-2">
                      <Smile className="w-5 h-5 text-slate-400" />
                    </Button>
                    
                    <Button 
                      onClick={handleSendMessage}
                      className="bg-purple-600 hover:bg-purple-700 mb-2"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-slate-600" />
                  </div>
                  <p className="text-slate-400">Sélectionnez une conversation</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
