import Header from '../ui/Header'
import WeeklySummary from './WeeklySummary'
import WeeklyCalendar from './WeeklyCalendar'
import IngredientListPanel from './IngredientListPanel'
import NutritionCalculatorDemo from './NutritionCalculatorDemo'
import { useIngredients } from '../../hooks/useIngredients'
import { useWeeklySummary } from '../../hooks/useWeeklySummary'

function Dashboard() {
  const {
    data: ingredients,
    loading: ingredientsLoading,
    error: ingredientsError,
    retry,
  } = useIngredients()
  const { data: summary, loading: summaryLoading, refetch: refetchSummary } = useWeeklySummary()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-screen-xl mx-auto px-4 py-6 space-y-5">
        <div>
          <h2 className="text-lg font-bold text-gray-800">ダッシュボード</h2>
          <p className="text-sm text-gray-400 mt-0.5">今週の食事プランと栄養バランスの概要</p>
        </div>

        <WeeklySummary summary={summary} loading={summaryLoading} />

        <WeeklyCalendar ingredients={ingredients} onRefetch={refetchSummary} />

        <IngredientListPanel
          ingredients={ingredients}
          loading={ingredientsLoading}
          error={ingredientsError}
          onRetry={retry}
        />

        <NutritionCalculatorDemo ingredients={ingredients} loading={ingredientsLoading} />
      </main>
    </div>
  )
}

export default Dashboard
