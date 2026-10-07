import React from 'react';
import { NavLink } from 'react-router-dom';
import { UtensilsCrossed, Calendar, ShoppingCart, Sparkles, Download } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const MobileNav: React.FC = () => {
  const { isInstallable, installPWA } = usePWAInstall();

  // Core mobile utility items to prevent clutter and overlap
  const navLinks = [
    { to: '/', label: 'Recipes', icon: UtensilsCrossed },
    { to: '/planner', label: 'Planner', icon: Calendar },
    { to: '/shopping', label: 'Shopping', icon: ShoppingCart },
    { to: '/ai-chef', label: 'AI Chef', icon: Sparkles },
  ];

  const totalColumns = navLinks.length + (isInstallable ? 1 : 0);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-950/95 md:hidden shadow-lg">
      <div 
        className="grid h-16 items-center justify-items-center"
        style={{ gridTemplateColumns: `repeat(${totalColumns}, minmax(0, 1fr))` }}
      >
        {navLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full gap-1 text-[11px] font-medium transition-colors ${
                isActive
                  ? 'text-culinary-500 dark:text-culinary-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span className="truncate max-w-[60px]">{label}</span>
          </NavLink>
        ))}

        {/* Optional Mobile PWA Install Button */}
        {isInstallable && (
          <button
            onClick={installPWA}
            className="flex flex-col items-center justify-center w-full h-full gap-1 text-[11px] font-bold text-culinary-500 animate-pulse hover:opacity-80 transition-opacity"
          >
            <Download className="h-5 w-5 shrink-0" />
            <span className="truncate max-w-[60px]">Install</span>
          </button>
        )}
      </div>
    </nav>
  );
};