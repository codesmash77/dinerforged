import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChefHat, BookOpen, Calendar, ShoppingCart, Sparkles, Sun, Moon, WifiOff, UtensilsCrossed, Download, Bookmark, Menu } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { MobileDrawer } from './MobileDrawer';

export const Navbar: React.FC = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const isOnline = useOnlineStatus();
  const { isInstallable, installPWA } = usePWAInstall();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Recipes', icon: UtensilsCrossed },
    { to: '/planner', label: 'Planner', icon: Calendar },
    { to: '/shopping', label: 'Shopping', icon: ShoppingCart },
    { to: '/techniques', label: 'Techniques', icon: BookOpen },
    { to: '/favorites', label: 'Favorites', icon: Bookmark },
    { to: '/ai-chef', label: 'AI Chef', icon: Sparkles },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80 transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Mobile Menu Trigger */}
        <div className="flex items-center gap-3">
          {/* Hamburger Menu Button (Mobile Only) */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Open Navigation Menu"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>

          <NavLink to="/" className="flex items-center gap-2 text-culinary-500 font-display font-bold text-xl tracking-tight">
            <ChefHat className="h-7 w-7 text-culinary-500" />
            <span className="text-slate-900 dark:text-white">Diner<span className="text-culinary-500">forged</span></span>
          </NavLink>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-culinary-50 text-culinary-600 dark:bg-slate-800/80 dark:text-culinary-400'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Status Indicators, Install Widget & Theme Switch */}
        <div className="flex items-center gap-2 sm:gap-3">
          {!isOnline && (
            <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
              <WifiOff className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Offline Mode</span>
            </div>
          )}

          {/* PWA Download / Install Widget Button */}
          {isInstallable && (
            <button
              onClick={installPWA}
              title="Install Dinerforged App"
              aria-label="Install App"
              className="flex items-center gap-1.5 rounded-lg bg-culinary-500/10 px-3 py-1.5 text-xs font-bold text-culinary-600 hover:bg-culinary-500/20 dark:bg-culinary-500/20 dark:text-culinary-400 dark:hover:bg-culinary-500/30 transition-colors"
            >
              <Download className="h-4 w-4 text-culinary-500" />
              <span className="hidden sm:inline">Install App</span>
            </button>
          )}

          {/* Dark Mode Switch */}
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle Dark Mode"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
          >
            {darkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-slate-600" />}
          </button>
        </div>

      </div>

      {/* Slide-out Mobile Menu Drawer */}
      <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </header>
  );
};