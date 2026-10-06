import React from 'react';
import { Users, Info, Plus, Minus } from 'lucide-react';

interface ServingScalerProps {
  baseServings: number;
  currentServings: number;
  onServingsChange: (newServings: number) => void;
}

export const ServingScaler: React.FC<ServingScalerProps> = ({
  baseServings,
  currentServings,
  onServingsChange,
}) => {
  const isNonLinear = currentServings !== baseServings;

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-culinary-500" />
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Yield / Servings
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onServingsChange(Math.max(1, currentServings - 1))}
            disabled={currentServings <= 1}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-100 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="Decrease Servings"
          >
            <Minus className="h-4 w-4" />
          </button>

          <span className="w-8 text-center text-lg font-bold text-slate-900 dark:text-white">
            {currentServings}
          </span>

          <button
            onClick={() => onServingsChange(currentServings + 1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="Increase Servings"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {isNonLinear && (
        <div className="flex items-start gap-2 pt-1 text-xs text-amber-700 dark:text-amber-400">
          <Info className="h-4 w-4 shrink-0 mt-0.5" />
          <span>
            <strong>Smart Scaler Active:</strong> Spices ($\alpha=0.75$) and leavening ($\alpha=0.65$) have been non-linearly adjusted to prevent over-seasoning.
          </span>
        </div>
      )}
    </div>
  );
};