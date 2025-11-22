'use client';

import { ReactNode } from 'react';
import { SuiProvider } from '../providers/SuiProvider';
import { UserProvider } from '../context/UserContext';

/**
 * Provider racine de l'application
 * Contient tous les providers nécessaires dans le bon ordre
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <SuiProvider>
      <UserProvider>
        {children}
      </UserProvider>
    </SuiProvider>
  );
}
