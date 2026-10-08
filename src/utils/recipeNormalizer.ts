import { estimateNutrition, NutritionInfo } from './nutritionCalculator';

export interface NormalizedRecipe {
  id: string;
  title: string;
  description: string;
  category: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: string[];
  instructions: string[];
  imageUrl: string;
  nutrition: NutritionInfo;
  isImported: true;
  createdAt: string;
}

export function normalizeMealDbRecipe(meal: any): NormalizedRecipe {
  // TheMealDB stores ingredients across 20 indexed properties
  const ingredients: string[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== '') {
      const cleanMeasure = measure && measure.trim() !== '' ? `${measure.trim()} ` : '';
      ingredients.push(`${cleanMeasure}${ingredient.trim()}`);
    }
  }

  // Parse multi-line instructions safely
  const rawInstructions = meal.strInstructions || '';
  const instructions = rawInstructions
    .split(/\r?\n/)
    .map((line: string) => line.trim())
    .filter((line: string) => line.length > 0 && !line.toLowerCase().startsWith('step'));

  const finalInstructions = instructions.length > 0 ? instructions : [rawInstructions];
  const nutrition = estimateNutrition(ingredients);

  return {
    id: `mealdb-${meal.idMeal}`,
    title: meal.strMeal || 'Untitled Global Recipe',
    description: `A delicious ${meal.strArea || 'world'} ${meal.strCategory || 'culinary'} dish fetched via Global Recipe Search.`,
    category: meal.strCategory || 'Main Course',
    prepTime: 20,
    cookTime: 35,
    servings: 4,
    difficulty: 'Medium',
    ingredients,
    instructions: finalInstructions,
    imageUrl: meal.strMealThumb || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80',
    nutrition,
    isImported: true,
    createdAt: new Date().toISOString(),
  };
}
