import { Recipe } from '../types';

export const recipes: Recipe[] = [
  {
    id: 'chicken-tikka-masala',
    title: 'Authentic Chicken Tikka Masala',
    cuisine: 'Indian',
    originStory: 'Created by South Asian chefs in Glasgow during the 1970s, combining British preferences with traditional Mughlai curry techniques.',
    culturalContext: 'Considered one of Great Britain’s national dishes, representing cross-cultural culinary fusion.',
    funFact: 'Marinating chicken in yogurt breaks down proteins using lactic acid without making the meat mushy like fruit enzymes do.',
    prepTimeMinutes: 25,
    cookTimeMinutes: 35,
    baseServings: 4,
    difficulty: 'Medium',
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
    tags: ['Curry', 'High-Protein', 'Gluten-Free', 'Indian'],
    heatConductivityRating: 'high',
    ingredients: [
      { id: 'ing-1', name: 'Chicken Thighs', amount: 800, unit: 'g', category: 'Meat', scalingType: 'linear' },
      { id: 'ing-2', name: 'Plain Yogurt', amount: 150, unit: 'g', category: 'Dairy', scalingType: 'linear' },
      { id: 'ing-3', name: 'Garam Masala', amount: 2, unit: 'tbsp', category: 'Spices', scalingType: 'sublinear_spices' },
      { id: 'ing-4', name: 'Ground Turmeric', amount: 1, unit: 'tsp', category: 'Spices', scalingType: 'sublinear_spices' },
      { id: 'ing-5', name: 'Garlic Powder', amount: 1, unit: 'tsp', category: 'Spices', scalingType: 'sublinear_spices' },
      { id: 'ing-6', name: 'Sea Salt', amount: 1.5, unit: 'tsp', category: 'Spices', scalingType: 'sublinear_spices' },
      { id: 'ing-7', name: 'Heavy Cream', amount: 200, unit: 'ml', category: 'Dairy', scalingType: 'linear' },
      { id: 'ing-8', name: 'Crushed Tomatoes', amount: 400, unit: 'g', category: 'Produce', scalingType: 'linear' },
      { id: 'ing-9', name: 'Butter for greasing', amount: 2, unit: 'tbsp', category: 'Oil & Fat', scalingType: 'fixed_binders' }
    ],
    instructions: [
      'Cut chicken thighs into bite-sized pieces and combine with yogurt, garam masala, turmeric, and garlic.',
      'Marinate for at least 30 minutes in the refrigerator.',
      'Heat butter in a heavy skillet or Dutch oven over high heat. Sear chicken in batches to achieve caramelization without crowding.',
      'Remove chicken, add crushed tomatoes and simmer until reduced by half.',
      'Pour in heavy cream, return chicken to the pot, and cook gently for 15 minutes until tender.',
      'Season with sea salt to taste and garnish with fresh cilantro.'
    ]
  },
  {
    id: 'pasta-carbonara',
    title: 'Traditional Roman Pasta Carbonara',
    cuisine: 'Italian',
    originStory: 'Emerging in Rome post-WWII, utilizing American soldier rations of bacon and eggs alongside local Pecorino Romano.',
    culturalContext: 'A holy grail of Roman pasta that relies entirely on emulsification science rather than cream.',
    funFact: 'Adding cream to authentic Roman carbonara is considered culinary sacrilege in Italy!',
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    baseServings: 2,
    difficulty: 'Medium',
    imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=800&q=80',
    tags: ['Pasta', 'Italian', 'Quick', 'Classic'],
    heatConductivityRating: 'medium',
    ingredients: [
      { id: 'ing-10', name: 'Spaghetti', amount: 220, unit: 'g', category: 'Pantry', scalingType: 'linear' },
      { id: 'ing-11', name: 'Guanciale or Pancetta', amount: 120, unit: 'g', category: 'Meat', scalingType: 'linear' },
      { id: 'ing-12', name: 'Egg Yolks', amount: 4, unit: 'pcs', category: 'Dairy', scalingType: 'linear' },
      { id: 'ing-13', name: 'Pecorino Romano Cheese', amount: 50, unit: 'g', category: 'Dairy', scalingType: 'linear' },
      { id: 'ing-14', name: 'Coarsely Ground Black Pepper', amount: 1, unit: 'tbsp', category: 'Spices', scalingType: 'sublinear_spices' }
    ],
    instructions: [
      'Bring a pot of salted water to a boil and cook spaghetti until al dente.',
      'Crisp guanciale in a cold skillet over medium heat until fat renders completely.',
      'Whisk egg yolks and grated Pecorino Romano together in a bowl to form a thick paste.',
      'Transfer pasta directly to the skillet off the heat, tossing in rendered fat.',
      'Pour in egg and cheese mixture while vigorously tossing, adding starchy pasta water to create a glossy, silky emulsion.'
    ]
  },
  {
    id: 'japanese-pork-tonkatsu',
    title: 'Crispy Japanese Pork Tonkatsu',
    cuisine: 'Japanese',
    originStory: 'Adapted from Western cutlets during the Meiji Restoration, becoming a staple of Yoshoku (Western-influenced Japanese cuisine).',
    culturalContext: 'Eaten traditionally by students before exams because "katsu" is a homophone for the word "to win".',
    funFact: 'Double frying at two distinct temperatures guarantees maximum crispiness without burning the exterior panko breadcrumbs.',
    prepTimeMinutes: 20,
    cookTimeMinutes: 15,
    baseServings: 2,
    difficulty: 'Easy',
    imageUrl: 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?auto=format&fit=crop&w=800&q=80',
    tags: ['Crispy', 'Japanese', 'Pork', 'Comfort Food'],
    heatConductivityRating: 'high',
    ingredients: [
      { id: 'ing-15', name: 'Center-Cut Pork Chops', amount: 2, unit: 'pcs', category: 'Meat', scalingType: 'linear' },
      { id: 'ing-16', name: 'Panko Breadcrumbs', amount: 100, unit: 'g', category: 'Pantry', scalingType: 'linear' },
      { id: 'ing-17', name: 'All-Purpose Flour', amount: 50, unit: 'g', category: 'Pantry', scalingType: 'linear' },
      { id: 'ing-18', name: 'Large Egg', amount: 1, unit: 'pcs', category: 'Dairy', scalingType: 'linear' },
      { id: 'ing-19', name: 'Neutral Vegetable Oil for frying', amount: 500, unit: 'ml', category: 'Oil & Fat', scalingType: 'fixed_binders' }
    ],
    instructions: [
      'Score the tendon connecting fat and meat on pork chops to prevent curling.',
      'Dredge pork in flour, dip into beaten egg, and press firmly into panko breadcrumbs.',
      'Heat oil to 170°C (340°F) and fry pork cutlets for 3-4 minutes per side until light golden brown.',
      'Rest cutlets for 4 minutes, then flash-fry at 190°C (375°F) for 1 minute to shatter-crisp perfection.',
      'Slice into strips and serve with shredded cabbage and Tonkatsu sauce.'
    ]
  }
];