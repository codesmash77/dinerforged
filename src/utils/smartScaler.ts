import { Ingredient } from '../types';

export function smartScaleIngredients(
  ingredients: Ingredient[],
  baseServings: number,
  targetServings: number
): Ingredient[] {
  if (!baseServings || baseServings <= 0) return ingredients;

  const linearFactor = targetServings / baseServings;

  return ingredients.map((ing) => {
    const numericAmount = typeof ing.amount === 'number' ? ing.amount : parseFloat(ing.amount as string) || 0;
    const cat = ing.category?.toLowerCase() || '';
    const name = ing.name?.toLowerCase() || '';

    let scalingFactor = linearFactor;

    // Non-linear scaling for spices and leavening agents to prevent over-seasoning
    if (cat.includes('spice') || cat.includes('seasoning') || name.includes('salt') || name.includes('pepper')) {
      scalingFactor = Math.pow(linearFactor, 0.75);
    } else if (cat.includes('leavening') || name.includes('yeast') || name.includes('baking powder') || name.includes('baking soda')) {
      scalingFactor = Math.pow(linearFactor, 0.65);
    }

    const scaledAmount = Number((numericAmount * scalingFactor).toFixed(2));

    return {
      ...ing,
      amount: scaledAmount,
    };
  });
}