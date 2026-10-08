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

  // Track deleted pre-populated or custom recipe IDs
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
    (set, get) => ({
      darkMode: false,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

      customRecipes: [],
      addCustomRecipe: (newRecipe) =>
        set((state) => ({
          customRecipes: [
            { ...newRecipe, id: newRecipe.id || `custom-${Date.now()}` },
            ...state.customRecipes.filter((r) => r.id !== newRecipe.id),
          ],
          deletedRecipeIds: state.deletedRecipeIds.filter((id) => id !== newRecipe.id),
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
          deletedRecipeIds: [...new Set([...state.deletedRecipeIds, id])],
          savedRecipeIds: state.savedRecipeIds.filter((savedId) => savedId !== id),
        })),

      deletedRecipeIds: [],

      savedRecipeIds: [],
      toggleSaveRecipe: (id) =>
        set((state) => ({
          savedRecipeIds: state.savedRecipeIds.includes(id)
            ? state.savedRecipeIds.filter((rId) => rId !== id)
            : [...state.savedRecipeIds, id],
        })),

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

      checkedShoppingItems: {},
      toggleShoppingItem: (id) =>
        set((state) => ({
          checkedShoppingItems: {
            ...state.checkedShoppingItems,
            [id]: !state.checkedShoppingItems[id],
          },
        })),
      clearCheckedShoppingItems: () => set({ checkedShoppingItems: {} }),

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

      purgeAndResetStorage: () => {
        set({
          customRecipes: [],
          deletedRecipeIds: [],
        });
        localStorage.removeItem('dinerforged-v2-storage');
        window.location.reload();
      },
    }),
    {
      name: 'dinerforged-v2-storage',
      storage: createJSONStorage(() => localStorage),
      version: 3, // bumped to 3 to force clean state
      migrate: (persistedState: any, version) => {
        if (version < 3) {
          if (persistedState && persistedState.customRecipes) {
            persistedState.customRecipes = persistedState.customRecipes.filter(
              (r: any) => r && typeof r === 'object' && r.id && r.title && Array.isArray(r.ingredients)
            );
          }
          if (!persistedState.deletedRecipeIds) {
            persistedState.deletedRecipeIds = [];
          }
        }
        return persistedState as AppState;
      },
    }
  )
);
