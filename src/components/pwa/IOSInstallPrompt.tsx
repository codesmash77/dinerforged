import React, { useState, useEffect } from 'react';
import { Share, PlusSquare, X, Download } from 'lucide-react';

export const IOSInstallPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if device is iOS (iPhone, iPad, iPod)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    
    // Check if already running in standalone PWA mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;

    // Check if user previously dismissed the prompt
    const dismissed = localStorage.getItem('dinerforged_ios_prompt_dismissed');

    if (isIOS && !isStandalone && !dismissed) {
      // Delay prompt appearance slightly for a better user experience
      const timer = setTimeout(() => setShowPrompt(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismissPrompt = () => {
    setShowPrompt(false);
    localStorage.setItem('dinerforged_ios_prompt_dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-md rounded-2xl border border-culinary-500/30 bg-slate-900/95 p-4 text-white shadow-2xl backdrop-blur-md md:hidden animate-bounce-subtle">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-culinary-500/20 text-culinary-400">
            <Download className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Install Dinerforged</h4>
            <p className="text-xs text-slate-300">Add to your home screen for the best full-screen culinary experience.</p>
          </div>
        </div>
        <button
          onClick={dismissPrompt}
          className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-3.5 rounded-xl bg-slate-800/80 p-3 text-xs text-slate-200 space-y-2 border border-slate-700/50">
        <div className="flex items-center gap-2">
          <span>1. Tap the</span>
          <span className="inline-flex items-center gap-1 font-bold text-culinary-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
            <Share className="h-3.5 w-3.5" /> Share
          </span>
          <span>button in Safari's bottom menu bar.</span>
        </div>
        <div className="flex items-center gap-2">
          <span>2. Scroll down and tap</span>
          <span className="inline-flex items-center gap-1 font-bold text-culinary-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
            <PlusSquare className="h-3.5 w-3.5" /> Add to Home Screen
          </span>
        </div>
      </div>
    </div>
  );
};