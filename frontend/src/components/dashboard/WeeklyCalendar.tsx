import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'
import DayColumn from './DayColumn'
import MealRegistrationModal from './MealRegistrationModal'
import { getMeals, createMeal } from '../../api/meals'
import type { Meal, MealCreateInput, MealType, Ingredient } from '@/types'

// DayColumn と MealRegistrationModal で共用する日付情報の型
export type DayInfo = {
  key: string
  label: string
  date: string
  fullDate: string
  isToday: boolean
}

export type SlotMeals = {
  breakfast: Meal | null
  lunch: Meal | null
  dinner: Meal | null
}

type CalendarMealType = 'breakfast' | 'lunch' | 'dinner'

// 指定週オフセットの月〜日を生成
function getWeekDays(offset = 0): DayInfo[] {
  const today = new Date()
  const dow = today.getDay() // 0=日〜6=土
  const toMon = dow === 0 ? -6 : 1 - dow // 今週月曜への差分
  const monday = new Date(today)
  monday.setDate(today.getDate() + toMon + offset * 7)

  const LABELS = ['月', '火', '水', '木', '金', '土', '日']
  const KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

  return LABELS.map((label, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    const mm = d.getMonth() + 1
    const dd = d.getDate()
    const yyyy = d.getFullYear()
    return {
      key: KEYS[i],
      label,
      date: `${mm}/${dd}`,
      fullDate: `${yyyy}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`,
      isToday: d.toDateString() === today.toDateString(),
    }
  })
}

function getWeekLabel(days: DayInfo[]): string {
  const d = new Date(days[0].fullDate)
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const weekOfMonth = Math.ceil(d.getDate() / 7)
  return `${year}年${month}月 第${weekOfMonth}週`
}

type Props = {
  ingredients: Ingredient[]
  onRefetch?: () => void
}

function WeeklyCalendar({ ingredients = [], onRefetch }: Props) {
  const [weekOffset, setWeekOffset] = useState(0)
  const [meals, setMeals] = useState<Meal[]>([])
  const [loading, setLoading] = useState(true)
  const [modalState, setModalState] = useState<{ day: DayInfo; mealType: CalendarMealType } | null>(
    null
  )

  const days = getWeekDays(weekOffset)

  const fetchMeals = useCallback(async () => {
    try {
      const data = await getMeals()
      setMeals(data)
    } catch (err) {
      console.error('[WeeklyCalendar] meals fetch failed:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMeals()
  }, [fetchMeals])

  const getMealForSlot = (fullDate: string, mealType: MealType): Meal | null =>
    meals.find(m => m.scheduled_at?.slice(0, 10) === fullDate && m.meal_type === mealType) ?? null

  const handleOpenModal = (day: DayInfo, mealType: CalendarMealType) =>
    setModalState({ day, mealType })
  const handleCloseModal = () => setModalState(null)

  const handleSaveMeal = async (mealData: MealCreateInput) => {
    await createMeal(mealData) // throws on error → caught by Modal
    await fetchMeals()
    onRefetch?.()
    setModalState(null)
  }

  return (
    <>
      <section className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* ── ヘッダー ───────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <div className="flex items-center gap-2">
            <CalendarDays size={18} className="text-green-500" />
            <h2 className="text-sm font-bold text-gray-700">週間メニュー</h2>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500 mr-2">{getWeekLabel(days)}</span>
            <button
              onClick={() => setWeekOffset(o => o - 1)}
              className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setWeekOffset(0)}
              className="px-3 py-1 rounded-lg text-xs text-green-600 font-medium bg-green-50 hover:bg-green-100 transition-colors"
            >
              今週
            </button>
            <button
              onClick={() => setWeekOffset(o => o + 1)}
              className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* ── 7列グリッド ────────────────────────── */}
        <div className="overflow-x-auto">
          <div className="grid grid-cols-7 gap-3 p-4 min-w-[700px]">
            {days.map(day => (
              <DayColumn
                key={day.key}
                day={day}
                meals={{
                  breakfast: getMealForSlot(day.fullDate, 'breakfast'),
                  lunch: getMealForSlot(day.fullDate, 'lunch'),
                  dinner: getMealForSlot(day.fullDate, 'dinner'),
                }}
                loading={loading}
                onAddMeal={mealType => handleOpenModal(day, mealType)}
              />
            ))}
          </div>
        </div>

        {/* 凡例 */}
        <div className="px-5 pb-4 flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="text-[11px] text-gray-400">プログレスバーの見方:</span>
          {[
            { color: 'bg-green-500', label: 'タンパク質 達成' },
            { color: 'bg-green-400', label: '塩分 低め' },
            { color: 'bg-yellow-400', label: '塩分 注意' },
            { color: 'bg-red-400', label: '塩分 超過' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-1">
              <span className={`w-3 h-1.5 rounded-full inline-block ${item.color}`} />
              <span className="text-[11px] text-gray-400">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 食事登録モーダル ────────────────────── */}
      {modalState && (
        <MealRegistrationModal
          day={modalState.day}
          mealType={modalState.mealType}
          ingredients={ingredients}
          onClose={handleCloseModal}
          onSave={handleSaveMeal}
        />
      )}
    </>
  )
}

export default WeeklyCalendar
