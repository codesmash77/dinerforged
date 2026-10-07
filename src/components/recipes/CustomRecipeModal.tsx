import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, ArrowUp, ArrowDown, Image as ImageIcon, Upload } from 'lucide-react';
import { Recipe, Ingredient, InstructionStep, MeasurementUnit, IngredientCategory } from '../../types';
import { useAppStore } from '../../store/useAppStore';

interface CustomRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipeToEdit?: Recipe | null;
}

const MEASUREMENT_UNITS: MeasurementUnit[] = [
  'unit', 'g', 'kg', 'oz', 'lb', 'ml', 'l', 'tsp', 'tbsp', 'cup',
  'fl oz', 'pt', 'qt', 'gal', 'pinch', 'dash', 'clove', 'slice', 'piece', 'pcs', 'can', 'package'
];

const INGREDIENT_CATEGORIES: IngredientCategory[] = [
  'Produce', 'Meat & Poultry', 'Meat', 'Seafood', 'Dairy & Eggs', 'Dairy',
  'Pantry & Oils', 'Pantry', 'Oil & Fat', 'Spices & Seasonings', 'Spices',
  'Baking', 'Grains & Pasta', 'Canned & Jarred', 'Frozen', 'Beverages',
  'Condiments & Sauces', 'Leavening', 'Other'
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
  
  const [ingredients, setIngredients] = useState<(Ingredient & { amount: number | '' })[]>([]);
  const [instructions, setInstructions] = useState<{ id: string; text: string }[]>([]);
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    if (recipeToEdit) {
      setTitle(recipeToEdit.title || '');
      setCuisine(recipeToEdit.cuisine || '');
      setPrepTime(recipeToEdit.prepTimeMinutes || 15);
      setCookTime(recipeToEdit.cookTimeMinutes || 20);
      setBaseServings(recipeToEdit.baseServings || 4);
      setDifficulty(recipeToEdit.difficulty || 'Medium');
      
      setIngredients(
        (recipeToEdit.ingredients || []).map((ing, idx) => ({
          ...ing,
          id: ing.id || `${Date.now()}-${idx}`,
          amount: ing.amount ?? 1,
          unit: (ing.unit as MeasurementUnit) || 'unit',
          category: (ing.category as IngredientCategory) || 'Produce',
        }))
      );

      setInstructions(
        (recipeToEdit.instructions || []).map((step, idx) => ({
          id: `${Date.now()}-${idx}`,
          text: typeof step === 'string' ? step : (step as any).text || '',
        }))
      );

      setImageUrl(recipeToEdit.imageUrl || '');
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
    setIngredients([{ id: '1', name: '', amount: 1, unit: 'unit', category: 'Produce' }]);
    setInstructions([{ id: '1', text: '' }]);
    setImageUrl('');
  };

  if (!isOpen) return null;

  // --- Ingredient Handlers ---
  const handleAddIngredient = () => {
    setIngredients([
      ...ingredients,
      { id: Date.now().toString(), name: '', amount: '', unit: 'unit', category: 'Produce' },
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

  // --- Instruction Handlers ---
  const handleAddInstruction = () => {
    setInstructions([...instructions, { id: Date.now().toString(), text: '' }]);
  };

  const handleRemoveInstruction = (id: string) => {
    setInstructions(instructions.filter((step) => step.id !== id));
  };

  const handleInstructionChange = (id: string, text: string) => {
    setInstructions(instructions.map((step) => (step.id === id ? { ...step, text } : step)));
  };

  const handleMoveInstruction = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= instructions.length) return;
    const reordered = [...instructions];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(target, 0, moved);
    setInstructions(reordered);
  };

  // --- Image Handler ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        setImageUrl(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const formattedIngredients: Ingredient[] = ingredients
      .filter((i) => i.name.trim() !== '')
      .map((i) => ({
        ...i,
        amount: i.amount === '' ? 1 : Number(i.amount),
      }));

    const formattedInstructions: InstructionStep[] = instructions
      .filter((i) => i.text.trim() !== '')
      .map((i, idx) => ({
        id: i.id || `${Date.now()}-${idx}`,
        stepNumber: idx + 1,
        text: i.text,
      }));

    const recipeData: Recipe = {
      id: recipeToEdit ? recipeToEdit.id : `custom-${Date.now()}`,
      title,
      cuisine,
      originStory: recipeToEdit?.originStory || 'Custom home creation',
      culturalContext: recipeToEdit?.culturalContext || 'Personal recipe collection',
      funFact: recipeToEdit?.funFact || 'Handcrafted in local Dinerforged workspace',
      prepTimeMinutes: prepTime,
      cookTimeMinutes: cookTime,
      baseServings,
      difficulty,
      ingredients: formattedIngredients,
      instructions: formattedInstructions,
      imageUrl,
      tags: recipeToEdit?.tags || ['Custom', cuisine],
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
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 my-8">
        <div className="flex items-center justify-between border-b pb-4 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {recipeToEdit ? 'Edit Custom Recipe' : 'Create Custom Recipe'}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-6 max-h-[75vh] overflow-y-auto pr-2">
          
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

          {/* Times, Servings, Difficulty */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          {/* --- SECTION: IMAGE UPLOAD --- */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <ImageIcon className="h-4 w-4 text-culinary-500" /> Recipe Cover Image
            </label>
            <div className="flex items-center gap-4">
              {imageUrl ? (
                <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700">
                  <img src={imageUrl} alt="Recipe Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="absolute top-1 right-1 rounded-full bg-slate-950/70 p-1 text-red-400 hover:bg-red-600 hover:text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : null}
              <label className="flex-1 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-culinary-500 cursor-pointer p-4 transition-colors">
                <Upload className="h-5 w-5 text-slate-400 mb-1" />
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Click to upload recipe image</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* --- SECTION: INGREDIENTS CRUD --- */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">Ingredients</label>
              <button
                type="button"
                onClick={handleAddIngredient}
                className="flex items-center gap-1 text-xs font-medium text-culinary-600 hover:text-culinary-500 dark:text-culinary-400"
              >
                <Plus className="h-3.5 w-3.5" /> Add Ingredient
              </button>
            </div>
            <div className="space-y-2">
              {ingredients.map((ing) => (
                <div key={ing.id} className="grid grid-cols-12 gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Ingredient name"
                    value={ing.name}
                    onChange={(e) => handleIngredientChange(ing.id, 'name', e.target.value)}
                    className="col-span-4 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <input
                    type="number"
                    step="any"
                    placeholder="Qty"
                    value={ing.amount === '' ? '' : ing.amount}
                    onChange={(e) => {
                      const val = e.target.value;
                      handleIngredientChange(ing.id, 'amount', val === '' ? '' : parseFloat(val));
                    }}
                    className="col-span-2 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <select
                    value={ing.unit}
                    onChange={(e) => handleIngredientChange(ing.id, 'unit', e.target.value as MeasurementUnit)}
                    className="col-span-2 rounded-lg border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    {MEASUREMENT_UNITS.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                  <select
                    value={ing.category}
                    onChange={(e) => handleIngredientChange(ing.id, 'category', e.target.value as IngredientCategory)}
                    className="col-span-3 rounded-lg border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    {INGREDIENT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(ing.id)}
                    className="col-span-1 text-red-400 hover:text-red-600 flex justify-center"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* --- SECTION: INSTRUCTIONS CRUD --- */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">Preparation Instructions</label>
              <button
                type="button"
                onClick={handleAddInstruction}
                className="flex items-center gap-1 text-xs font-medium text-culinary-600 hover:text-culinary-500 dark:text-culinary-400"
              >
                <Plus className="h-3.5 w-3.5" /> Add Step
              </button>
            </div>
            <div className="space-y-2">
              {instructions.map((step, idx) => (
                <div key={step.id} className="flex items-start gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800 font-bold text-xs text-slate-700 dark:text-slate-300 mt-1">
                    {idx + 1}
                  </span>
                  <textarea
                    rows={2}
                    placeholder={`Step ${idx + 1} instructions...`}
                    value={step.text}
                    onChange={(e) => handleInstructionChange(step.id, e.target.value)}
                    className="flex-1 rounded-lg border border-slate-300 p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white resize-none"
                  />
                  <div className="flex flex-col gap-1 mt-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveInstruction(idx, 'up')}
                      className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === instructions.length - 1}
                      onClick={() => handleMoveInstruction(idx, 'down')}
                      className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveInstruction(step.id)}
                      className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Actions */}
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