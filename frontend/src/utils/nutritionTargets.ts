import type { WeeklySummaryTargets, MealTargets } from '@/types'

export function deriveMealTargets(targets: WeeklySummaryTargets): MealTargets {
  return {
    protein_g: Math.round(targets.daily_protein_g / 3),
    sodium_g: parseFloat((targets.daily_sodium_g_max / 3).toFixed(1)),
  }
}

export const DEFAULT_MEAL_TARGETS: MealTargets = {
  protein_g: 22,
  sodium_g: 2.5,
}
