import { Technique } from '../types';

export const techniques: Technique[] = [
  {
    id: 'tech-emulsification',
    title: 'Emulsification Science',
    category: 'Sauces & Chemistry',
    scienceExplanation: 'Forces two immiscible liquids (like oil and water) to combine by introducing an amphiphilic emulsifier (like lecithin in egg yolks) that binds to both water and fat molecules simultaneously.',
    commonMistakes: [
      'Adding oil too quickly before establishing a base emulsion.',
      'Exposing egg-based emulsions to temperatures above 65°C (149°F), causing proteins to curdle.'
    ],
    proTips: [
      'If your mayonnaise or hollandaise breaks, whisk 1 tsp of warm water with a fresh egg yolk and slowly drizzle the broken sauce into it to restore emulsification.'
    ]
  },
  {
    id: 'tech-maillard-reaction',
    title: 'The Maillard Reaction & Searing',
    category: 'Heat Application',
    scienceExplanation: 'A chemical reaction between amino acids and reducing sugars above 140°C (285°F) that creates hundreds of new flavor compounds responsible for savory complexity.',
    commonMistakes: [
      'Attempting to sear wet meat (water evaporation absorbs thermal energy, causing the meat to steam rather than sear).',
      'Crowding the pan, which drops pan temperature rapidly.'
    ],
    proTips: [
      'Pat protein surfaces completely dry with paper towels and lightly salt 45 minutes ahead to dry-brine before searing.'
    ]
  },
  {
    id: 'tech-deglazing',
    title: 'Pan Deglazing & Fond Extraction',
    category: 'Sauce Building',
    scienceExplanation: 'Dissolves the caramelized brown protein bits (fond) stuck to the pan using an acidic or flavorful liquid (wine, stock, vinegar), incorporating rich Maillard compounds into pan sauces.',
    commonMistakes: [
      'Allowing fond to turn black before deglazing (burnt fond creates astringent, bitter flavors).'
    ],
    proTips: [
      'Scrape the bottom of the pan with a wooden spoon immediately after adding cold liquid to release caramelized proteins smoothly.'
    ]
  }
];