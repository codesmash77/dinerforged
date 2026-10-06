import { SubstituteRecommendation } from '../types';

// Pre-computed normalized flavor profiles [Sweet, Savory, Acid, Fat, Umami, Bitter]
const FLAVOR_DATABASE: Record<string, number[]> = {
  'plain yogurt':       [0.2, 0.3, 0.7, 0.5, 0.2, 0.1],
  'heavy cream':        [0.3, 0.2, 0.1, 0.9, 0.2, 0.0],
  'coconut cream':      [0.4, 0.2, 0.1, 0.85, 0.1, 0.1],
  'pecorino romano':    [0.1, 0.9, 0.3, 0.6, 0.9, 0.2],
  'parmesan cheese':    [0.1, 0.85, 0.2, 0.6, 0.95, 0.1],
  'guanciale':          [0.1, 0.9, 0.0, 0.95, 0.8, 0.0],
  'pancetta':           [0.1, 0.85, 0.0, 0.9, 0.75, 0.0],
  'butter':             [0.1, 0.4, 0.0, 0.95, 0.2, 0.0],
  'ghee':               [0.1, 0.5, 0.0, 0.98, 0.3, 0.0],
  'olive oil':          [0.0, 0.3, 0.0, 0.9, 0.1, 0.2],
};

function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function findSmartSubstitute(ingredientName: string): SubstituteRecommendation | null {
  const cleanName = ingredientName.toLowerCase().trim();
  let targetVector = FLAVOR_DATABASE[cleanName];

  // Partial match lookup
  if (!targetVector) {
    const matchedKey = Object.keys(FLAVOR_DATABASE).find((key) => cleanName.includes(key) || key.includes(cleanName));
    if (matchedKey) targetVector = FLAVOR_DATABASE[matchedKey];
  }

  if (!targetVector) return null;

  let bestMatch = '';
  let highestScore = -1;

  for (const [candidate, vector] of Object.entries(FLAVOR_DATABASE)) {
    if (candidate === cleanName) continue;
    const score = cosineSimilarity(targetVector, vector);
    if (score > highestScore) {
      highestScore = score;
      bestMatch = candidate;
    }
  }

  return {
    original: ingredientName,
    substitute: bestMatch,
    ratio: '1:1 ratio equivalent',
    similarityScore: Math.round(highestScore * 100) / 100,
    reasoning: `Matched via flavor vector cosine similarity (${Math.round(highestScore * 100)}% chemical/flavor profile match).`
  };
}