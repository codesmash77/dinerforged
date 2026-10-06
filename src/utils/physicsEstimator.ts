import { Utensil } from '../types';

/**
 * Adjusts cooking step timers based on cookware thermal retention and target yield multiplier.
 */
export function estimateAdjustedCookTime(
  baseMinutes: number,
  utensil?: Utensil,
  servingMultiplier: number = 1
): { adjustedMinutes: number; rationale: string } {
  if (baseMinutes <= 0) return { adjustedMinutes: 0, rationale: 'Instant step' };

  let multiplier = 1.0;
  let rationale = 'Standard thermal conduction rate.';

  if (utensil) {
    if (utensil.thermalRetention === 'High') {
      // Cast iron / enamel holds heat longer, reducing thermal drop during ingredient loading
      multiplier -= 0.1;
      rationale = `${utensil.name} high thermal retention accelerates heat recovery.`;
    } else if (utensil.thermalRetention === 'Low') {
      multiplier += 0.05;
      rationale = `${utensil.name} low thermal retention requires steady energy input.`;
    }
  }

  if (servingMultiplier > 1.5) {
    // Increased pan mass absorbs thermal energy
    const massFactor = Math.log2(servingMultiplier) * 0.15;
    multiplier += massFactor;
    rationale += ` Yield increased by ${servingMultiplier}x (+${Math.round(massFactor * 100)}% thermal mass adjustment).`;
  }

  const adjustedMinutes = Math.max(1, Math.round(baseMinutes * multiplier));

  return { adjustedMinutes, rationale };
}