import { Link } from "react-router-dom";
import { LayoutDashboard, Zap, MessageSquare, BarChart3, Users } from "lucide-react";
import { cn } from "../ui/utils";

interface SidebarProps {
  role: "dev" | "streamer" | "viewer";
  activeItem: string;
}

const menuItems = {
  dev: [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/dev/dashboard" },
    { key: "bounties", label: "Mes Bounties", icon: Zap, href: "/dev/bounties", badge: 5 },
    { key: "streamers", label: "Streamers", icon: Users, href: "/dev/streamers" },
    { key: "messages", label: "Messages", icon: MessageSquare, href: "/dev/chat", badge: 2 },
    { key: "stats", label: "Statistiques", icon: BarChart3, href: "/dev/stats" },
  ],
  streamer: [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/streamer/dashboard" },
    { key: "bounties", label: "Mes Bounties", icon: Zap, href: "/streamer/bounties", badge: 1 },
    { key: "messages", label: "Messages", icon: MessageSquare, href: "/streamer/messages", badge: 1 },
    { key: "stats", label: "Statistiques", icon: BarChart3, href: "/streamer/stats" },
  ],
  viewer: [
    { key: "browse", label: "Streamers", icon: Users, href: "/viewer/browse" },
    { key: "nfts", label: "Mes NFTs", icon: Zap, href: "/viewer/nfts" },
  ],
};

export function Sidebar({ role, activeItem }: SidebarProps) {
  const items = menuItems[role];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950/50 min-h-screen p-6">
      <nav className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.key;

          return (
            <Link
              key={item.key}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all group",
                isActive
                  ? "bg-purple-600 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-xs",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-purple-500/20 text-purple-400 group-hover:bg-purple-500/30"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}