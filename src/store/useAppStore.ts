import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Recipe, WeeklyPlan, Technique, Utensil } from '../types';

interface AppState {
  darkMode: boolean;
  toggleDarkMode: () => void;

  customRecipes: Recipe[];
  addCustomRecipe: (recipe: Recipe) => void;
  updateCustomRecipe: (id: string, updatedFields: Partial<Recipe>) => void;
  deleteCustomRecipe: (id: string) => void;

  deletedRecipeIds: string[];

  savedRecipeIds: string[];
  toggleSaveRecipe: (id: string) => void;

  weeklyPlan: WeeklyPlan;
  setMealPlanSlot: (day: keyof WeeklyPlan, mealType: 'breakfast' | 'lunch' | 'dinner', recipe?: Recipe) => void;
  clearWeeklyPlan: () => void;

  checkedShoppingItems: Record<string, boolean>;
  toggleShoppingItem: (id: string) => void;
  clearCheckedShoppingItems: () => void;

  customTechniques: Technique[];
  addCustomTechnique: (technique: Technique) => void;
  updateCustomTechnique: (id: string, updatedFields: Partial<Technique>) => void;
  deleteCustomTechnique: (id: string) => void;

  customUtensils: Utensil[];
  addCustomUtensil: (utensil: Utensil) => void;
  updateCustomUtensil: (id: string, updatedFields: Partial<Utensil>) => void;
  deleteCustomUtensil: (id: string) => void;

  purgeAndResetStorage: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      darkMode: false,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

      customRecipes: [],
      addCustomRecipe: (newRecipe) =>
        set((state) => {
          const existing = state.customRecipes || [];
          const filtered = existing.filter((r) => r.id !== newRecipe.id);
          return {
            customRecipes: [newRecipe, ...filtered],
            deletedRecipeIds: (state.deletedRecipeIds || []).filter((id) => id !== newRecipe.id),
          };
        }),

      updateCustomRecipe: (id, updatedFields) =>
        set((state) => ({
          customRecipes: (state.customRecipes || []).map((r) =>
            r.id === id ? { ...r, ...updatedFields } : r
          ),
        })),

      deleteCustomRecipe: (id) =>
        set((state) => ({
          customRecipes: (state.customRecipes || []).filter((r) => r.id !== id),
          deletedRecipeIds: [...new Set([...(state.deletedRecipeIds || []), id])],
        })),

      deletedRecipeIds: [],

      savedRecipeIds: [],
      toggleSaveRecipe: (id) =>
        set((state) => {
          const currentSaved = state.savedRecipeIds || [];
          const exists = currentSaved.includes(id);
          return {
            savedRecipeIds: exists
              ? currentSaved.filter((rId) => rId !== id)
              : [...currentSaved, id],
          };
        }),

      weeklyPlan: { mon: {}, tue: {}, wed: {}, thu: {}, fri: {}, sat: {}, sun: {} },
      setMealPlanSlot: (day, mealType, recipe) =>
        set((state) => ({
          weeklyPlan: {
            ...state.weeklyPlan,
            [day]: {
              ...(state.weeklyPlan?.[day] || {}),
              [mealType]: recipe,
            },
          },
        })),
      clearWeeklyPlan: () =>
        set({
          weeklyPlan: { mon: {}, tue: {}, wed: {}, thu: {}, fri: {}, sat: {}, sun: {} },
        }),

      checkedShoppingItems: {},
      toggleShoppingItem: (id) =>
        set((state) => ({
          checkedShoppingItems: {
            ...(state.checkedShoppingItems || {}),
            [id]: !state.checkedShoppingItems?.[id],
          },
        })),
      clearCheckedShoppingItems: () => set({ checkedShoppingItems: {} }),

      customTechniques: [],
      addCustomTechnique: (newTechnique) =>
        set((state) => ({
          customTechniques: [newTechnique, ...(state.customTechniques || [])],
        })),
      updateCustomTechnique: (id, updatedFields) =>
        set((state) => ({
          customTechniques: (state.customTechniques || []).map((t) =>
            t.id === id ? { ...t, ...updatedFields } : t
          ),
        })),
      deleteCustomTechnique: (id) =>
        set((state) => ({
          customTechniques: (state.customTechniques || []).filter((t) => t.id !== id),
        })),

      customUtensils: [],
      addCustomUtensil: (newUtensil) =>
        set((state) => ({
          customUtensils: [newUtensil, ...(state.customUtensils || [])],
        })),
      updateCustomUtensil: (id, updatedFields) =>
        set((state) => ({
          customUtensils: (state.customUtensils || []).map((u) =>
            u.id === id ? { ...u, ...updatedFields } : u
          ),
        })),
      deleteCustomUtensil: (id) =>
        set((state) => ({
          customUtensils: (state.customUtensils || []).filter((u) => u.id !== id),
        })),

      purgeAndResetStorage: () => {
        set({
          customRecipes: [],
          deletedRecipeIds: [],
        });
      },
    }),
    {
      name: 'dinerforged-v2-storage',
      storage: createJSONStorage(() => localStorage),
      version: 5, // Bumped to version 5 to force clean state preservation
      migrate: (persistedState: any, version) => {
        const existingBookmarks = persistedState?.savedRecipeIds || [];
        const existingCustomRecipes = persistedState?.customRecipes || [];
        const existingDeletedIds = persistedState?.deletedRecipeIds || [];

        return {
          ...(persistedState || {}),
          customRecipes: Array.isArray(existingCustomRecipes) ? existingCustomRecipes : [],
          savedRecipeIds: Array.isArray(existingBookmarks) ? existingBookmarks : [],
          deletedRecipeIds: Array.isArray(existingDeletedIds) ? existingDeletedIds : [],
        } as AppState;
      },
    }
  )
);
