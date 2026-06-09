type ColorType = 'protein' | 'sodium'

type Props = {
  label: string
  value: number
  target: number
  unit?: string
  colorType?: ColorType
}

function NutritionProgressBar({ label, value, target, unit = 'g', colorType = 'protein' }: Props) {
  const pct = target === 0 ? 0 : Math.min((value / target) * 100, 100)

  const barColor = (() => {
    if (colorType === 'sodium') {
      if (pct < 60) return 'bg-green-400'
      if (pct < 90) return 'bg-yellow-400'
      return 'bg-red-400'
    }
    // protein — 多いほど緑に近づく
    if (pct >= 80) return 'bg-green-500'
    if (pct >= 50) return 'bg-green-300'
    return 'bg-gray-300'
  })()

  const isOver = value > target

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-gray-400">{label}</span>
        <span className="text-[10px] font-semibold text-gray-600">
          {value}
          <span className="font-normal text-gray-400">
            /{target}
            {unit}
          </span>
          {isOver && colorType === 'protein' && <span className="ml-1 text-green-500">✓</span>}
          {isOver && colorType === 'sodium' && <span className="ml-1 text-red-400">!</span>}
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${value}/${target}`}
        className="h-1.5 bg-gray-100 rounded-full overflow-hidden"
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export default NutritionProgressBar
