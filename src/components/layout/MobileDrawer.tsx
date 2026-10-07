import React from 'react';
import { NavLink } from 'react-router-dom';
import { X, BookOpen, Bookmark, UtensilsCrossed, Calendar, ShoppingCart, Sparkles } from 'lucide-react';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const secondaryLinks = [
    { to: '/', label: 'Recipes', icon: UtensilsCrossed },
    { to: '/planner', label: 'Planner', icon: Calendar },
    { to: '/shopping', label: 'Shopping', icon: ShoppingCart },
    { to: '/techniques', label: 'Culinary Guides', icon: BookOpen },
    { to: '/favorites', label: 'Favorite Bookmarks', icon: Bookmark },
    { to: '/ai-chef', label: 'AI Chef', icon: Sparkles },
  ];

  return (
    <div className="fixed inset-0 z-50 flex md:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Slide-out Drawer Panel */}
      <div className="relative ml-auto flex w-full max-w-xs flex-col bg-white dark:bg-slate-900 shadow-2xl p-6 z-50">
        <div className="flex items-center justify-between border-b pb-4 dark:border-slate-800">
          <span className="text-base font-bold text-slate-900 dark:text-white">Dinerforged Menu</span>
          <button 
            onClick={onClose} 
            className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-6 flex flex-col gap-2">
          {secondaryLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-culinary-500/10 text-culinary-600 dark:text-culinary-400'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};