'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type LoginMethod = 'zklogin' | 'slush' | null;
type UserRole = 'dev' | 'streamer' | 'viewer' | null;

interface TwitchData {
  username: string;
  userId: string;
  avatarUrl?: string;
  email?: string;
}

interface UserContextType {
  // Wallet Sui
  suiAddress: string | null;
  loginMethod: LoginMethod;
  isConnected: boolean;
  
  // Twitch
  twitchData: TwitchData | null;
  isTwitchConnected: boolean;
  
  // Rôle utilisateur
  userRole: UserRole;
  
  // Actions
  connect: (address: string, method: LoginMethod) => void;
  disconnect: () => void;
  connectTwitch: (twitchData: TwitchData) => void;
  disconnectTwitch: () => void;
  setRole: (role: UserRole) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = 'streamSui_user_session';
const TWITCH_STORAGE_KEY = 'streamSui_twitch_session';
const ROLE_STORAGE_KEY = 'streamSui_user_role';

/**
 * Provider global pour l'état utilisateur
 * Gère la persistence de la connexion wallet + Twitch via localStorage
 */
export function UserProvider({ children }: { children: ReactNode }) {
  const [suiAddress, setSuiAddress] = useState<string | null>(null);
  const [loginMethod, setLoginMethod] = useState<LoginMethod>(null);
  const [twitchData, setTwitchData] = useState<TwitchData | null>(null);
  const [userRole, setUserRoleState] = useState<UserRole>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Restaurer toutes les sessions depuis localStorage au montage (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      // Restaurer wallet Sui
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const { address, method } = JSON.parse(stored);
        setSuiAddress(address);
        setLoginMethod(method);
        console.log('[UserContext] Session wallet restaurée:', { address: address?.slice(0, 10) + '...', method });
      }

      // Restaurer Twitch
      const storedTwitch = localStorage.getItem(TWITCH_STORAGE_KEY);
      if (storedTwitch) {
        const twitch = JSON.parse(storedTwitch);
        
        // Nettoyer les anciennes sessions mock de développement
        if (twitch.username === 'dev_twitch' || twitch.userId === 'dev_1') {
          console.warn('[UserContext] Session mock détectée, nettoyage...');
          localStorage.removeItem(TWITCH_STORAGE_KEY);
        } else {
          setTwitchData(twitch);
          console.log('[UserContext] Session Twitch restaurée:', { username: twitch.username });
        }
      }

      // Restaurer rôle
      const storedRole = localStorage.getItem(ROLE_STORAGE_KEY);
      if (storedRole && ['dev', 'streamer', 'viewer'].includes(storedRole)) {
        setUserRoleState(storedRole as UserRole);
        console.log('[UserContext] Rôle restauré:', storedRole);
      }
    } catch (error) {
      console.error('[UserContext] Erreur restauration sessions:', error);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TWITCH_STORAGE_KEY);
      localStorage.removeItem(ROLE_STORAGE_KEY);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const connect = (address: string, method: LoginMethod) => {
    setSuiAddress(address);
    setLoginMethod(method);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ address, method }));
      console.log('[UserContext] Connexion wallet:', { address: address?.slice(0, 10) + '...', method });
    }
  };

  const disconnect = () => {
    setSuiAddress(null);
    setLoginMethod(null);
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.clear(); // Nettoyer aussi les données temporaires
      console.log('[UserContext] Déconnexion wallet complète');
    }
  };

  const connectTwitch = (data: TwitchData) => {
    setTwitchData(data);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(TWITCH_STORAGE_KEY, JSON.stringify(data));
      console.log('[UserContext] Connexion Twitch:', { username: data.username, userId: data.userId });
    }
  };

  const disconnectTwitch = () => {
    setTwitchData(null);
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TWITCH_STORAGE_KEY);
      console.log('[UserContext] Déconnexion Twitch');
    }
  };

  const setRole = (role: UserRole) => {
    setUserRoleState(role);
    
    if (typeof window !== 'undefined') {
      if (role) {
        localStorage.setItem(ROLE_STORAGE_KEY, role);
        console.log('[UserContext] Rôle défini:', role);
      } else {
        localStorage.removeItem(ROLE_STORAGE_KEY);
      }
    }
  };

  // Ne pas render avant hydratation pour éviter les problèmes SSR/CSR
  if (!isHydrated) {
    return null;
  }

  return (
    <UserContext.Provider
      value={{
        suiAddress,
        loginMethod,
        isConnected: !!suiAddress,
        twitchData,
        isTwitchConnected: !!twitchData,
        userRole,
        connect,
        disconnect,
        connectTwitch,
        disconnectTwitch,
        setRole,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

/**
 * Hook pour accéder au context utilisateur
 * Utilisable depuis n'importe quel composant de l'app
 */
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser doit être utilisé dans un UserProvider');
  }
  return context;
}
