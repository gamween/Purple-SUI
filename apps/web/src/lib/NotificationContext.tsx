import { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner";

export interface Notification {
  id: string;
  type: "bounty_offer" | "bounty_accepted" | "bounty_rejected" | "message" | "donation";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  metadata?: {
    bountyId?: string;
    devId?: string;
    streamerId?: string;
    conversationId?: string;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "bounty_offer",
      title: "Nouvelle offre de bounty",
      message: "GameDev Studio vous a envoyé une offre de bounty pour 'Sui 8192 Promo'",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      actionUrl: "/streamer/messages?convId=1",
      metadata: {
        bountyId: "m1",
        devId: "dev1",
        conversationId: "1"
      }
    },
    {
      id: "2",
      type: "message",
      title: "Nouveau message",
      message: "Primacy Team vous a envoyé un message",
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      read: false,
      actionUrl: "/streamer/messages?convId=2",
      metadata: {
        conversationId: "2"
      }
    },
    {
      id: "3",
      type: "donation",
      title: "Nouvelle donation",
      message: "Vous avez reçu 15 SUI sur votre stream",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: true,
      metadata: {}
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Afficher un toast
    const typeEmojis = {
      bounty_offer: "🎯",
      bounty_accepted: "✅",
      bounty_rejected: "❌",
      message: "💬",
      donation: "💰"
    };

    toast.success(`${typeEmojis[notification.type]} ${notification.title}`, {
      description: notification.message,
      duration: 5000,
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
