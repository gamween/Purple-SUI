import { FileText, Zap, Award, Sparkles } from "lucide-react";

const features = [
  {
    icon: <FileText className="w-8 h-8" />,
    title: "Smart Contracts",
    description: "Contrats automatisés sur la blockchain Sui garantissant transparence et sécurité des transactions",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Split Automatique",
    description: "Distribution instantanée des donations selon les pourcentages définis dans le smart contract",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: "NFT Rewards",
    description: "Récompensez les viewers les plus engagés avec des NFTs uniques générés automatiquement",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "IA Nimbus",
    description: "Intelligence artificielle qui analyse l'engagement des viewers en temps réel pour attribuer les rewards",
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
  },
];

export function FeatureGrid() {
  return (
    <section id="features" className="py-20 px-4 bg-slate-950/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-white">
            Une plateforme complète et transparente
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Profitez d'une infrastructure blockchain complète pour connecter développeurs, 
            streamers et viewers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all duration-300 hover:shadow-xl"
            >
              <div className={`${feature.bgColor} w-16 h-16 rounded-lg flex items-center justify-center mb-6 ${feature.color} transform group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>

              <h3 className="text-white mb-3">
                {feature.title}
              </h3>

              <p className="text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* How it works section */}
        <div className="mt-20 bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-slate-800 rounded-2xl p-12">
          <div className="text-center mb-12">
            <h2 className="text-white mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Un processus simple en 3 étapes pour chaque type d'utilisateur
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto text-blue-400 border border-blue-500/30">
                1
              </div>
              <h3 className="text-white">Connexion</h3>
              <p className="text-slate-400">
                Connectez votre compte Twitch et votre wallet Sui pour commencer
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto text-purple-400 border border-purple-500/30">
                2
              </div>
              <h3 className="text-white">Interaction</h3>
              <p className="text-slate-400">
                Créez des bounties, acceptez des contrats ou soutenez vos streamers favoris
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto text-cyan-400 border border-cyan-500/30">
                3
              </div>
              <h3 className="text-white">Récompenses</h3>
              <p className="text-slate-400">
                Recevez vos SUI automatiquement et débloquez des NFT rewards
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}