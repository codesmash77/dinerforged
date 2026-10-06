import React, { useState } from 'react';
import { X, Dices, Check, Sparkles } from 'lucide-react';
import { Recipe } from '../../types';
import { recipes as seedRecipes } from '../../data/recipes';
import { useAppStore } from '../../store/useAppStore';

interface PantryRouletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecipe: (recipe: Recipe) => void;
}

export const PantryRouletteModal: React.FC<PantryRouletteModalProps> = ({
  isOpen,
  onClose,
  onSelectRecipe,
}) => {
  const customRecipes = useAppStore((state) => state.customRecipes);
  const [pantryInput, setPantryInput] = useState('');
  const [matchedResults, setMatchedResults] = useState<{ recipe: Recipe; matchPct: number; matchedItems: string[] }[]>([]);

  if (!isOpen) return null;

  const handleMatch = () => {
    const available = pantryInput
      .toLowerCase()
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    if (available.length === 0) return;

    const allRecipes = [...customRecipes, ...seedRecipes];

    const results = allRecipes.map((recipe) => {
      const recipeIngs = recipe.ingredients.map((i) => i.name.toLowerCase());
      const matched = recipeIngs.filter((ing) =>
        available.some((avail) => ing.includes(avail) || avail.includes(ing))
      );

      const matchPct = Math.round((matched.length / recipeIngs.length) * 100);
      return { recipe, matchPct, matchedItems: matched };
    });

    results.sort((a, b) => b.matchPct - a.matchPct);
    setMatchedResults(results);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 my-8">
        <div className="flex items-center justify-between border-b pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Dices className="h-6 w-6 text-culinary-500" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Pantry Roulette — What Can I Cook Right Now?
            </h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Enter Available Fridge & Pantry Items (comma separated)
            </label>
            <textarea
              rows={2}
              value={pantryInput}
              onChange={(e) => setPantryInput(e.target.value)}
              placeholder="e.g. chicken, yogurt, butter, tomatoes, garlic"
              className="w-full rounded-xl border border-slate-300 p-3 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <button
            onClick={handleMatch}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-culinary-500 py-2.5 text-sm font-semibold text-slate-950 hover:bg-culinary-400 transition-colors"
          >
            <Sparkles className="h-4 w-4" /> Calculate Recipe Matches
          </button>

          {/* Results List */}
          {matchedResults.length > 0 && (
            <div className="max-h-64 overflow-y-auto space-y-2 pt-2 border-t dark:border-slate-800">
              {matchedResults.map(({ recipe, matchPct, matchedItems }) => (
                <div
                  key={recipe.id}
                  onClick={() => {
                    onSelectRecipe(recipe);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-culinary-50 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{recipe.title}</h4>
                      <span className="rounded-full bg-culinary-500/20 px-2 py-0.5 text-xs font-bold text-culinary-600 dark:text-culinary-400">
                        {matchPct}% Match
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Matched: {matchedItems.join(', ') || 'None'}
                    </span>
                  </div>
                  <Check className="h-4 w-4 text-emerald-500" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};