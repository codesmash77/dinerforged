import React, { useState } from 'react';
import { Search, Globe, Plus, CheckCircle2, Flame, Dumbbell, Wheat, Droplets, Loader2, Utensils } from 'lucide-react';
import { normalizeMealDbRecipe, NormalizedRecipe } from '../utils/recipeNormalizer';

export const GlobalSearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState<NormalizedRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [importedIds, setImportedIds] = useState<Record<string, boolean>>({});

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    setRecipes([]);

    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query.trim())}`);
      const data = await response.json();

      if (data && data.meals) {
        const normalized = data.meals.map((meal: any) => normalizeMealDbRecipe(meal));
        setRecipes(normalized);
      } else {
        setRecipes([]);
      }
    } catch (error) {
      console.error('Failed to query global recipe API:', error);
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportRecipe = (recipe: NormalizedRecipe) => {
    try {
      const existingRaw = localStorage.getItem('dinerforged_recipes');
      const existingRecipes = existingRaw ? JSON.parse(existingRaw) : [];
      
      if (existingRecipes.some((r: any) => r.id === recipe.id)) {
        setImportedIds((prev) => ({ ...prev, [recipe.id]: true }));
        return;
      }

      const updatedRecipes = [recipe, ...existingRecipes];
      localStorage.setItem('dinerforged_recipes', JSON.stringify(updatedRecipes));
      
      setImportedIds((prev) => ({ ...prev, [recipe.id]: true }));
    } catch (e) {
      console.error('Error saving recipe to local store:', e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-2.5 text-culinary-500 font-bold text-sm tracking-wide uppercase">
          <Globe className="h-5 w-5" />
          <span>Global Culinary Explorer</span>
        </div>
        <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mt-1">
          Global Recipe Search
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Search thousands of world recipes, inspect estimated macronutrients, and import them instantly into your local cookbook.
        </p>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search recipes (e.g., lasagna, chicken curry, tacos)..."
            className="w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 py-3.5 text-sm text-slate-900 shadow-sm focus:border-culinary-500 focus:outline-none focus:ring-2 focus:ring-culinary-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center gap-2 rounded-2xl bg-culinary-500 px-6 py-3.5 text-sm font-bold text-slate-950 hover:bg-culinary-400 transition-colors disabled:opacity-50 shadow-lg shadow-culinary-500/20"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
          <span>Search</span>
        </button>
      </form>

      {/* Search Results Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-culinary-500" />
          <p className="text-sm font-medium">Querying global repositories...</p>
        </div>
      ) : recipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => {
            const isImported = importedIds[recipe.id];
            return (
              <div
                key={recipe.id}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 transition-all duration-300"
              >
                {/* Thumbnail */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <span className="absolute top-3 right-3 rounded-full bg-slate-950/70 backdrop-blur-md px-3 py-1 text-xs font-bold text-culinary-400 border border-slate-700/50">
                    {recipe.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white line-clamp-1">
                      {recipe.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 line-clamp-2">
                      {recipe.description}
                    </p>
                  </div>

                  {/* Macro Badges */}
                  <div className="grid grid-cols-4 gap-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 p-2.5 border border-slate-100 dark:border-slate-800 text-center">
                    <div>
                      <div className="flex items-center justify-center text-amber-500 mb-0.5"><Flame className="h-3.5 w-3.5" /></div>
                      <div className="text-[11px] font-bold text-slate-900 dark:text-white">{recipe.nutrition.calories}</div>
                      <div className="text-[9px] text-slate-500 uppercase">kcal</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center text-emerald-500 mb-0.5"><Dumbbell className="h-3.5 w-3.5" /></div>
                      <div className="text-[11px] font-bold text-slate-900 dark:text-white">{recipe.nutrition.protein}g</div>
                      <div className="text-[9px] text-slate-500 uppercase">Protein</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center text-sky-500 mb-0.5"><Wheat className="h-3.5 w-3.5" /></div>
                      <div className="text-[11px] font-bold text-slate-900 dark:text-white">{recipe.nutrition.carbs}g</div>
                      <div className="text-[9px] text-slate-500 uppercase">Carbs</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center text-rose-500 mb-0.5"><Droplets className="h-3.5 w-3.5" /></div>
                      <div className="text-[11px] font-bold text-slate-900 dark:text-white">{recipe.nutrition.fat}g</div>
                      <div className="text-[9px] text-slate-500 uppercase">Fat</div>
                    </div>
                  </div>

                  {/* Import Action */}
                  <button
                    onClick={() => handleImportRecipe(recipe)}
                    disabled={isImported}
                    className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition-all shadow-sm ${
                      isImported
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 cursor-default'
                        : 'bg-culinary-500 text-slate-950 hover:bg-culinary-400'
                    }`}
                  >
                    {isImported ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Imported to Cookbook</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        <span>Import to Cookbook</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : hasSearched ? (
        <div className="text-center py-20 text-slate-400 space-y-2">
          <Utensils className="h-10 w-10 mx-auto opacity-40" />
          <p className="text-sm font-medium">No global recipes found matching "{query}". Try another term!</p>
        </div>
      ) : (
        <div className="text-center py-20 text-slate-400 space-y-2">
          <Globe className="h-12 w-12 mx-auto text-culinary-500/40" />
          <p className="text-sm font-medium">Enter a keyword above to explore world recipes instantly.</p>
        </div>
      )}
    </div>
  );
};
