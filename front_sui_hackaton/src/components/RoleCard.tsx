import { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

interface RoleCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  gradient: string;
  iconColor: string;
}

export function RoleCard({
  icon,
  title,
  description,
  ctaText,
  ctaLink,
  gradient,
  iconColor,
}: RoleCardProps) {
  return (
    <Link to={ctaLink} className="block">
      <div
        className={`group relative bg-slate-900/50 border border-slate-800 rounded-xl p-8 hover:border-slate-700 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:shadow-purple-500/10`}
      >
        {/* Gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
        
        {/* Content */}
        <div className="relative space-y-6">
          {/* Icon */}
          <div className={`${iconColor} transform group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>

          {/* Text */}
          <div className="space-y-3">
            <h3 className="text-white">{title}</h3>
            <p className="text-slate-400 leading-relaxed">
              {description}
            </p>
          </div>

          {/* CTA */}
          <div className="w-full flex justify-between items-center px-4 py-2 rounded-md group-hover:bg-white/5 transition-colors">
            <span className="text-slate-300">{ctaText}</span>
            <ArrowRight className="w-4 h-4 text-slate-300 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}