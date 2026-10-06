import { WeeklyPlan, Recipe } from '../types';

export interface PlanOptimizationMetrics {
  totalRecipes: number;
  uniqueIngredientsCount: number;
  reusedIngredientsCount: number;
  reuseIndexScore: number; // 0 to 100%
  topReusedIngredients: { name: string; count: number }[];
}

export function calculateInventoryReuseIndex(plan: WeeklyPlan): PlanOptimizationMetrics {
  const ingredientFrequency: Record<string, number> = {};
  let totalRecipes = 0;

  // Extract all recipes across 7 days
  Object.values(plan).forEach((day) => {
    ['breakfast', 'lunch', 'dinner'].forEach((mealType) => {
      const recipe = day[mealType as keyof typeof day] as Recipe | undefined;
      if (recipe) {
        totalRecipes++;
        recipe.ingredients.forEach((ing) => {
          const key = ing.name.toLowerCase().trim();
          ingredientFrequency[key] = (ingredientFrequency[key] || 0) + 1;
        });
      }
    });
  });

  const uniqueIngredients = Object.keys(ingredientFrequency);
  const totalUnique = uniqueIngredients.length;

  if (totalUnique === 0) {
    return {
      totalRecipes: 0,
      uniqueIngredientsCount: 0,
      reusedIngredientsCount: 0,
      reuseIndexScore: 0,
      topReusedIngredients: [],
    };
  }

  let reusedCount = 0;
  const reusedList: { name: string; count: number }[] = [];

  uniqueIngredients.forEach((name) => {
    const count = ingredientFrequency[name];
    if (count > 1) {
      reusedCount++;
      reusedList.push({ name, count });
    }
  });

  // Reuse Index formula: Ratio of reused ingredients weighted by meal count
  const reuseIndexScore = Math.min(100, Math.round((reusedCount / totalUnique) * 100 + (totalRecipes * 2)));

  return {
    totalRecipes,
    uniqueIngredientsCount: totalUnique,
    reusedIngredientsCount: reusedCount,
    reuseIndexScore,
    topReusedIngredients: reusedList.sort((a, b) => b.count - a.count).slice(0, 5),
  };
}