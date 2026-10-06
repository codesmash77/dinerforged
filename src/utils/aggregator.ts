import { Ingredient, WeeklyPlan, IngredientCategory } from '../types';

export interface AggregatedShoppingItem {
  id: string;
  name: string;
  totalAmount: number;
  unit: string;
  category: IngredientCategory;
  recipeSources: string[];
}

export function aggregateShoppingList(
  plan: WeeklyPlan,
  customRecipes: Ingredient[] = []
): Record<IngredientCategory, AggregatedShoppingItem[]> {
  const map: Record<string, AggregatedShoppingItem> = {};

  // Helper to accumulate ingredients
  const processIngredient = (ing: Ingredient, recipeTitle: string) => {
    const key = `${ing.name.toLowerCase().trim()}_${ing.unit.toLowerCase().trim()}`;

    if (!map[key]) {
      map[key] = {
        id: key,
        name: ing.name,
        totalAmount: ing.amount,
        unit: ing.unit,
        category: ing.category || 'Other',
        recipeSources: [recipeTitle],
      };
    } else {
      map[key].totalAmount = Math.round((map[key].totalAmount + ing.amount) * 100) / 100;
      if (!map[key].recipeSources.includes(recipeTitle)) {
        map[key].recipeSources.push(recipeTitle);
      }
    }
  };

  // Process all planned weekly meals
  Object.values(plan).forEach((day) => {
    ['breakfast', 'lunch', 'dinner'].forEach((mealType) => {
      const recipe = day[mealType as keyof typeof day];
      if (recipe) {
        recipe.ingredients.forEach((ing) => processIngredient(ing, recipe.title));
      }
    });
  });

  // Group by Category
  const grouped: Record<IngredientCategory, AggregatedShoppingItem[]> = {
    Produce: [],
    Pantry: [],
    Dairy: [],
    Meat: [],
    Seafood: [],
    Spices: [],
    Leavening: [],
    'Oil & Fat': [],
    Other: [],
  };

  Object.values(map).forEach((item) => {
    if (grouped[item.category]) {
      grouped[item.category].push(item);
    } else {
      grouped.Other.push(item);
    }
  });

  return grouped;
}