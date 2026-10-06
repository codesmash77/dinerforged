import React from 'react';
import { Wrench, ShieldCheck, Flame, Info } from 'lucide-react';
import { Utensil } from '../../types';

interface UtensilCardProps {
  utensil: Utensil;
}

export const UtensilCard: React.FC<UtensilCardProps> = ({ utensil }) => {
  const thermalColors = {
    High: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    Medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    Low: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  };

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div>
        {/* Header Badge */}
        <div className="flex items-center justify-between mb-3">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {utensil.category}
          </span>
          <div className={`flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold ${thermalColors[utensil.thermalRetention]}`}>
            <Flame className="h-3 w-3" />
            <span>Thermal Mass: {utensil.thermalRetention}</span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          {utensil.name}
        </h3>

        {/* Material Specs */}
        <div className="mb-4 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
          <Info className="h-3.5 w-3.5 shrink-0 text-culinary-500 mt-0.5" />
          <span>{utensil.materialInfo}</span>
        </div>

        {/* Care Instructions */}
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800/80 dark:bg-slate-800/40 mb-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Maintenance Guide
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {utensil.careInstructions}
          </p>
        </div>
      </div>

      {/* Pro Tips */}
      <div className="border-t pt-3 dark:border-slate-800">
        <span className="text-xs font-bold text-culinary-600 dark:text-culinary-400">Pro Tip: </span>
        <span className="text-xs text-slate-600 dark:text-slate-400">{utensil.proTips[0]}</span>
      </div>
    </div>
  );
};