import { Recipe, IngredientCategory } from '../types';

export interface AggregatedShoppingItem {
  name: string;
  amount: number;
  unit: string;
  category: IngredientCategory | string;
}

export function aggregateRecipeIngredients(recipes: Recipe[]): Record<string, AggregatedShoppingItem[]> {
  const map: Record<string, AggregatedShoppingItem> = {};

  // Safeguard against non-array or null input
  if (!Array.isArray(recipes)) {
    recipes = [];
  }

  recipes.forEach((recipe) => {
    // Safeguard if recipe or recipe.ingredients is missing
    if (!recipe || !Array.isArray(recipe.ingredients)) return;

    recipe.ingredients.forEach((ing) => {
      if (!ing || !ing.name) return;

      const name = ing.name.toLowerCase().trim();
      const unit = (ing.unit || 'unit').toLowerCase().trim();
      const key = `${name}_${unit}`;
      
      const numericAmount = typeof ing.amount === 'number' ? ing.amount : parseFloat(ing.amount as string) || 0;

      if (map[key]) {
        map[key].amount += numericAmount;
      } else {
        map[key] = {
          name: ing.name,
          amount: numericAmount,
          unit: ing.unit || 'unit',
          category: ing.category || 'Other',
        };
      }
    });
  });

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