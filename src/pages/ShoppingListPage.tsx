import React, { useState } from 'react';
import { ShoppingCart, CheckSquare, Square, Trash2, Printer, Copy, Check } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { aggregateRecipeIngredients } from '../utils/aggregator';

export const ShoppingListPage: React.FC = () => {
  const { weeklyPlan, checkedShoppingItems, toggleShoppingItem, clearCheckedShoppingItems } = useAppStore();
  const [copied, setCopied] = useState(false);

  // Flatten weekly plan recipes to aggregate ingredients
  const allWeeklyRecipes = Object.values(weeklyPlan || {}).filter(Boolean) as any[];
  const aggregatedByCategory = aggregateRecipeIngredients(allWeeklyRecipes);

  // Calculate totals
  let totalItemsCount = 0;
  let checkedCount = 0;

  Object.entries(aggregatedByCategory).forEach(([category, items]) => {
    items.forEach((item, idx) => {
      totalItemsCount++;
      const itemId = `${category}-${idx}-${item.name}`;
      if (checkedShoppingItems[itemId]) {
        checkedCount++;
      }
    });
  });

  const progressPercentage = totalItemsCount > 0 ? Math.round((checkedCount / totalItemsCount) * 100) : 0;

  const handleCopyTextList = () => {
    let text = '🛒 Dinerforged Shopping List\n\n';
    Object.entries(aggregatedByCategory).forEach(([category, items]) => {
      if (items.length > 0) {
        text += `--- ${category.toUpperCase()} ---\n`;
        items.forEach((item, idx) => {
          const itemId = `${category}-${idx}-${item.name}`;
          const isDone = checkedShoppingItems[itemId] ? '[x]' : '[ ]';
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
      {/* Printable Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 print:mb-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white print:text-black">
            Aggregated Shopping List
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 print:hidden">
            Normalized ingredient list auto-generated from your meal planner.
          </p>
        </div>

        <div className="flex items-center gap-3 print:hidden">
          <button
            onClick={handleCopyTextList}
            className="flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy List'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-culinary-500 dark:text-slate-950 dark:hover:bg-culinary-400 transition-colors"
          >
            <Printer className="h-4 w-4" /> Print List
          </button>

          {checkedCount > 0 && (
            <button
              onClick={clearCheckedShoppingItems}
              className="flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            >
              <Trash2 className="h-4 w-4 text-red-400" /> Reset Checkbox State
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar (Hidden during printing) */}
      {totalItemsCount > 0 && (
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 print:hidden">
          <div className="flex justify-between items-center text-sm font-bold text-slate-900 dark:text-white mb-2">
            <span>Checklist Progress</span>
            <span className="text-culinary-600 dark:text-culinary-400">
              {checkedCount} / {totalItemsCount} items ({progressPercentage}%)
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
        <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
          <ShoppingCart className="mx-auto h-12 w-12 text-slate-400 mb-3" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Your Shopping List is Empty</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Assign recipes to your Meal Planner to automatically generate your categorized grocery list.
          </p>
        </div>
      )}

      {/* Categorized Grocery List */}
      <div className="space-y-6">
        {Object.entries(aggregatedByCategory).map(([category, items]) => {
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
                {items.map((item, idx) => {
                  const itemId = `${category}-${idx}-${item.name}`;
                  const isChecked = !!checkedShoppingItems[itemId];

                  return (
                    <div
                      key={itemId}
                      onClick={() => toggleShoppingItem(itemId)}
                      className={`flex items-center justify-between py-3 cursor-pointer select-none transition-colors ${
                        isChecked ? 'opacity-50 line-through' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button className="text-culinary-500 print:hidden">
                          {isChecked ? <CheckSquare className="h-5 w-5" /> : <Square className="h-5 w-5 text-slate-400" />}
                        </button>
                        <div>
                          <span className="text-sm font-semibold text-slate-900 dark:text-white print:text-black">
                            {item.name}
                          </span>
                        </div>
                      </div>

                      <span className="text-sm font-bold text-culinary-600 dark:text-culinary-400 print:text-black">
                        {item.amount} {item.unit}
                      </span>
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