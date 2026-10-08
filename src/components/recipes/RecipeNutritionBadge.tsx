import React from 'react';
import { Flame, Dumbbell, Wheat, Droplets } from 'lucide-react';
import { estimateNutrition } from '../../utils/nutritionCalculator';
import { Ingredient } from '../../types';

interface RecipeNutritionBadgeProps {
  ingredients: Ingredient[];
}

export const RecipeNutritionBadge: React.FC<RecipeNutritionBadgeProps> = ({ ingredients }) => {
  const rawIngStrings = (ingredients || []).map(
    (i) => `${i.amount || 1} ${i.unit || 'unit'} ${i.name}`
  );
  const nutrition = estimateNutrition(rawIngStrings);

  return (
    <div className="grid grid-cols-4 gap-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 p-2.5 border border-slate-100 dark:border-slate-800 text-center">
      <div>
        <div className="flex items-center justify-center text-amber-500 mb-0.5"><Flame className="h-3.5 w-3.5" /></div>
        <div className="text-[11px] font-bold text-slate-900 dark:text-white">{nutrition.calories}</div>
        <div className="text-[9px] text-slate-500 uppercase">kcal</div>
      </div>
      <div>
        <div className="flex items-center justify-center text-emerald-500 mb-0.5"><Dumbbell className="h-3.5 w-3.5" /></div>
        <div className="text-[11px] font-bold text-slate-900 dark:text-white">{nutrition.protein}g</div>
        <div className="text-[9px] text-slate-500 uppercase">Protein</div>
      </div>
      <div>
        <div className="flex items-center justify-center text-sky-500 mb-0.5"><Wheat className="h-3.5 w-3.5" /></div>
        <div className="text-[11px] font-bold text-slate-900 dark:text-white">{nutrition.carbs}g</div>
        <div className="text-[9px] text-slate-500 uppercase">Carbs</div>
      </div>
      <div>
        <div className="flex items-center justify-center text-rose-500 mb-0.5"><Droplets className="h-3.5 w-3.5" /></div>
        <div className="text-[11px] font-bold text-slate-900 dark:text-white">{nutrition.fat}g</div>
        <div className="text-[9px] text-slate-500 uppercase">Fat</div>
      </div>
    </div>
  );
};
