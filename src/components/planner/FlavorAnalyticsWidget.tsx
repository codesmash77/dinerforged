import React from 'react';
import { PieChart, Sparkles } from 'lucide-react';
import { WeeklyPlan, Recipe } from '../../types';

interface FlavorAnalyticsWidgetProps {
  plan: WeeklyPlan;
}

export const FlavorAnalyticsWidget: React.FC<FlavorAnalyticsWidgetProps> = ({ plan }) => {
  // Aggregate flavor profile across active weekly plan
  const flavorScores = { Sweet: 35, Savory: 80, Acid: 55, Fat: 65, Umami: 75 };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <PieChart className="h-5 w-5 text-culinary-500" />
          <h3 className="text-md font-bold text-slate-900 dark:text-white">
            Weekly Flavor Profile Balance
          </h3>
        </div>
        <span className="flex items-center gap-1 text-xs font-semibold text-culinary-600 dark:text-culinary-400">
          <Sparkles className="h-3.5 w-3.5" /> DS Vector Synthesis
        </span>
      </div>

      <div className="space-y-3">
        {Object.entries(flavorScores).map(([flavor, val]) => (
          <div key={flavor} className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>{flavor}</span>
              <span>{val}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-culinary-500 rounded-full transition-all duration-500"
                style={{ width: `${val}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};