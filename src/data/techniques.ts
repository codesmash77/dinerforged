import { Technique } from '../types';

export const techniques: Technique[] = [
  {
    id: 'tech-1',
    title: 'Emulsification Science',
    category: 'Sauces & Chemistry',
    description: 'Combining two immiscible liquids (like oil and water/vinegar) by dispersing one within the other using an emulsifier like lecithin or egg yolk.',
    scienceExplanation: 'Emulsifiers act as a molecular bridge. Their hydrophilic heads dissolve in water, while their lipophilic tails bind with oil droplets, preventing them from coalescing and separating.',
    scienceNote: 'Mustard or egg yolk contains phospholipids.',
    pitfalls: ['Adding oil too quickly breaks the emulsion', 'Excessive heat can curdle egg-based emulsions'],
    steps: [
      'Whisk your base liquid and emulsifier vigorously in a bowl.',
      'Drizzle neutral oil drop by drop while maintaining constant motion.',
      'Once an emulsion forms into a thick sauce, stream remaining oil slowly.'
    ],
    isCustom: false,
  },
  {
    id: 'tech-2',
    title: 'The Maillard Reaction & Searing',
    category: 'Heat Application',
    description: 'A chemical reaction between amino acids and reducing sugars that gives browned food its distinctive complex flavor.',
    scienceExplanation: 'Occurs when heat breaks down protein building blocks and sugars, triggering hundreds of distinct flavor compounds and melanoidin pigments.',
    scienceNote: 'Requires dry surface heat exceeding 140°C (284°F).',
    pitfalls: ['Overcrowding the pan lowers temperature and traps moisture', 'Using wet meat surface'],
    steps: [
      'Pat meat completely dry using paper towels before seasoning.',
      'Heat a heavy-duty pan with high-smoke-point oil until shimmering.',
      'Lay meat down away from you and leave undisturbed to develop crust.'
    ],
    isCustom: false,
  },
  {
    id: 'tech-3',
    title: 'Pan Deglazing & Fond Extraction',
    category: 'Sauce Building',
    description: 'Dissolving caramelized food residue (fond) stuck to the bottom of a pan to create a flavorful base for pan sauces.',
    scienceExplanation: 'Thermal shock and solvent action of liquid break the ionic bonds holding caramelized sugars to the metal surface.',
    scienceNote: 'Water molecules in wine or stock break ionic bonds.',
    pitfalls: ['Adding cold liquid to extremely warped hot pans', 'Burning the fond before deglazing'],
    steps: [
      'Remove cooked protein from the pan and pour off excess rendered fat.',
      'Place pan over medium-high heat and pour in wine, stock, or verjus.',
      'Scrape the bottom vigorously with a wooden spatula.'
    ],
    isCustom: false,
  },
  {
    id: 'tech-4',
    title: 'Sous-Vide Precision Cooking',
    category: 'Heat Application',
    description: 'Cooking food vacuum-sealed in a water bath at precisely controlled temperatures to achieve exact doneness edge-to-edge.',
    scienceExplanation: 'Heat is transferred via conduction through circulating water, allowing precise control over protein denaturation without overheating outer layers.',
    scienceNote: 'Water transfers heat 20 times more efficiently than air.',
    pitfalls: ['Failing to seal bags completely causing air pockets', 'Leaving certain fish too long leading to mushy textures'],
    steps: [
      'Season protein and vacuum seal in food-grade pouches.',
      'Set immersion circulator to target internal temperature and submerge pouch.',
      'Finish with a quick sear over high heat for color and texture.'
    ],
    isCustom: false,
  },
  {
    id: 'tech-5',
    title: 'Acid Maceration & Curing',
    category: 'Sauces & Chemistry',
    description: 'Soaking raw fruits or proteins in acidic solutions (citrus, vinegar, salt) to denature proteins and concentrate natural flavors.',
    scienceExplanation: 'Low pH environments disrupt hydrogen bonds in protein structures, causing them to uncoil and firm up without thermal input.',
    scienceNote: 'Acids alter protein tertiary structures.',
    pitfalls: ['Over-macerating delicate fish resulting in rubbery texture', 'Using reactive copper or aluminum bowls'],
    steps: [
      'Slice ingredients uniformly for even acid penetration.',
      'Toss with fresh citrus juice, salt, and aromatics.',
      'Refrigerate for specified timeframe before serving.'
    ],
    isCustom: false,
  },
  {
    id: 'tech-6',
    title: 'Fermentation & Lacto-Preservation',
    category: 'Sauces & Chemistry',
    description: 'Utilizing beneficial anaerobic bacteria (Lactobacillus) to convert natural sugars into lactic acid.',
    scienceExplanation: 'Lactic acid bacteria thrive in controlled saline environments, dropping pH levels and naturally preventing spoilage pathogens from growing.',
    scienceNote: 'Requires a precise 2% to 5% salt-by-weight environment.',
    pitfalls: ['Exposing fermenting vegetables to air pockets causing mold', 'Using iodized salt'],
    steps: [
      'Weigh vegetables and calculate 2.5% salt weight.',
      'Massage salt into vegetables and pack tightly submerged in brine.',
      'Seal with an airlock and ferment at room temperature.'
    ],
    isCustom: false,
  },
  {
    id: 'tech-7',
    title: 'Flash-Frying & Tempura Sealing',
    category: 'Heat Application',
    description: 'Submerging delicate items in ultra-hot oil (180°C-190°C) coated in ice-cold batter to create a crisp, oil-free barrier.',
    scienceExplanation: 'Rapid moisture vaporization builds steam pressure inside the batter envelope, expanding it while repelling oil penetration.',
    scienceNote: 'Instant vaporization creates steam inside the batter shell.',
    pitfalls: ['Overcrowding the fryer dropping oil temperature', 'Using warm batter'],
    steps: [
      'Whisk very cold sparkling water into flour leaving lumps intact.',
      'Dredge ingredients lightly in dry starch before dipping.',
      'Fry in small batches until crisp and golden.'
    ],
    isCustom: false,
  },
  {
    id: 'tech-8',
    title: 'Clarified Consommé Filtration',
    category: 'Sauce Building',
    description: 'Transforming a cloudy stock into a crystal-clear, intensely flavored broth using a protein raft.',
    scienceExplanation: 'Coagulating albumin proteins from egg whites trap suspended micro-particles as convection currents push the raft upward.',
    scienceNote: 'Coagulating egg whites trap microscopic suspended solids.',
    pitfalls: ['Stirring the broth once the raft begins forming', 'Allowing violent boiling'],
    steps: [
      'Mix cold stock with whipped egg whites, minced lean meat, and mirepoix.',
      'Heat gently over medium-low flame until a solid protein raft forms.',
      'Carefully ladle out crystal-clear liquid from beneath the raft.'
    ],
    isCustom: false,
  },
];