import React, { useState } from 'react';
import { Plus, Trash2, Dices, Recycle, Calendar as CalendarIcon } from 'lucide-react';
import { WeeklyPlan, Recipe } from '../types';
import { useAppStore } from '../store/useAppStore';
import { calculateInventoryReuseIndex } from '../utils/planOptimizer';
import { RecipePickerModal } from '../components/planner/RecipePickerModal';
import { PantryRouletteModal } from '../components/planner/PantryRouletteModal';
import { FlavorAnalyticsWidget } from '../components/planner/FlavorAnalyticsWidget';

const DAYS: (keyof WeeklyPlan)[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const MEALS: ('breakfast' | 'lunch' | 'dinner')[] = ['breakfast', 'lunch', 'dinner'];

export const MealPlannerPage: React.FC = () => {
  const { weeklyPlan, setMealPlanSlot, clearWeeklyPlan } = useAppStore();

  const [activeSlot, setActiveSlot] = useState<{ day: keyof WeeklyPlan; meal: 'breakfast' | 'lunch' | 'dinner' } | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isRouletteOpen, setIsRouletteOpen] = useState(false);

  const optimization = calculateInventoryReuseIndex(weeklyPlan);

  const handleOpenPicker = (day: keyof WeeklyPlan, meal: 'breakfast' | 'lunch' | 'dinner') => {
    setActiveSlot({ day, meal });
    setIsPickerOpen(true);
  };

  const handleAssignRecipe = (recipe: Recipe) => {
    if (activeSlot) {
      setMealPlanSlot(activeSlot.day, activeSlot.meal, recipe);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">
            7-Day Meal Planner & Optimization
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Organize weekly meals and minimize food waste with our Inventory Reuse Index.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRouletteOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-culinary-500 dark:text-slate-950 dark:hover:bg-culinary-400 transition-colors"
          >
            <Dices className="h-4 w-4" /> Pantry Roulette
          </button>
          <button
            onClick={clearWeeklyPlan}
            className="flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
          >
            <Trash2 className="h-4 w-4 text-red-400" /> Clear Plan
          </button>
        </div>
      </div>

      {/* Analytics & Reuse Index Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 text-culinary-600 dark:text-culinary-400 mb-2">
            <Recycle className="h-5 w-5" />
            <h3 className="text-md font-bold text-slate-900 dark:text-white">Inventory Reuse Score</h3>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {optimization.reuseIndexScore}%
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {optimization.reusedIngredientsCount} overlapping ingredients reused across {optimization.totalRecipes} planned dishes.
          </p>
        </div>

        <div className="md:col-span-2">
          <FlavorAnalyticsWidget plan={weeklyPlan} />
        </div>
      </div>

      {/* 7-Day Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {DAYS.map((day) => (
          <div key={day} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-sm font-bold uppercase tracking-wider text-culinary-600 dark:text-culinary-400 border-b pb-2 mb-3 dark:border-slate-800">
              {day}
            </h3>

            <div className="space-y-3">
              {MEALS.map((meal) => {
                const assigned = weeklyPlan[day][meal];
                return (
                  <div key={meal} className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-800/80 dark:bg-slate-800/40">
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                      {meal}
                    </span>

                    {assigned ? (
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                          {assigned.title}
                        </span>
                        <button
                          onClick={() => setMealPlanSlot(day, meal, undefined)}
                          className="text-slate-400 hover:text-red-400 ml-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleOpenPicker(day, meal)}
                        className="mt-1 flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-slate-300 py-1.5 text-xs font-medium text-slate-500 hover:border-culinary-500 hover:text-culinary-600 dark:border-slate-700 dark:text-slate-400 transition-colors"
                      >
                        <Plus className="h-3 w-3" /> Add
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Picker Modal */}
      {activeSlot && (
        <RecipePickerModal
          isOpen={isPickerOpen}
          onClose={() => setIsPickerOpen(false)}
          onSelectRecipe={handleAssignRecipe}
          dayLabel={activeSlot.day}
          mealTypeLabel={activeSlot.meal}
        />
      )}

      {/* Pantry Roulette Modal */}
      <PantryRouletteModal
        isOpen={isRouletteOpen}
        onClose={() => setIsRouletteOpen(false)}
        onSelectRecipe={(r) => {
          setMealPlanSlot('mon', 'dinner', r);
        }}
      />
    </div>
  );
};