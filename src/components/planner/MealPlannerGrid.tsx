import React, { useState } from 'react';

export interface MealSlot {
  id: string;
  day: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  recipeTitle?: string;
}

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MEAL_TYPES: ('Breakfast' | 'Lunch' | 'Dinner' | 'Snack')[] = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

export const MealPlannerGrid: React.FC = () => {
  const [planner, setPlanner] = useState<MealSlot[]>([]);
  const [activeSlot, setActiveSlot] = useState<{ day: string; type: string } | null>(null);

  const handleAddMeal = (day: string, mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack') => {
    const mealName = prompt(`Enter ${mealType} for ${day}:`);
    if (!mealName) return;

    setPlanner((prev) => [
      ...prev.filter((slot) => !(slot.day === day && slot.mealType === mealType)),
      { id: `${day}-${mealType}`, day, mealType, recipeTitle: mealName },
    ]);
  };

  const handleRemoveMeal = (day: string, mealType: string) => {
    setPlanner((prev) => prev.filter((slot) => !(slot.day === day && slot.mealType === mealType)));
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Weekly Meal Planner</h2>
      
      {/* Scrollable Container for Touch Screens */}
      <div className="flex overflow-x-auto snap-x snap-mandatory space-x-4 pb-4 touch-pan-x scrollbar-thin">
        {DAYS_OF_WEEK.map((day) => (
          <div
            key={day}
            className="flex-shrink-0 w-64 bg-gray-50 rounded-lg border border-gray-200 p-3 snap-center shadow-sm"
          >
            <div className="font-semibold text-gray-700 border-b border-gray-200 pb-2 mb-3 text-center">
              {day}
            </div>

            <div className="space-y-3">
              {MEAL_TYPES.map((type) => {
                const assigned = planner.find((s) => s.day === day && s.mealType === type);

                return (
                  <div key={type} className="flex flex-col space-y-1">
                    <span className="text-xs uppercase tracking-wide text-gray-400 font-medium">
                      {type}
                    </span>
                    {assigned ? (
                      <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg p-3 min-h-[44px]">
                        <span className="text-sm font-medium truncate">{assigned.recipeTitle}</span>
                        <button
                          onClick={() => handleRemoveMeal(day, type)}
                          className="ml-2 text-xs text-red-500 hover:text-red-700 p-2 min-w-[36px] min-h-[36px] flex items-center justify-center font-bold"
                          aria-label={`Remove ${type} on ${day}`}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddMeal(day, type)}
                        className="w-full border-2 border-dashed border-gray-300 hover:border-emerald-500 text-gray-500 hover:text-emerald-600 rounded-lg min-h-[44px] flex items-center justify-center text-sm font-medium transition-colors touch-manipulation"
                      >
                        + Add {type}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};