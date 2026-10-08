import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Github } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-200 bg-white py-8 text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Copyright */}
        <div className="flex items-center gap-2 text-sm">
          <ChefHat className="h-5 w-5 text-culinary-500" />
          <span className="font-bold text-slate-900 dark:text-white">Dinerforged</span>
          <span className="text-slate-400">© {currentYear}</span>
          <span>•</span>
          <a
            href="https://github.com/codesmash77" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-medium hover:text-culinary-500 transition-colors"
          >
            <Github className="h-4 w-4" />
            <span>codesmash77</span>
          </a>
        </div>

        {/* Legal Links */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <Link to="/legal?type=privacy" className="hover:text-culinary-500 underline transition-colors">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link to="/legal?type=terms" className="hover:text-culinary-500 underline transition-colors">
            Terms of Service
          </Link>
        </div>

      </div>
    </footer>
  );
};