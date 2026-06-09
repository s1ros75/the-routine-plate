import { useState } from 'react'
import { Search, RefreshCw, Beef } from 'lucide-react'
import type { Ingredient } from '@/types'

type SortOption = {
  key: string
  label: string
  fn: (a: Ingredient, b: Ingredient) => number
}

// Ingredient の栄養素フィールドは Rails decimal → string のため Number() で変換
const SORT_OPTIONS: SortOption[] = [
  { key: 'name', label: '名前順', fn: (a, b) => a.name.localeCompare(b.name, 'ja') },
  {
    key: 'protein',
    label: 'タンパク質順',
    fn: (a, b) => Number(b.protein_per_100g) - Number(a.protein_per_100g),
  },
  {
    key: 'sodium',
    label: '塩分順',
    fn: (a, b) => Number(a.sodium_per_100g) - Number(b.sodium_per_100g),
  },
  {
    key: 'calories',
    label: 'カロリー順',
    fn: (a, b) => Number(b.calories_per_100g) - Number(a.calories_per_100g),
  },
]

type NutritionRowProps = {
  label: string
  value: string
  unit: string
  valueClass: string
}

const NutritionRow = ({ label, value, unit, valueClass }: NutritionRowProps) => (
  <div className="flex items-center justify-between">
    <span className="text-xs text-gray-400">{label}</span>
    <span className={`text-xs font-semibold ${valueClass}`}>
      {value}
      {unit}
    </span>
  </div>
)

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl p-4 shadow-sm animate-pulse space-y-3">
    <div className="h-4 bg-gray-200 rounded w-3/4" />
    <div className="space-y-2 pt-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex justify-between">
          <div className="h-3 bg-gray-200 rounded w-1/3" />
          <div className="h-3 bg-gray-200 rounded w-1/4" />
        </div>
      ))}
    </div>
  </div>
)

type Props = {
  ingredients: Ingredient[]
  loading: boolean
  error: string | null
  onRetry: () => void
}

function IngredientListPanel({ ingredients, loading, error, onRetry }: Props) {
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState('name')

  const currentSort = SORT_OPTIONS.find(o => o.key === sortKey) ?? SORT_OPTIONS[0]

  const filtered = ingredients.filter(ing => ing.name.includes(query)).sort(currentSort.fn)

  return (
    <section className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* ── ヘッダー ───────────────────────────────── */}
      <div className="px-5 pt-5 pb-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <Beef size={16} className="text-green-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-800">登録食材一覧</h3>
            <p className="text-xs text-gray-400">100g あたりの栄養素</p>
          </div>
        </div>

        {!loading && !error && (
          <div className="flex flex-wrap items-center gap-2">
            {/* 検索 */}
            <div className="relative flex-1 min-w-[160px] max-w-xs">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"
              />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="食材を検索..."
                className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 border border-gray-100 rounded-xl
                           focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-300 transition"
              />
            </div>

            {/* ソート */}
            <div className="flex gap-1 flex-wrap">
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setSortKey(opt.key)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    sortKey === opt.key
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── コンテンツ ─────────────────────────────── */}
      <div className="px-5 pb-5">
        {/* ローディング */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* エラー */}
        {!loading && error && (
          <div className="flex flex-col items-center gap-3 py-10">
            <p className="text-sm text-red-500">{error}</p>
            <button
              onClick={onRetry}
              className="flex items-center gap-1.5 text-sm font-medium text-white
                         bg-green-500 hover:bg-green-600 px-4 py-2 rounded-xl transition-colors"
            >
              <RefreshCw size={14} />
              再試行
            </button>
          </div>
        )}

        {/* データ */}
        {!loading && !error && (
          <>
            {filtered.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-10">
                「{query}」に一致する食材が見つかりません
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filtered.map(ing => (
                  <div
                    key={ing.id}
                    className="bg-gray-50 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow space-y-2.5"
                  >
                    {/* カードヘッダー */}
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-bold text-gray-800 leading-snug">
                        {ing.name}
                      </span>
                      {Number(ing.sodium_per_100g) === 0 && (
                        <span
                          className="flex-shrink-0 text-[10px] font-semibold text-green-600
                                         bg-green-100 px-2 py-0.5 rounded-full whitespace-nowrap"
                        >
                          塩分ゼロ
                        </span>
                      )}
                    </div>

                    {/* 栄養素 */}
                    <div className="space-y-1.5 border-t border-gray-100 pt-2.5">
                      <NutritionRow
                        label="タンパク質"
                        value={ing.protein_per_100g}
                        unit="g"
                        valueClass="text-green-600"
                      />
                      <NutritionRow
                        label="脂質"
                        value={ing.fat_per_100g}
                        unit="g"
                        valueClass="text-yellow-600"
                      />
                      <NutritionRow
                        label="炭水化物"
                        value={ing.carbohydrate_per_100g}
                        unit="g"
                        valueClass="text-orange-500"
                      />
                      <NutritionRow
                        label="塩分"
                        value={ing.sodium_per_100g}
                        unit="g"
                        valueClass={
                          Number(ing.sodium_per_100g) === 0 ? 'text-green-500' : 'text-sky-600'
                        }
                      />
                      <NutritionRow
                        label="カロリー"
                        value={ing.calories_per_100g}
                        unit="kcal"
                        valueClass="text-gray-700"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <p className="text-[10px] text-gray-300 text-right mt-3">
              {filtered.length} / {ingredients.length} 品目
            </p>
          </>
        )}
      </div>
    </section>
  )
}

export default IngredientListPanel
