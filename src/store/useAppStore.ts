import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Recipe, WeeklyPlan } from '../types';

interface AppState {
  // Theme
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Custom Recipes Local CRUD
  customRecipes: Recipe[];
  addCustomRecipe: (recipe: Recipe) => void;
  updateCustomRecipe: (id: string, updatedFields: Partial<Recipe>) => void;
  deleteCustomRecipe: (id: string) => void;

  // Saved Bookmarks
  savedRecipeIds: string[];
  toggleSaveRecipe: (id: string) => void;

  // Weekly Meal Planner
  weeklyPlan: WeeklyPlan;
  setMealPlanSlot: (day: keyof WeeklyPlan, mealType: 'breakfast' | 'lunch' | 'dinner', recipe?: Recipe) => void;
  clearWeeklyPlan: () => void;

  // Shopping List Checklist State
  checkedShoppingItems: Record<string, boolean>;
  toggleShoppingItem: (id: string) => void;
  clearCheckedShoppingItems: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Theme
      darkMode: false,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

      // Custom Recipes Local CRUD
      customRecipes: [],
      addCustomRecipe: (newRecipe) =>
        set((state) => ({
          customRecipes: [newRecipe, ...state.customRecipes],
        })),
      updateCustomRecipe: (id, updatedFields) =>
        set((state) => ({
          customRecipes: state.customRecipes.map((r) =>
            r.id === id ? { ...r, ...updatedFields } : r
          ),
        })),
      deleteCustomRecipe: (id) =>
        set((state) => ({
          customRecipes: state.customRecipes.filter((r) => r.id !== id),
          savedRecipeIds: state.savedRecipeIds.filter((savedId) => savedId !== id),
        })),

      // Saved Bookmarks
      savedRecipeIds: [],
      toggleSaveRecipe: (id) =>
        set((state) => ({
          savedRecipeIds: state.savedRecipeIds.includes(id)
            ? state.savedRecipeIds.filter((rId) => rId !== id)
            : [...state.savedRecipeIds, id],
        })),

      // Weekly Meal Planner
      weeklyPlan: { mon: {}, tue: {}, wed: {}, thu: {}, fri: {}, sat: {}, sun: {} },
      setMealPlanSlot: (day, mealType, recipe) =>
        set((state) => ({
          weeklyPlan: {
            ...state.weeklyPlan,
            [day]: {
              ...state.weeklyPlan[day],
              [mealType]: recipe,
            },
          },
        })),
      clearWeeklyPlan: () =>
        set({
          weeklyPlan: { mon: {}, tue: {}, wed: {}, thu: {}, fri: {}, sat: {}, sun: {} },
        }),

      // Shopping List Checklist
      checkedShoppingItems: {},
      toggleShoppingItem: (id) =>
        set((state) => ({
          checkedShoppingItems: {
            ...state.checkedShoppingItems,
            [id]: !state.checkedShoppingItems[id],
          },
        })),
      clearCheckedShoppingItems: () => set({ checkedShoppingItems: {} }),
    }),
    {
      name: 'dinerforged-v2-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);