import { Header } from "../components/Header";
import { HeroSection } from "../components/HeroSection";
import { RoleCard } from "../components/RoleCard";
import { FeatureGrid } from "../components/FeatureGrid";
import { Footer } from "../components/Footer";
import { Code2, Radio, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <Header />
      
      <main>
        <HeroSection />
        
        {/* Role Selection Section */}
        <section className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-center mb-8 text-slate-200">
              Choisissez votre parcours
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <RoleCard
                icon={<Code2 className="w-12 h-12" />}
                title="Je suis Développeur"
                description="Publiez vos bounties et sponsorisez des streamers pour promouvoir vos projets"
                ctaText="Commencer en tant que dev"
                ctaLink="/auth/login?role=dev"
                gradient="from-blue-500/10 to-cyan-500/10"
                iconColor="text-blue-400"
              />
              
              <RoleCard
                icon={<Radio className="w-12 h-12" />}
                title="Je suis Streamer"
                description="Trouvez des sponsors et monétisez votre contenu avec des bounties transparents"
                ctaText="Trouver des sponsors"
                ctaLink="/auth/login?role=streamer"
                gradient="from-purple-500/10 to-pink-500/10"
                iconColor="text-purple-400"
              />
              
              <RoleCard
                icon={<Users className="w-12 h-12" />}
                title="Je suis Viewer"
                description="Soutenez vos streamers favoris et gagnez des NFT rewards grâce à votre engagement"
                ctaText="Découvrir les streamers"
                ctaLink="/viewer/browse"
                gradient="from-green-500/10 to-emerald-500/10"
                iconColor="text-green-400"
              />
            </div>
          </div>
        </section>
        
        <FeatureGrid />
      </main>
      
      <Footer />
    </div>
  );
}