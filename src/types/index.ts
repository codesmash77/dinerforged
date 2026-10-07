export type IngredientCategory = 
  | 'Produce'| 'Meat & Poultry'| 'Meat'| 'Seafood'| 'Dairy & Eggs'| 'Dairy'|
  'Pantry & Oils'| 'Pantry'| 'Oil & Fat'| 'Spices & Seasonings'| 'Spices'|
  'Baking'| 'Grains & Pasta'| 'Canned & Jarred'| 'Frozen'| 'Beverages'|
  'Condiments & Sauces'| 'Leavening'| 'Other'

export type MeasurementUnit = 
  | 'g' | 'kg' | 'oz' | 'lb' 
  | 'ml' | 'l' | 'tsp' | 'tbsp' | 'cup' | 'fl oz' | 'pt' | 'qt' | 'gal'| 'pcs'
  | 'pinch' | 'dash' | 'clove' | 'slice' | 'piece' | 'can' | 'package' | 'unit';

export type ScalingType = 'linear' | 'sublinear_spices' | 'sublinear_leavening' | 'fixed_binders';

export interface Ingredient {
  id: string;
  name: string;
  amount: number | ''; // Allow empty string for clean backspacing
  unit: MeasurementUnit;
  category: IngredientCategory;
  scalingType?: ScalingType;
  flavorVector?: number[]; 
}

export interface InstructionStep {
  id: string;
  stepNumber: number;
  text: string;
}

export interface Recipe {
  id: string;
  title: string;
  cuisine: string;
  originStory: string;
  culturalContext: string;
  funFact: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  baseServings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: Ingredient[];
  instructions: InstructionStep[];
  tags: string[];
  imageUrl?: string;
  heatConductivityRating?: 'low' | 'medium' | 'high';
  isCustom?: boolean; // For local CRUD tracking
}

export interface Technique {
  id: string;
  title: string;
  category: string;
  scienceExplanation: string;
  commonMistakes: string[];
  proTips: string[];
}

export interface Utensil {
  id: string;
  name: string;
  category: 'Cookware' | 'Knives' | 'Prep Tools' | 'Baking' | 'Specialty';
  careInstructions: string;
  materialInfo: string;
  thermalRetention: 'High' | 'Medium' | 'Low';
  proTips: string[];
}

export interface MealPlanDay {
  breakfast?: Recipe;
  lunch?: Recipe;
  dinner?: Recipe;
}

export type WeeklyPlan = Record<'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun', MealPlanDay>;

export interface SubstituteRecommendation {
  original: string;
  substitute: string;
  ratio: string;
  similarityScore: number;
  reasoning: string;
}