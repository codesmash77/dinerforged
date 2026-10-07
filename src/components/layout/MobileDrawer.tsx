import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { X, BookOpen, Bookmark, UtensilsCrossed, Calendar, ShoppingCart, Sparkles } from 'lucide-react';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300); // Wait for transition out
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen && !isVisible) return null;

  const secondaryLinks = [
    { to: '/', label: 'Recipes', icon: UtensilsCrossed },
    { to: '/planner', label: 'Planner', icon: Calendar },
    { to: '/shopping', label: 'Shopping', icon: ShoppingCart },
    { to: '/techniques', label: 'Culinary Guides', icon: BookOpen },
    { to: '/favorites', label: 'Favorite Bookmarks', icon: Bookmark },
    { to: '/ai-chef', label: 'AI Chef', icon: Sparkles },
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden overflow-hidden">
      {/* Backdrop overlay with fade animation */}
      <div 
        className={`fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose} 
      />

      {/* Slide-out Drawer Panel with smooth translate-x animation */}
      <div 
        className={`absolute inset-y-0 right-0 z-50 flex h-full w-4/5 max-w-xs flex-col bg-slate-900 text-white shadow-2xl p-6 border-l border-slate-800 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <span className="text-base font-bold text-white tracking-wide">Dinerforged Menu</span>
          <button 
            onClick={onClose} 
            className="rounded-lg p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close Menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-6 flex flex-col gap-2 overflow-y-auto pr-1">
          {secondaryLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-culinary-500/20 text-culinary-400 font-bold border-l-4 border-culinary-500'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon className="h-5 w-5 text-culinary-500 shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};