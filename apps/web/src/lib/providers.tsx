'use client';

import { ReactNode } from 'react';
import { SuiProvider } from '../providers/SuiProvider';
import { UserProvider } from '../context/UserContext';
import { NotificationProvider } from './NotificationContext';

/**
 * Provider racine de l'application
 * Contient tous les providers nécessaires dans le bon ordre
 * - SuiProvider: Connexion blockchain Sui
 * - UserProvider: Gestion utilisateur (wallet + Twitch + rôle)
 * - NotificationProvider: Système de notifications en temps réel
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <SuiProvider>
      <UserProvider>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </UserProvider>
    </SuiProvider>
  );
}
