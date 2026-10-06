import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Recipe, Ingredient, IngredientCategory } from '../../types';
import { useAppStore } from '../../store/useAppStore';

interface CustomRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipeToEdit?: Recipe | null;
}

const CATEGORIES: IngredientCategory[] = [
  'Produce', 'Pantry', 'Dairy', 'Meat', 'Seafood', 'Spices', 'Leavening', 'Oil & Fat', 'Other'
];

export const CustomRecipeModal: React.FC<CustomRecipeModalProps> = ({
  isOpen,
  onClose,
  recipeToEdit,
}) => {
  const { addCustomRecipe, updateCustomRecipe } = useAppStore();

  const [title, setTitle] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [prepTime, setPrepTime] = useState(15);
  const [cookTime, setCookTime] = useState(20);
  const [baseServings, setBaseServings] = useState(4);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [instructions, setInstructions] = useState<string[]>(['']);

  useEffect(() => {
    if (recipeToEdit) {
      setTitle(recipeToEdit.title);
      setCuisine(recipeToEdit.cuisine);
      setPrepTime(recipeToEdit.prepTimeMinutes);
      setCookTime(recipeToEdit.cookTimeMinutes);
      setBaseServings(recipeToEdit.baseServings);
      setDifficulty(recipeToEdit.difficulty);
      setIngredients(recipeToEdit.ingredients);
      setInstructions(recipeToEdit.instructions);
    } else {
      resetForm();
    }
  }, [recipeToEdit, isOpen]);

  const resetForm = () => {
    setTitle('');
    setCuisine('International');
    setPrepTime(15);
    setCookTime(20);
    setBaseServings(4);
    setDifficulty('Medium');
    setIngredients([{ id: '1', name: '', amount: 1, unit: 'g', category: 'Pantry' }]);
    setInstructions(['']);
  };

  if (!isOpen) return null;

  const handleAddIngredient = () => {
    setIngredients([
      ...ingredients,
      { id: Date.now().toString(), name: '', amount: 1, unit: 'g', category: 'Pantry' },
    ]);
  };

  const handleRemoveIngredient = (id: string) => {
    setIngredients(ingredients.filter((item) => item.id !== id));
  };

  const handleIngredientChange = (id: string, field: keyof Ingredient, value: any) => {
    setIngredients(
      ingredients.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const recipeData: Recipe = {
      id: recipeToEdit ? recipeToEdit.id : `custom-${Date.now()}`,
      title,
      cuisine,
      originStory: 'Custom home creation',
      culturalContext: 'Personal recipe collection',
      funFact: 'Handcrafted in local Dinerforged workspace',
      prepTimeMinutes: prepTime,
      cookTimeMinutes: cookTime,
      baseServings,
      difficulty,
      ingredients: ingredients.filter((i) => i.name.trim() !== ''),
      instructions: instructions.filter((i) => i.trim() !== ''),
      tags: ['Custom', cuisine],
      isCustom: true,
    };

    if (recipeToEdit) {
      updateCustomRecipe(recipeToEdit.id, recipeData);
    } else {
      addCustomRecipe(recipeData);
    }

    onClose();
    resetForm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 my-8">
        <div className="flex items-center justify-between border-b pb-4 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {recipeToEdit ? 'Edit Custom Recipe' : 'Create Custom Recipe'}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 max-h-[75vh] overflow-y-auto pr-2">
          {/* Title & Cuisine */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Recipe Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Grandma's Garlic Bread"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Cuisine</label>
              <input
                type="text"
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                placeholder="e.g. Italian, Fusion"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Times & Servings */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Prep (mins)</label>
              <input
                type="number"
                min="1"
                value={prepTime}
                onChange={(e) => setPrepTime(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Cook (mins)</label>
              <input
                type="number"
                min="0"
                value={cookTime}
                onChange={(e) => setCookTime(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Base Servings</label>
              <input
                type="number"
                min="1"
                value={baseServings}
                onChange={(e) => setBaseServings(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Ingredients Form */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">Ingredients</label>
              <button
                type="button"
                onClick={handleAddIngredient}
                className="flex items-center gap-1 text-xs font-medium text-culinary-600 hover:text-culinary-500"
              >
                <Plus className="h-3.5 w-3.5" /> Add Ingredient
              </button>
            </div>
            {ingredients.map((ing) => (
              <div key={ing.id} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Ingredient name"
                  value={ing.name}
                  onChange={(e) => handleIngredientChange(ing.id, 'name', e.target.value)}
                  className="flex-1 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                <input
                  type="number"
                  step="any"
                  placeholder="Qty"
                  value={ing.amount}
                  onChange={(e) => handleIngredientChange(ing.id, 'amount', Number(e.target.value))}
                  className="w-16 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Unit"
                  value={ing.unit}
                  onChange={(e) => handleIngredientChange(ing.id, 'unit', e.target.value)}
                  className="w-16 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                <select
                  value={ing.category}
                  onChange={(e) => handleIngredientChange(ing.id, 'category', e.target.value)}
                  className="rounded-lg border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => handleRemoveIngredient(ing.id)}
                  className="text-red-400 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-culinary-500 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-culinary-400 transition-colors"
            >
              Save Recipe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};