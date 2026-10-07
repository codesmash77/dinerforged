import React from 'react';
import { Bookmark, Clock, Flame, Edit, Trash2, ChefHat } from 'lucide-react';
import { Recipe } from '../../types';
import { useAppStore } from '../../store/useAppStore';

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
  onEdit?: (recipe: Recipe) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onSelect, onEdit }) => {
  const { savedRecipeIds, toggleSaveRecipe, deleteCustomRecipe } = useAppStore();
  const isBookmarked = savedRecipeIds.includes(recipe.id);

  // Resolve cover image from images array or imageUrl fallback
  const coverImage = recipe.imageUrl?.[0] || recipe.imageUrl|| 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80';

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete custom recipe "${recipe.title}"?`)) {
      deleteCustomRecipe(recipe.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) onEdit(recipe);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveRecipe(recipe.id);
  };

  return (
    <div
      onClick={() => onSelect(recipe)}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 cursor-pointer"
    >
      {/* Recipe Header Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={coverImage}
          alt={recipe.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="rounded-full bg-slate-900/70 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
            {recipe.cuisine}
          </span>
          {recipe.isCustom && (
            <span className="flex items-center gap-1 rounded-full bg-culinary-500 px-2.5 py-1 text-xs font-semibold text-slate-950">
              <ChefHat className="h-3 w-3" /> Custom
            </span>
          )}
        </div>

        {/* Bookmark & Actions */}
        <div className="absolute top-3 right-3 flex items-center gap-1">
          {recipe.isCustom && (
            <>
              <button
                onClick={handleEdit}
                aria-label="Edit Recipe"
                className="rounded-full bg-slate-900/70 p-2 text-white hover:bg-slate-900 backdrop-blur-md transition-colors"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={handleDelete}
                aria-label="Delete Recipe"
                className="rounded-full bg-slate-900/70 p-2 text-red-400 hover:bg-red-600 hover:text-white backdrop-blur-md transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
          <button
            onClick={handleBookmark}
            aria-label="Bookmark Recipe"
            className="rounded-full bg-slate-900/70 p-2 text-white hover:bg-slate-900 backdrop-blur-md transition-colors"
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>
        </div>

        {/* Card Title Overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-lg font-bold text-white line-clamp-1 drop-shadow-sm">
            {recipe.title}
          </h3>
        </div>
      </div>

      {/* Card Metadata Footer */}
      <div className="flex items-center justify-between p-4 text-xs font-medium text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5 text-culinary-500" />
          <span>{(recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0)} mins</span>
        </div>
        <div className="flex items-center gap-1">
          <Flame className="h-3.5 w-3.5 text-terracotta-500" />
          <span>{recipe.difficulty}</span>
        </div>
        <div className="text-slate-500">
          <span>{recipe.ingredients?.length || 0} items</span>
        </div>
      </div>
    </div>
  );
};