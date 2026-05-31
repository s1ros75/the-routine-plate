/**
 * @param {string}  label      - 栄養素名 ("タンパク質" / "塩分")
 * @param {number}  value      - 実績値
 * @param {number}  target     - 目標値 (タンパク質: 達成目標 / 塩分: 上限目標)
 * @param {string}  unit       - 単位 (デフォルト "g")
 * @param {'protein'|'sodium'} colorType
 *   - protein: 多いほど良い → 緑で達成感を表現
 *   - sodium:  少ないほど良い → 増えるにつれ黄→赤で警告
 */
function NutritionProgressBar({ label, value, target, unit = 'g', colorType = 'protein' }) {
  const pct = Math.min((value / target) * 100, 100)

  const barColor = (() => {
    if (colorType === 'sodium') {
      if (pct < 60)  return 'bg-green-400'
      if (pct < 90)  return 'bg-yellow-400'
      return 'bg-red-400'
    }
    // protein — 多いほど緑に近づく
    if (pct >= 80)  return 'bg-green-500'
    if (pct >= 50)  return 'bg-green-300'
    return 'bg-gray-300'
  })()

  const isOver = value > target

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-gray-400">{label}</span>
        <span className="text-[10px] font-semibold text-gray-600">
          {value}
          <span className="font-normal text-gray-400">/{target}{unit}</span>
          {isOver && colorType === 'protein' && (
            <span className="ml-1 text-green-500">✓</span>
          )}
          {isOver && colorType === 'sodium' && (
            <span className="ml-1 text-red-400">!</span>
          )}
        </span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export default NutritionProgressBar
