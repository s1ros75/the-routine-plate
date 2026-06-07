// weekly_summary アクションが meals_by_type を { breakfast, lunch, dinner } のみ返す
// snack は next unless meals_by_type.key?(type) で除外される
export type WeeklyMeal = {
  id: number
  name: string
  protein_g: number
  sodium_g: number
  calories_kcal: number
}

export type DailyMeals = {
  breakfast: WeeklyMeal | null
  lunch: WeeklyMeal | null
  dinner: WeeklyMeal | null
}

export type DailyBreakdown = {
  date: string
  day_label: string
  is_today: boolean
  meals: DailyMeals
  total_protein_g: number
  total_sodium_g: number
  total_calories_kcal: number
}

export type WeeklySummaryTargets = {
  weekly_protein_g: number
  daily_protein_g: number
  daily_sodium_g_max: number
}

export type WeeklySummary = {
  week_start: string
  week_end: string
  total_protein_g: number
  total_sodium_g: number
  total_calories_kcal: number
  meals_count: number
  daily_breakdown: DailyBreakdown[]
  targets: WeeklySummaryTargets
}
