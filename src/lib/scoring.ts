import { ScoringResult } from './types';

/**
 * Calculates prediction score based on Bounded Exponential Decay formula:
 * - 0% error  => +100 points
 * - 30% error => ~0 points (breakeven)
 * - Hard floor: -50 points
 * - Early Bird Multipliers (1.25x for >=14d, 1.10x for >=4d) applied ONLY to positive scores.
 */
export function calculateScore(
  predictedRevenue: number,
  actualRevenue: number,
  submittedAtIso: string,
  releaseDateIso: string
): ScoringResult {
  if (!actualRevenue || actualRevenue <= 0) {
    return {
      errorPercentage: 0,
      rawScore: 0,
      finalScore: 0,
      earlyBirdMultiplier: 1.0,
      daysInAdvance: 0,
    };
  }

  // Step 1: Calculate Percentage Error
  const errorPercentage = (Math.abs(predictedRevenue - actualRevenue) / actualRevenue) * 100;

  // Step 2: Apply Shifted Exponential Decay Formula
  // raw_score = 125 * (e ^ (-0.03 * error_pct)) - 25
  const rawScore = 125 * Math.exp(-0.03 * errorPercentage) - 25;

  // Step 3: Apply Hard Floor (-50 points)
  let finalScore = Math.max(-50, rawScore);

  // Step 4: Calculate Early Bird Multiplier
  const submissionTime = new Date(submittedAtIso).getTime();
  const releaseTime = new Date(releaseDateIso).getTime();
  const diffMs = releaseTime - submissionTime;
  const daysInAdvance = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

  let earlyBirdMultiplier = 1.0;
  if (daysInAdvance >= 14) {
    earlyBirdMultiplier = 1.25;
  } else if (daysInAdvance >= 4) {
    earlyBirdMultiplier = 1.10;
  }

  // Apply multiplier ONLY if score > 0
  if (finalScore > 0) {
    finalScore = finalScore * earlyBirdMultiplier;
  }

  // Round scores to 1 decimal place for display accuracy
  return {
    errorPercentage: Math.round(errorPercentage * 10) / 10,
    rawScore: Math.round(rawScore * 10) / 10,
    finalScore: Math.round(finalScore * 10) / 10,
    earlyBirdMultiplier,
    daysInAdvance,
  };
}

/**
 * Format currency numbers ($ format)
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return 'TBD';
  if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(2)}B`;
  }
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
}
