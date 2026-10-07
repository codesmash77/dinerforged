import React, { useState } from 'react';
import { Bookmark, ChefHat, Search } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { RecipeCard } from '../components/recipes/RecipeCard';
import { recipes as seedRecipes } from '../data/recipes';
import { Recipe } from '../types';

export const FavoritesPage: React.FC = () => {
  const { savedRecipeIds, customRecipes } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const allRecipes = [...customRecipes, ...seedRecipes];
  
  // Filter only bookmarked recipes
  const bookmarkedRecipes = allRecipes.filter((recipe) => 
    savedRecipeIds.includes(recipe.id) &&
    (recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     recipe.cuisine.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-6 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Bookmark className="h-7 w-7 text-amber-400 fill-amber-400" /> Favorite Recipes
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Your personal collection of bookmarked culinary creations.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="my-6 flex items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search favorites..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2 text-sm dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Bookmarked Grid */}
      {bookmarkedRecipes.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
          <Bookmark className="mx-auto h-12 w-12 text-slate-400 mb-3" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No favorite recipes yet</h3>
          <p className="text-xs text-slate-500 mt-1">Browse the recipe library and click the bookmark icon to save your favorites here!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onSelect={(r) => setSelectedRecipe(r)}
            />
          ))}
        </div>
      )}
    </div>
  );
};