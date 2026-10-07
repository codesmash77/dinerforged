import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Recipe, WeeklyPlan, Technique, Utensil } from '../types';

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

  // Custom Techniques Local CRUD
  customTechniques: Technique[];
  addCustomTechnique: (technique: Technique) => void;
  updateCustomTechnique: (id: string, updatedFields: Partial<Technique>) => void;
  deleteCustomTechnique: (id: string) => void;

  // Custom Utensils Local CRUD
  customUtensils: Utensil[];
  addCustomUtensil: (utensil: Utensil) => void;
  updateCustomUtensil: (id: string, updatedFields: Partial<Utensil>) => void;
  deleteCustomUtensil: (id: string) => void;
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

      // Custom Techniques Local CRUD
      customTechniques: [],
      addCustomTechnique: (newTechnique) =>
        set((state) => ({
          customTechniques: [newTechnique, ...state.customTechniques],
        })),
      updateCustomTechnique: (id, updatedFields) =>
        set((state) => ({
          customTechniques: state.customTechniques.map((t) =>
            t.id === id ? { ...t, ...updatedFields } : t
          ),
        })),
      deleteCustomTechnique: (id) =>
        set((state) => ({
          customTechniques: state.customTechniques.filter((t) => t.id !== id),
        })),

      // Custom Utensils Local CRUD
      customUtensils: [],
      addCustomUtensil: (newUtensil) =>
        set((state) => ({
          customUtensils: [newUtensil, ...state.customUtensils],
        })),
      updateCustomUtensil: (id, updatedFields) =>
        set((state) => ({
          customUtensils: state.customUtensils.map((u) =>
            u.id === id ? { ...u, ...updatedFields } : u
          ),
        })),
      deleteCustomUtensil: (id) =>
        set((state) => ({
          customUtensils: state.customUtensils.filter((u) => u.id !== id),
        })),
    }),
    {
      name: 'dinerforged-v2-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);