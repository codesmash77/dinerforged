import { estimateNutrition, NutritionInfo } from './nutritionCalculator';
import { Recipe, Ingredient, InstructionStep, IngredientCategory, MeasurementUnit } from '../types';

export function normalizeMealDbRecipe(meal: any): Recipe {
  const rawIngredientStrings: string[] = [];
  const parsedIngredients: Ingredient[] = [];

  for (let i = 1; i <= 20; i++) {
    const ingredientName = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    
    if (ingredientName && ingredientName.trim() !== '') {
      const cleanName = ingredientName.trim();
      const cleanMeasure = measure && measure.trim() !== '' ? measure.trim() : '1 unit';
      
      rawIngredientStrings.push(`${cleanMeasure} ${cleanName}`);

      let amountNum = 1;
      let unitStr: MeasurementUnit = 'unit';
      
      const lowerMeasure = cleanMeasure.toLowerCase();
      const numMatch = cleanMeasure.match(/^([\d./]+)/);
      if (numMatch) {
        try {
          const evalNum = eval(numMatch[1]);
          if (!isNaN(evalNum)) amountNum = evalNum;
        } catch {
          amountNum = 1;
        }
      }

      if (lowerMeasure.includes('g') && !lowerMeasure.includes('gal')) unitStr = 'g';
      else if (lowerMeasure.includes('kg')) unitStr = 'kg';
      else if (lowerMeasure.includes('oz')) unitStr = 'oz';
      else if (lowerMeasure.includes('lb')) unitStr = 'lb';
      else if (lowerMeasure.includes('ml')) unitStr = 'ml';
      else if (lowerMeasure.includes('l')) unitStr = 'l';
      else if (lowerMeasure.includes('tsp')) unitStr = 'tsp';
      else if (lowerMeasure.includes('tbsp')) unitStr = 'tbsp';
      else if (lowerMeasure.includes('cup')) unitStr = 'cup';
      else if (lowerMeasure.includes('can')) unitStr = 'can';
      else if (lowerMeasure.includes('clove')) unitStr = 'clove';
      else if (lowerMeasure.includes('slice')) unitStr = 'slice';

      parsedIngredients.push({
        id: `ing-${i}-${Date.now()}`,
        name: cleanName,
        amount: amountNum,
        unit: unitStr,
        category: 'Pantry & Oils' as IngredientCategory,
      });
    }
  }

  // Parse multi-line instructions safely into structured step objects
  const rawInstructions = meal.strInstructions || '';
  const instructionLines = rawInstructions
    .split(/\r?\n/)
    .map((line: string) => line.trim())
    .filter((line: string) => line.length > 0 && !line.toLowerCase().startsWith('step'));

  const finalLines = instructionLines.length > 0 ? instructionLines : [rawInstructions];
  
  const formattedInstructions: InstructionStep[] = finalLines.map((text: string, idx: number) => ({
    id: `step-${idx}-${Date.now()}`,
    stepNumber: idx + 1,
    text,
  }));

  const nutrition = estimateNutrition(rawIngredientStrings);

  return {
    id: `mealdb-${meal.idMeal}`,
    title: meal.strMeal || 'Untitled Global Recipe',
    cuisine: meal.strArea || 'International',
    originStory: `Imported from Global Culinary Repository (${meal.strArea || 'World'} cuisine).`,
    culturalContext: `Traditional ${meal.strCategory || 'dish'} recipe.`,
    funFact: 'Sourced via Dinerforged Global Explorer.',
    prepTimeMinutes: 20,
    cookTimeMinutes: 35,
    baseServings: 4,
    difficulty: 'Medium',
    ingredients: parsedIngredients,
    instructions: formattedInstructions,
    imageUrl: meal.strMealThumb || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80',
    tags: [meal.strCategory || 'Global', meal.strArea || 'World'],
    nutrition,
    isCustom: true,
  };
}
