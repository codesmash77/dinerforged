import React, { useState, useEffect } from 'react';
import { ShoppingCart, CheckSquare, Square, Trash2, Printer, Copy, Check, Plus } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { aggregateRecipeIngredients } from '../utils/aggregator';
import { Recipe } from '../types';

interface CustomShoppingItem {
  id: string;
  name: string;
  category: string;
  amount: string;
  unit: string;
}

export const ShoppingListPage: React.FC = () => {
  const { weeklyPlan, checkedShoppingItems, toggleShoppingItem, clearCheckedShoppingItems } = useAppStore();
  const [copied, setCopied] = useState(false);

  // Ad-hoc manual items state
  const [customItems, setCustomItems] = useState<CustomShoppingItem[]>(() => {
    try {
      const saved = localStorage.getItem('dinerforged_custom_shopping');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Pantry & Household');
  const [newItemAmount, setNewItemAmount] = useState('1');
  const [newItemUnit, setNewItemUnit] = useState('item');

  useEffect(() => {
    try {
      localStorage.setItem('dinerforged_custom_shopping', JSON.stringify(customItems));
    } catch (e) {
      console.error('Failed to save custom shopping items:', e);
    }
  }, [customItems]);

  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: CustomShoppingItem = {
      id: `custom-${Date.now()}`,
      name: newItemName.trim(),
      category: newItemCategory.trim() || 'Pantry & Household',
      amount: newItemAmount.trim() || '1',
      unit: newItemUnit.trim() || '',
    };

    setCustomItems([newItem, ...customItems]);
    setNewItemName('');
  };

  const handleRemoveCustomItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCustomItems(customItems.filter((item) => item.id !== id));
  };

  // Safely extract all recipes assigned across the weekly plan
  const allWeeklyRecipes: Recipe[] = [];
  if (weeklyPlan) {
    Object.values(weeklyPlan).forEach((dayMeals) => {
      if (dayMeals) {
        if (dayMeals.breakfast) allWeeklyRecipes.push(dayMeals.breakfast);
        if (dayMeals.lunch) allWeeklyRecipes.push(dayMeals.lunch);
        if (dayMeals.dinner) allWeeklyRecipes.push(dayMeals.dinner);
      }
    });
  }

  const aggregatedByCategory = aggregateRecipeIngredients(allWeeklyRecipes);

  // Merge custom items into categorized list with strict string typing for amount
  const combinedCategories: Record<string, Array<{ name: string; amount: string; unit: string; id: string }>> = {};

  // First, populate from meal planner (mapping amount number/string to string)
  Object.entries(aggregatedByCategory).forEach(([cat, items]) => {
    combinedCategories[cat] = items.map((item, idx) => ({
      name: item.name,
      amount: String(item.amount ?? '1'),
      unit: item.unit ?? '',
      id: `planner-${cat}-${idx}-${item.name}`,
    }));
  });

  // Next, merge custom items
  customItems.forEach((item) => {
    const cat = item.category;
    if (!combinedCategories[cat]) {
      combinedCategories[cat] = [];
    }
    combinedCategories[cat].push({
      name: item.name,
      amount: item.amount,
      unit: item.unit,
      id: item.id,
    });
  });

  // Calculate totals and progress
  let totalItemsCount = 0;
  let checkedCount = 0;

  Object.values(combinedCategories).forEach((items) => {
    items.forEach((item) => {
      totalItemsCount++;
      if (checkedShoppingItems[item.id]) {
        checkedCount++;
      }
    });
  });

  const progressPercentage = totalItemsCount > 0 ? Math.round((checkedCount / totalItemsCount) * 100) : 0;

  const handleCopyTextList = () => {
    let text = '🛒 Dinerforged Shopping List\n\n';
    Object.entries(combinedCategories).forEach(([category, items]) => {
      if (items.length > 0) {
        text += `--- ${category.toUpperCase()} ---\n`;
        items.forEach((item) => {
          const isDone = checkedShoppingItems[item.id] ? '[x]' : '[ ]';
          text += `${isDone} ${item.name}: ${item.amount} ${item.unit}\n`;
        });
        text += '\n';
      }
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 pb-24 print:p-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 print:mb-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white print:text-black">
            Smart Grocery List
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 print:hidden">
            Create standalone shopping lists or auto-generate them from your meal planner.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 print:hidden">
          {totalItemsCount > 0 && (
            <>
              <button
                onClick={handleCopyTextList}
                className="flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                <span>{copied ? 'Copied' : 'Copy List'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-culinary-500 dark:text-slate-950 dark:hover:bg-culinary-400 transition-colors"
              >
                <Printer className="h-4 w-4" /> Print List
              </button>
            </>
          )}

          {checkedCount > 0 && (
            <button
              onClick={clearCheckedShoppingItems}
              className="flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            >
              <Trash2 className="h-4 w-4 text-red-400" /> Reset Checks
            </button>
          )}
        </div>
      </div>

      {/* Quick-Add Ad-Hoc Item Form */}
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 print:hidden">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Add Shopping Item</h3>
        <form onSubmit={handleAddCustomItem} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Item name (e.g., Milk, Eggs, Coffee)..."
            className="sm:col-span-5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-culinary-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          />
          <input
            type="text"
            value={newItemCategory}
            onChange={(e) => setNewItemCategory(e.target.value)}
            placeholder="Category (e.g., Dairy)"
            className="sm:col-span-3 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-culinary-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          />
          <input
            type="text"
            value={newItemAmount}
            onChange={(e) => setNewItemAmount(e.target.value)}
            placeholder="Qty"
            className="sm:col-span-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-culinary-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          />
          <button
            type="submit"
            className="sm:col-span-2 flex items-center justify-center gap-1.5 rounded-xl bg-culinary-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-culinary-400 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" /> Add Item
          </button>
        </form>
      </div>

      {/* Progress Bar */}
      {totalItemsCount > 0 && (
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 print:hidden">
          <div className="flex justify-between items-center text-sm font-bold text-slate-900 dark:text-white mb-2">
            <span>Checklist Progress</span>
            <span className="text-culinary-600 dark:text-culinary-400">
              {checkedCount} / {totalItemsCount} items ({percentageString(checkedCount, totalItemsCount)}%)
            </span>
          </div>
          <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-culinary-500 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Empty State */}
      {totalItemsCount === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800 my-6">
          <ShoppingCart className="mx-auto h-12 w-12 text-slate-400 mb-3" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Your Shopping List is Empty</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Use the form above to add custom items, or assign recipes to your Meal Planner.
          </p>
        </div>
      )}

      {/* Categorized List */}
      <div className="space-y-6">
        {Object.entries(combinedCategories).map(([category, items]) => {
          if (!items || items.length === 0) return null;

          return (
            <div
              key={category}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 print:shadow-none print:border-b print:rounded-none"
            >
              <h3 className="text-md font-bold uppercase tracking-wider text-culinary-600 dark:text-culinary-400 mb-4 print:text-black">
                {category} ({items.length})
              </h3>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {items.map((item) => {
                  const isChecked = !!checkedShoppingItems[item.id];
                  const isCustom = item.id.startsWith('custom-');

                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleShoppingItem(item.id)}
                      className={`flex items-center justify-between py-3 cursor-pointer select-none transition-colors group ${
                        isChecked ? 'opacity-50 line-through' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button className="text-culinary-500 print:hidden">
                          {isChecked ? <CheckSquare className="h-5 w-5" /> : <Square className="h-5 w-5 text-slate-400" />}
                        </button>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white print:text-black">
                          {item.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-culinary-600 dark:text-culinary-400 print:text-black">
                          {item.amount} {item.unit}
                        </span>

                        {isCustom && (
                          <button
                            onClick={(e) => handleRemoveCustomItem(item.id.replace('custom-', ''), e)}
                            title="Delete custom item"
                            className="text-slate-400 hover:text-red-400 transition-colors print:hidden p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

function percentageString(checked: number, total: number) {
  return total > 0 ? Math.round((checked / total) * 100) : 0;
}
