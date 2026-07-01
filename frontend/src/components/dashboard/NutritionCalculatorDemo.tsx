import { useState } from 'react'
import { Calculator, Plus, Trash2, Loader2 } from 'lucide-react'
import { calculateNutrition } from '../../api/meals'
import NutritionProgressBar from '../nutrition/NutritionProgressBar'
import { DEFAULT_MEAL_TARGETS } from '../../utils/nutritionTargets'
import type { Ingredient, Nutrition, MealTargets } from '@/types'

type Entry = {
  ingredient_id: number
  amount_g: number
  name: string
}

type Props = {
  ingredients: Ingredient[]
  loading: boolean
  mealTargets?: MealTargets
}

function NutritionCalculatorDemo({ ingredients, loading: ingredientsLoading, mealTargets = DEFAULT_MEAL_TARGETS }: Props) {
  const [selectedId, setSelectedId] = useState('')
  const [amountG, setAmountG] = useState('100')
  const [entries, setEntries] = useState<Entry[]>([])
  const [result, setResult] = useState<Nutrition | null>(null)
  const [calculating, setCalculating] = useState(false)
  const [calcError, setCalcError] = useState<string | null>(null)

  const addEntry = () => {
    const id = Number(selectedId)
    const amount = Number(amountG)
    if (!id || !amount || amount <= 0) return
    const ingredient = ingredients.find(i => i.id === id)
    if (!ingredient) return

    setEntries(prev => [...prev, { ingredient_id: id, amount_g: amount, name: ingredient.name }])
    setSelectedId('')
    setAmountG('100')
    setResult(null)
    setCalcError(null)
  }

  const removeEntry = (idx: number) => {
    setEntries(prev => prev.filter((_, i) => i !== idx))
    setResult(null)
    setCalcError(null)
  }

  const handleCalculate = async () => {
    if (entries.length === 0) return
    setCalculating(true)
    setCalcError(null)
    setResult(null)
    try {
      const data = await calculateNutrition(
        entries.map(e => ({ ingredient_id: e.ingredient_id, amount_g: e.amount_g }))
      )
      setResult(data.nutrition)
    } catch (err) {
      const e = err as { response?: { data?: { error?: string } }; message?: string }
      setCalcError(e.response?.data?.error ?? e.message ?? '計算に失敗しました')
    } finally {
      setCalculating(false)
    }
  }

  return (
    <section className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
      {/* ── ヘッダー ─────────────────────────── */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
          <Calculator size={16} className="text-green-600" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-800">栄養計算をテストする</h3>
          <p className="text-xs text-gray-400">食材とg数を組み合わせて合計栄養素を確認</p>
        </div>
      </div>

      {/* ── 入力行 ───────────────────────────── */}
      <div className="flex gap-2 flex-wrap">
        <select
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
          disabled={ingredientsLoading || ingredients.length === 0}
          className="flex-1 min-w-[160px] text-sm border border-gray-200 rounded-xl px-3 py-2
                     bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-300
                     disabled:opacity-40 transition"
        >
          <option value="">食材を選択...</option>
          {ingredients.map(ing => (
            <option key={ing.id} value={ing.id}>
              {ing.name}
            </option>
          ))}
        </select>

        <div className="relative">
          <input
            type="number"
            value={amountG}
            onChange={e => setAmountG(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addEntry()}
            min="1"
            max="9999"
            disabled={ingredientsLoading}
            className="w-24 text-sm border border-gray-200 rounded-xl px-3 py-2 pr-7 text-right
                       bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-300
                       disabled:opacity-40 transition"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
            g
          </span>
        </div>

        <button
          onClick={addEntry}
          disabled={!selectedId || !amountG || Number(amountG) <= 0 || ingredientsLoading}
          className="flex items-center gap-1 text-sm font-medium text-white bg-green-500
                     hover:bg-green-600 disabled:opacity-40 px-3 py-2 rounded-xl transition-colors"
        >
          <Plus size={15} />
          追加
        </button>
      </div>

      {/* ── 追加済みエントリ ──────────────────── */}
      {entries.length > 0 && (
        <ul className="space-y-1.5">
          {entries.map((entry, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2"
            >
              <span className="text-sm text-gray-700">{entry.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-800">{entry.amount_g}g</span>
                <button
                  onClick={() => removeEntry(idx)}
                  className="text-gray-300 hover:text-red-400 transition-colors"
                  aria-label="削除"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* ── 計算ボタン ────────────────────────── */}
      <button
        onClick={handleCalculate}
        disabled={entries.length === 0 || calculating}
        className="w-full flex items-center justify-center gap-2 text-sm font-semibold
                   text-white bg-green-500 hover:bg-green-600 disabled:opacity-40
                   py-2.5 rounded-xl transition-colors"
      >
        {calculating ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            計算中...
          </>
        ) : (
          <>
            <Calculator size={16} />
            合計栄養素を計算する
          </>
        )}
      </button>

      {/* エラー */}
      {calcError && <p className="text-sm text-red-500 text-center">{calcError}</p>}

      {/* ── 計算結果 ──────────────────────────── */}
      {result && (
        <div className="border border-green-100 bg-green-50 rounded-2xl p-4 space-y-4">
          <p className="text-xs font-semibold text-green-700">計算結果（合計）</p>

          {/* プログレスバー付き */}
          <div className="space-y-2.5">
            <NutritionProgressBar
              label="タンパク質"
              value={result.protein_g}
              target={mealTargets.protein_g}
              colorType="protein"
            />
            <NutritionProgressBar
              label="塩分"
              value={result.sodium_g}
              target={mealTargets.sodium_g}
              colorType="sodium"
            />
          </div>

          {/* その他の栄養素 */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            {[
              { label: '脂質', value: result.fat_g, unit: 'g', color: 'text-yellow-600' },
              {
                label: '炭水化物',
                value: result.carbohydrate_g,
                unit: 'g',
                color: 'text-orange-500',
              },
              {
                label: 'カロリー',
                value: result.calories_kcal,
                unit: 'kcal',
                color: 'text-gray-700',
              },
            ].map(({ label, value, unit, color }) => (
              <div key={label} className="bg-white rounded-xl p-3 text-center shadow-sm">
                <p className="text-[10px] text-gray-400 mb-0.5">{label}</p>
                <p className={`text-sm font-bold ${color}`}>
                  {value}
                  <span className="text-[10px] font-normal text-gray-400 ml-0.5">{unit}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export default NutritionCalculatorDemo
