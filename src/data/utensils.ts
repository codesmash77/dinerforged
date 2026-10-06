import { Utensil } from '../types';

export const utensils: Utensil[] = [
  {
    id: 'utensil-cast-iron-skillet',
    name: 'Pre-Seasoned Cast Iron Skillet',
    category: 'Cookware',
    materialInfo: 'High-density cast iron alloy offering high thermal mass and emissivity.',
    careInstructions: 'Wash with mild soap, dry immediately over medium heat on stove, and apply a thin layer of neutral oil.',
    thermalRetention: 'High',
    proTips: [
      'Preheat cast iron for at least 5 to 10 minutes prior to cooking to eliminate cold spots across the surface.'
    ]
  },
  {
    id: 'utensil-chefs-knife',
    name: '8-Inch Japanese Gyuto / Chef’s Knife',
    category: 'Knives',
    materialInfo: 'High-carbon VG-10 stainless steel hardened to 60+ HRC for edge retention.',
    careInstructions: 'Hand wash only, dry immediately, and hone regularly with a ceramic rod. Never clean in a dishwasher.',
    thermalRetention: 'Low',
    proTips: [
      'Pinch the blade at the bolster using your thumb and index finger rather than gripping only the wooden handle for superior control.'
    ]
  },
  {
    id: 'utensil-dutch-oven',
    name: 'Enameled Cast Iron Dutch Oven',
    category: 'Cookware',
    materialInfo: 'Heavy cast iron core coated in acid-resistant vitreous enamel.',
    careInstructions: 'Avoid metal utensils that could scratch enamel. Soak in baking soda and warm water for stubborn stains.',
    thermalRetention: 'High',
    proTips: [
      'Ideal for low-and-slow braising due to uniform heat distribution from all sides.'
    ]
  }
];