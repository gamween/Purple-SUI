import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function HeroSection() {
  return (
    <section className="relative px-4 pt-12 pb-8 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">Propulsé par la blockchain Sui</span>
          </div>

          {/* Title */}
          <h1 className="text-white">
            Connectez l'écosystème Twitch à la blockchain Sui
          </h1>
        </div>
      </div>
    </section>
  );
}