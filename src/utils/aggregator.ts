import { Recipe, IngredientCategory } from '../types';

export interface AggregatedShoppingItem {
  name: string;
  amount: number;
  unit: string;
  category: IngredientCategory | string;
}

export function aggregateRecipeIngredients(recipes: Recipe[]): Record<string, AggregatedShoppingItem[]> {
  const map: Record<string, AggregatedShoppingItem> = {};

  recipes.forEach((recipe) => {
    recipe.ingredients.forEach((ing) => {
      const key = `${ing.name.toLowerCase().trim()}_${ing.unit.toLowerCase().trim()}`;
      const numericAmount = typeof ing.amount === 'number' ? ing.amount : parseFloat(ing.amount as string) || 0;

      if (map[key]) {
        map[key].amount += numericAmount;
      } else {
        map[key] = {
          name: ing.name,
          amount: numericAmount,
          unit: ing.unit,
          category: ing.category || 'Other',
        };
      }
    });
  });

  // Initialize all standard and custom categories dynamically
  const categories: Record<string, AggregatedShoppingItem[]> = {
    'Produce': [],
    'Meat & Poultry': [],
    'Meat': [],
    'Seafood': [],
    'Dairy & Eggs': [],
    'Dairy': [],
    'Pantry & Oils': [],
    'Pantry': [],
    'Oil & Fat': [],
    'Spices & Seasonings': [],
    'Spices': [],
    'Baking': [],
    'Grains & Pasta': [],
    'Canned & Jarred': [],
    'Frozen': [],
    'Beverages': [],
    'Condiments & Sauces': [],
    'Leavening': [],
    'Other': [],
  };

  Object.values(map).forEach((item) => {
    const cat = item.category in categories ? item.category : 'Other';
    categories[cat].push(item);
  });

  return categories;
}