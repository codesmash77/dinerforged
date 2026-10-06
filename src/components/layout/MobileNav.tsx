import React from 'react';
import { NavLink } from 'react-router-dom';
import { UtensilsCrossed, Calendar, ShoppingCart, BookOpen, Sparkles, Download } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const MobileNav: React.FC = () => {
  const { isInstallable, installPWA } = usePWAInstall();

  const navLinks = [
    { to: '/', label: 'Recipes', icon: UtensilsCrossed },
    { to: '/planner', label: 'Planner', icon: Calendar },
    { to: '/shopping', label: 'Shopping', icon: ShoppingCart },
    { to: '/techniques', label: 'Guides', icon: BookOpen },
    { to: '/ai-chef', label: 'AI Chef', icon: Sparkles },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/90 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-950/90 md:hidden">
      <div className={`grid h-16 items-center justify-items-center ${isInstallable ? 'grid-cols-6' : 'grid-cols-5'}`}>
        {navLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
                isActive
                  ? 'text-culinary-500 dark:text-culinary-400'
                  : 'text-slate-500 dark:text-slate-400'
              }`
            }
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </NavLink>
        ))}

        {/* Optional Mobile PWA Install Icon */}
        {isInstallable && (
          <button
            onClick={installPWA}
            className="flex flex-col items-center gap-1 text-[10px] font-bold text-culinary-500 animate-pulse"
          >
            <Download className="h-5 w-5" />
            <span>Install</span>
          </button>
        )}
      </div>
    </nav>
  );
};