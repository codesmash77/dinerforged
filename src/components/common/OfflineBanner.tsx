import React from 'react';
import { WifiOff, Database, CheckCircle2 } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineBanner: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-2 text-xs font-medium text-amber-800 dark:text-amber-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <WifiOff className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>
            <strong>Offline Mode Active:</strong> You are currently disconnected from the internet.
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Custom Recipe CRUD (Saved)
          </span>
          <span className="flex items-center gap-1">
            <Database className="h-3.5 w-3.5 text-culinary-500" /> Flavor Vector Search (Local)
          </span>
        </div>
      </div>
    </div>
  );
};