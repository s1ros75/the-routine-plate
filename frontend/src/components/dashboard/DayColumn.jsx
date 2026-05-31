import { Sunrise, Sun, Moon } from 'lucide-react'
import MealCard from './MealCard'

const MEAL_SLOTS = [
  { key: 'breakfast', label: '朝', Icon: Sunrise, iconColor: 'text-orange-300' },
  { key: 'lunch',     label: '昼', Icon: Sun,     iconColor: 'text-yellow-400' },
  { key: 'dinner',    label: '夜', Icon: Moon,    iconColor: 'text-indigo-300' },
]

function DayColumn({ day, meals = {}, loading = false, onAddMeal }) {
  const isWeekend = day.label === '土' || day.label === '日'

  return (
    <div className="flex flex-col gap-2 min-w-0">
      {/* 曜日ヘッダー */}
      <div className={`
        rounded-xl py-2 text-center select-none
        ${day.isToday
          ? 'bg-green-500 shadow-md shadow-green-200'
          : isWeekend
            ? 'bg-gray-100'
            : 'bg-white border border-gray-100'}
      `}>
        <p className={`text-[11px] font-medium ${day.isToday ? 'text-green-100' : 'text-gray-400'}`}>
          {day.label}
        </p>
        <p className={`text-base font-bold leading-none mt-0.5 ${day.isToday ? 'text-white' : 'text-gray-700'}`}>
          {day.date.split('/')[1]}
        </p>
        {day.isToday && (
          <span className="text-[9px] text-green-200 font-medium">TODAY</span>
        )}
      </div>

      {/* 食事スロット */}
      {MEAL_SLOTS.map(({ key, label, Icon, iconColor }) => (
        <div key={key} className="space-y-1">
          <div className="flex items-center gap-1 px-0.5">
            <Icon size={10} className={iconColor} />
            <span className="text-[10px] text-gray-400 font-medium">{label}</span>
          </div>
          <MealCard
            meal={meals[key] ?? null}
            loading={loading}
            onClick={meals[key] ? undefined : () => onAddMeal?.(key)}
          />
        </div>
      ))}
    </div>
  )
}

export default DayColumn
