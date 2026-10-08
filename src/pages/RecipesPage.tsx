import React, { useState, useMemo } from 'react';
import { Search, Plus, X, Play, RotateCcw } from 'lucide-react';
import { recipes as seedRecipes } from '../data/recipes';
import { Recipe } from '../types';
import { useAppStore } from '../store/useAppStore';
import { RecipeCard } from '../components/recipes/RecipeCard';
import { ServingScaler } from '../components/recipes/ServingScaler';
import { CustomRecipeModal } from '../components/recipes/CustomRecipeModal';
import { HandsFreeCookingMode } from '../components/recipes/HandsFreeCookingMode';
import { smartScaleIngredients } from '../utils/smartScaler';
import { findSmartSubstitute } from '../utils/vectorSearch';

export const RecipesPage: React.FC = () => {
  // 1. Pull customRecipes, deletedRecipeIds, and purge action from store
  const customRecipes = useAppStore((state) => state.customRecipes);
  const deletedRecipeIds = useAppStore((state) => state.deletedRecipeIds || []);
  const purgeAndResetStorage = useAppStore((state) => state.purgeAndResetStorage);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('All');

  // Modals & Active Selections
  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);
  const [recipeToEdit, setRecipeToEdit] = useState<Recipe | null>(null);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isHandsFreeActive, setIsHandsFreeActive] = useState(false);
  const [currentServings, setCurrentServings] = useState<number>(4);

  // 2. Combine seed and custom recipes, filtering out any deleted recipe IDs (Step 2)
  const allRecipes = useMemo(() => {
    const combined = [...customRecipes, ...seedRecipes];
    return combined.filter((recipe) => !deletedRecipeIds.includes(recipe.id));
  }, [customRecipes, deletedRecipeIds]);

  // Cuisine filter chips
  const cuisines = useMemo(() => {
    const list = Array.from(new Set(allRecipes.map((r) => r.cuisine)));
    return ['All', 'Custom', ...list];
  }, [allRecipes]);

  // Filtered recipe list
  const filteredRecipes = useMemo(() => {
    return allRecipes.filter((recipe) => {
      const matchesSearch =
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.ingredients.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCuisine =
        selectedCuisine === 'All'
          ? true
          : selectedCuisine === 'Custom'
          ? recipe.isCustom
          : recipe.cuisine === selectedCuisine;

      return matchesSearch && matchesCuisine;
    });
  }, [allRecipes, searchQuery, selectedCuisine]);

  const handleSelectRecipe = (recipe: Recipe) => {
    setActiveRecipe(recipe);
    setCurrentServings(recipe.baseServings);
  };

  const scaledIngredients = activeRecipe
    ? smartScaleIngredients(activeRecipe.ingredients, activeRecipe.baseServings, currentServings)
    : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pb-24">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">
            World Recipes & Custom Library
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Explore world culinary staples or create custom dishes with non-linear yield scaling.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Step 3: Optional Purge/Reset Stale Data Button */}
          <button
            onClick={() => {
              if (window.confirm('Clear stale cache and reset workspace storage? Bookmarks will remain safe.')) {
                purgeAndResetStorage();
              }
            }}
            title="Purge corrupted state & reset storage"
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 px-3 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5 text-red-400" /> Reset Stale Storage
          </button>

          <button
            onClick={() => { setRecipeToEdit(null); setIsCustomModalOpen(true); }}
            className="flex items-center gap-2 rounded-xl bg-culinary-500 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-culinary-400 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" /> Create Custom Recipe
          </button>
        </div>
      </div>

      {/* Search & Cuisine Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search recipes, ingredients, or tags..."
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {cuisines.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCuisine(c)}
              className={`rounded-lg px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCuisine === c
                  ? 'bg-slate-900 text-white dark:bg-culinary-500 dark:text-slate-950'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onSelect={handleSelectRecipe}
            onEdit={(r) => { setRecipeToEdit(r); setIsCustomModalOpen(true); }}
          />
        ))}
      </div>

      {/* Recipe Details Modal */}
      {activeRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 my-8">
            <div className="flex items-start justify-between border-b pb-4 dark:border-slate-800">
              <div>
                <span className="text-xs font-semibold uppercase text-culinary-500">{activeRecipe.cuisine}</span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{activeRecipe.title}</h2>
              </div>
              <button onClick={() => setActiveRecipe(null)} className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-4 space-y-6 max-h-[70vh] overflow-y-auto pr-2">
              <ServingScaler
                baseServings={activeRecipe.baseServings}
                currentServings={currentServings}
                onServingsChange={setCurrentServings}
              />

              <div>
                <h3 className="text-md font-bold text-slate-900 dark:text-white mb-3">Ingredients</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {scaledIngredients.map((ing) => {
                    const sub = findSmartSubstitute(ing.name);
                    return (
                      <div key={ing.id} className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-800/50">
                        <div className="flex justify-between text-sm font-semibold text-slate-900 dark:text-slate-100">
                          <span>{ing.name}</span>
                          <span className="text-culinary-600 dark:text-culinary-400">{ing.amount} {ing.unit}</span>
                        </div>
                        {sub && (
                          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            💡 Sub: <strong>{sub.substitute}</strong> ({sub.reasoning})
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-md font-bold text-slate-900 dark:text-white mb-3">Instructions</h3>
                <ol className="space-y-3">
                  {activeRecipe.instructions.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-culinary-500/20 text-xs font-bold text-culinary-600 dark:text-culinary-400">
                        {idx + 1}
                      </span>
                      <span>{typeof step === 'string' ? step : step.text}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t pt-4 dark:border-slate-800">
              <button
                onClick={() => setIsHandsFreeActive(true)}
                className="flex items-center gap-2 rounded-xl bg-culinary-500 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-culinary-400 transition-colors"
              >
                <Play className="h-4 w-4" /> Start Cooking Mode
              </button>
            </div>
          </div>
        </div>
      )}

      <CustomRecipeModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        recipeToEdit={recipeToEdit}
      />

      {isHandsFreeActive && activeRecipe && (
        <HandsFreeCookingMode
          recipe={activeRecipe}
          onClose={() => setIsHandsFreeActive(false)}
        />
      )}
    </div>
  );
};
