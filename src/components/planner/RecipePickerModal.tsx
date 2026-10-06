import React, { useState } from 'react';
import { X, Search, Utensils, Plus } from 'lucide-react';
import { Recipe } from '../../types';
import { recipes as seedRecipes } from '../../data/recipes';
import { useAppStore } from '../../store/useAppStore';

interface RecipePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecipe: (recipe: Recipe) => void;
  dayLabel: string;
  mealTypeLabel: string;
}

export const RecipePickerModal: React.FC<RecipePickerModalProps> = ({
  isOpen,
  onClose,
  onSelectRecipe,
  dayLabel,
  mealTypeLabel,
}) => {
  const customRecipes = useAppStore((state) => state.customRecipes);
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const allRecipes = [...customRecipes, ...seedRecipes];
  const filtered = allRecipes.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 my-8">
        <div className="flex items-center justify-between border-b pb-4 dark:border-slate-800">
          <div>
            <span className="text-xs font-semibold uppercase text-culinary-500">
              Assign to {dayLabel.toUpperCase()} • {mealTypeLabel.toUpperCase()}
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Select Recipe
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="relative my-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search recipes or cuisines..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        {/* Recipe Selection List */}
        <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
          {filtered.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => {
                onSelectRecipe(recipe);
                onClose();
              }}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-culinary-50 dark:border-slate-800 dark:bg-slate-800/50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0">
                  <img
                    src={recipe.imageUrl || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80'}
                    alt={recipe.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {recipe.title}
                  </h4>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {recipe.cuisine} • {recipe.prepTimeMinutes + recipe.cookTimeMinutes}m
                  </span>
                </div>
              </div>
              <Plus className="h-4 w-4 text-culinary-600 dark:text-culinary-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};