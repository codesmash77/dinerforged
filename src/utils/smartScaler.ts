import { Ingredient, ScalingType } from '../types';

/**
 * Infers ingredient scaling category based on name and category if unset
 */
function getScalingType(ingredient: Ingredient): ScalingType {
  if (ingredient.scalingType) return ingredient.scalingType;

  const lowerName = ingredient.name.toLowerCase();

  if (/salt|pepper|chili|cayenne|paprika|cumin|cinnamon|clove|garlic powder|oregano|thyme|masala|turmeric/.test(lowerName)) {
    return 'sublinear_spices';
  }
  if (/baking powder|baking soda|yeast|xanthan gum/.test(lowerName)) {
    return 'sublinear_leavening';
  }
  if (/oil for frying|butter for greasing|cooking spray/.test(lowerName)) {
    return 'fixed_binders';
  }

  return 'linear';
}

/**
 * Non-Linear Culinary Ratio Scaling Engine
 * Applies logarithmic power scaling to preserve flavor balance when yields change.
 */
export function smartScaleIngredients(
  ingredients: Ingredient[],
  baseServings: number,
  targetServings: number
): Ingredient[] {
  if (baseServings <= 0 || targetServings <= 0) return ingredients;

  const rawFactor = targetServings / baseServings;

  return ingredients.map((item) => {
    const scaleType = getScalingType(item);
    let effectiveFactor = rawFactor;

    switch (scaleType) {
      case 'sublinear_spices':
        // Sublinear power scaling (α = 0.75) to prevent spice/salt overload at large yields
        effectiveFactor = Math.pow(rawFactor, 0.75);
        break;

      case 'sublinear_leavening':
        // Decay power scaling (α = 0.65) for baking leaveners
        effectiveFactor = Math.pow(rawFactor, 0.65);
        break;

      case 'fixed_binders':
        // Minimal threshold growth for pan greasing and frying oils
        effectiveFactor = 1 + (rawFactor - 1) * 0.25;
        break;

      case 'linear':
      default:
        effectiveFactor = rawFactor;
        break;
    }

    const scaledAmount = Math.round(item.amount * effectiveFactor * 100) / 100;

    return {
      ...item,
      amount: scaledAmount,
      scalingType: scaleType,
    };
  });
}