export interface NutritionInfo {
  calories: number;
  protein: number; // in grams
  carbs: number;   // in grams
  fat: number;     // in grams
}

// Reference values per 100g standard portion
const NUTRITION_DATABASE: Record<string, { cal: number; p: number; c: number; f: number }> = {
  // Proteins & Meats
  chicken: { cal: 165, p: 31, c: 0, f: 3.6 },
  beef: { cal: 250, p: 26, c: 0, f: 15 },
  pork: { cal: 242, p: 27, c: 0, f: 14 },
  fish: { cal: 206, p: 22, c: 0, f: 12 },
  salmon: { cal: 208, p: 20, c: 0, f: 13 },
  shrimp: { cal: 99, p: 24, c: 0.2, f: 0.3 },
  turkey: { cal: 189, p: 29, c: 0, f: 7 },
  bacon: { cal: 541, p: 37, c: 1.4, f: 42 },
  egg: { cal: 155, p: 13, c: 1.1, f: 11 },
  tofu: { cal: 76, p: 8, c: 1.9, f: 4.8 },

  // Grains, Carbs & Starches
  rice: { cal: 130, p: 2.7, c: 28, f: 0.3 },
  pasta: { cal: 131, p: 5, c: 25, f: 1.1 },
  noodle: { cal: 138, p: 4.5, c: 25, f: 2 },
  bread: { cal: 265, p: 9, c: 49, f: 3.2 },
  flour: { cal: 364, p: 10, c: 76, f: 1 },
  oat: { cal: 389, p: 17, c: 66, f: 7 },
  tortilla: { cal: 312, p: 8.5, c: 51, f: 7.8 },
  potato: { cal: 77, p: 2, c: 17, f: 0.1 },

  // Dairy & Fats
  cheese: { cal: 402, p: 25, c: 1.3, f: 33 },
  milk: { cal: 42, p: 3.4, c: 5, f: 1 },
  butter: { cal: 717, p: 0.9, c: 0.1, f: 81 },
  cream: { cal: 340, p: 2.1, c: 2.8, f: 36 },
  yogurt: { cal: 59, p: 10, c: 3.6, f: 0.4 },
  oil: { cal: 884, p: 0, c: 0, f: 100 },
  'olive oil': { cal: 884, p: 0, c: 0, f: 100 },
  ghee: { cal: 900, p: 0, c: 0, f: 100 },

  // Produce, Veggies & Fruits
  tomato: { cal: 18, p: 0.9, c: 3.9, f: 0.2 },
  onion: { cal: 40, p: 1.1, c: 9.3, f: 0.1 },
  garlic: { cal: 149, p: 6.4, c: 33, f: 0.5 },
  avocado: { cal: 160, p: 2, c: 8.5, f: 15 },
  spinach: { cal: 23, p: 2.9, c: 3.6, f: 0.4 },
  pepper: { cal: 31, p: 1, c: 6, f: 0.3 },
  mushroom: { cal: 22, p: 3.1, c: 3.3, f: 0.3 },
  carrot: { cal: 41, p: 0.9, c: 10, f: 0.2 },
  lemon: { cal: 29, p: 1.1, c: 9, f: 0.3 },
  lime: { cal: 30, p: 0.7, c: 11, f: 0.2 },
  apple: { cal: 52, p: 0.3, c: 14, f: 0.2 },
  banana: { cal: 89, p: 1.1, c: 23, f: 0.3 },

  // Legumes, Nuts & Sweeteners
  bean: { cal: 127, p: 9, c: 23, f: 0.5 },
  lentil: { cal: 116, p: 9, c: 20, f: 0.4 },
  sugar: { cal: 387, p: 0, c: 100, f: 0 },
  honey: { cal: 304, p: 0.3, c: 82, f: 0 },
  salt: { cal: 0, p: 0, c: 0, f: 0 },
};

export function estimateNutrition(ingredients: string[]): NutritionInfo {
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;

  if (!ingredients || ingredients.length === 0) {
    return { calories: 250, protein: 12, c: 30, fat: 8 } as any;
  }

  ingredients.forEach((item) => {
    const lower = item.toLowerCase();
    let matchedMacros = null;

    // Search database key match
    for (const [keyword, macros] of Object.entries(NUTRITION_DATABASE)) {
      if (lower.includes(keyword)) {
        matchedMacros = macros;
        break;
      }
    }

    // Determine scale multiplier based on unit descriptors
    let multiplier = 1.0;
    if (lower.includes('tbsp') || lower.includes('tsp') || lower.includes('pinch') || lower.includes('clove') || lower.includes('dash')) {
      multiplier = 0.25;
    } else if (lower.includes('cup') || lower.includes('can') || lower.includes('lb') || lower.includes('pound') || lower.includes('jar')) {
      multiplier = 2.0;
    } else if (lower.includes('kg') || lower.includes('large batch')) {
      multiplier = 4.0;
    }

    if (matchedMacros) {
      totalCalories += matchedMacros.cal * multiplier;
      totalProtein += matchedMacros.p * multiplier;
      totalCarbs += matchedMacros.c * multiplier;
      totalFat += matchedMacros.f * multiplier;
    } else {
      // Smart categorized fallback for unmatched strings
      if (lower.includes('sauce') || lower.includes('broth') || lower.includes('soup') || lower.includes('juice')) {
        totalCalories += 30 * multiplier;
        totalProtein += 1 * multiplier;
        totalCarbs += 5 * multiplier;
        totalFat += 0.5 * multiplier;
      } else if (lower.includes('oil') || lower.includes('fat') || lower.includes('butter') || lower.includes('lard')) {
        totalCalories += 130 * multiplier;
        totalFat += 14 * multiplier;
      } else {
        totalCalories += 75 * multiplier;
        totalProtein += 3 * multiplier;
        totalCarbs += 10 * multiplier;
        totalFat += 2 * multiplier;
      }
    }
  });

  return {
    calories: Math.max(50, Math.round(totalCalories)),
    protein: Math.max(1, Math.round(totalProtein)),
    carbs: Math.max(2, Math.round(totalCarbs)),
    fat: Math.max(1, Math.round(totalFat)),
  };
}
