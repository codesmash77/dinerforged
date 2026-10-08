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
        set((state) => ({
          customRecipes: [
            { ...newRecipe, id: newRecipe.id || `custom-${Date.now()}` },
            ...state.customRecipes.filter((r) => r.id !== newRecipe.id),
          ],
          deletedRecipeIds: (state.deletedRecipeIds || []).filter((id) => id !== newRecipe.id),
        })),

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
          // Keep savedRecipeIds intact unless explicitly unsaved by the user
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
        set((state) => ({
          customRecipes: [],
          deletedRecipeIds: [],
          // savedRecipeIds is strictly preserved here!
        }));
      },
    }),
    {
      name: 'dinerforged-v2-storage',
      storage: createJSONStorage(() => localStorage),
      version: 4, // bumped version
      migrate: (persistedState: any, version) => {
        // Safely extract and preserve savedRecipeIds across any version upgrade
        const existingBookmarks = persistedState?.savedRecipeIds || [];
        
        if (version < 4) {
          if (persistedState && persistedState.customRecipes) {
            persistedState.customRecipes = persistedState.customRecipes.filter(
              (r: any) => r && typeof r === 'object' && r.id && r.title && Array.isArray(r.ingredients)
            );
          }
        }

        return {
          ...(persistedState || {}),
          savedRecipeIds: existingBookmarks, // guaranteed preservation
          deletedRecipeIds: persistedState?.deletedRecipeIds || [],
        } as AppState;
      },
    }
  )
);
