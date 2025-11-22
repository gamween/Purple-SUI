import { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  trendUp?: boolean;
  iconColor: string;
  iconBg: string;
}

export function StatsCard({ title, value, icon, trend, trendUp, iconColor, iconBg }: StatsCardProps) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`${iconBg} w-12 h-12 rounded-lg flex items-center justify-center ${iconColor}`}>
          {icon}
        </div>
      </div>
      
      <div className="space-y-1">
        <p className="text-slate-400 text-sm">{title}</p>
        <p className="text-white text-2xl font-semibold">{value}</p>
        {trend && (
          <div className="flex items-center gap-1">
            {trendUp !== undefined && (
              trendUp ? (
                <TrendingUp className="w-3 h-3 text-green-400" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-400" />
              )
            )}
            <p className={`text-xs ${trendUp ? 'text-green-400' : trendUp === false ? 'text-red-400' : 'text-slate-500'}`}>
              {trend}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}