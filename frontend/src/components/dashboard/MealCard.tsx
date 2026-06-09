import { Plus } from 'lucide-react'
import NutritionProgressBar from '../nutrition/NutritionProgressBar'
import { MEAL_TARGETS } from '../../data/dummyMeals'
import type { Meal } from '@/types'

type Props = {
  meal: Meal | null
  loading?: boolean
  onClick?: () => void
  ariaLabel?: string
}

function MealCard({ meal, loading = false, onClick, ariaLabel = '食事を登録する' }: Props) {
  if (loading) {
    return <div className="w-full h-[100px] bg-gray-100 rounded-xl animate-pulse" />
  }

  if (!meal) {
    return (
      <button
        onClick={onClick}
        aria-label={ariaLabel}
        className="
          w-full h-[100px] flex flex-col items-center justify-center gap-1
          border border-dashed border-gray-200 rounded-xl
          text-gray-300 text-xs
          hover:border-green-300 hover:text-green-400 hover:bg-green-50/40
          transition-all duration-200 cursor-pointer group
        "
      >
        <Plus size={16} className="transition-transform group-hover:scale-110" />
        <span>未設定</span>
      </button>
    )
  }

  return (
    <div
      className="
      bg-white border border-gray-100 rounded-xl p-2.5
      shadow-sm hover:shadow-md hover:-translate-y-px
      transition-all duration-200 cursor-pointer
    "
    >
      <p className="text-xs font-semibold text-gray-800 leading-snug line-clamp-2 mb-2.5">
        {meal.name}
      </p>
      <div className="space-y-1.5">
        <NutritionProgressBar
          label="タンパク質"
          value={meal.protein_g}
          target={MEAL_TARGETS.protein_g}
          colorType="protein"
        />
        <NutritionProgressBar
          label="塩分"
          value={meal.sodium_g}
          target={MEAL_TARGETS.sodium_g}
          colorType="sodium"
        />
      </div>
    </div>
  )
}

export default MealCard
