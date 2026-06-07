export const DAYS_OF_WEEK = [
  { key: "mon", label: "月", date: "5/12", isToday: false },
  { key: "tue", label: "火", date: "5/13", isToday: true  },
  { key: "wed", label: "水", date: "5/14", isToday: false },
  { key: "thu", label: "木", date: "5/15", isToday: false },
  { key: "fri", label: "金", date: "5/16", isToday: false },
  { key: "sat", label: "土", date: "5/17", isToday: false },
  { key: "sun", label: "日", date: "5/18", isToday: false },
]

export const MEAL_TYPES = [
  { key: "breakfast", label: "朝食" },
  { key: "lunch",     label: "昼食" },
  { key: "dinner",    label: "夕食" },
]

// 1日の摂取目標値
export const DAILY_TARGETS = {
  protein_g: 65,
  sodium_g:  7.5,
}

// 1食あたりの目安 (日次目標を3食で分割)
export const MEAL_TARGETS = {
  protein_g: Math.round(DAILY_TARGETS.protein_g / 3), // 22g
  sodium_g:  parseFloat((DAILY_TARGETS.sodium_g  / 3).toFixed(1)), // 2.5g
}
