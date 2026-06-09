import { useState } from 'react'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import type { Recipe, MealType, MealCreateInput } from '@/types'

type Props = {
  recipe: Recipe
  scheduledAt: string
  mealType: MealType
  onSave: (mealData: MealCreateInput) => Promise<void>
  onBack: () => void
}

function RecipeConfirmStep({ recipe, scheduledAt, mealType, onSave, onBack }: Props) {
  const [mealName, setMealName] = useState(recipe.name)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { nutrition } = recipe

  const handleSave = async () => {
    if (!mealName.trim()) {
      setError('メニュー名を入力してください')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await onSave({
        name: mealName.trim(),
        meal_type: mealType,
        scheduled_at: scheduledAt,
        ingredients: recipe.ingredients.map(ing => ({
          ingredient_id: ing.id,
          amount_g: ing.amount_g,
        })),
      })
    } catch (err) {
      const e = err as { response?: { data?: { errors?: string[] } }; message?: string }
      const msg = e.response?.data?.errors?.join('、') ?? e.message ?? '保存に失敗しました'
      setError(msg)
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* ── ヘッダー ─────────────────────────── */}
      <div className="flex items-center gap-2">
        <button
          onClick={onBack}
          className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft size={16} />
        </button>
        <h3 className="text-sm font-bold text-gray-800">確認・保存</h3>
      </div>

      {/* ── メニュー名（編集可能）─────────────── */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">
          メニュー名 <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={mealName}
          onChange={e => setMealName(e.target.value)}
          className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5
                     focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-300 transition"
          autoFocus
        />
      </div>

      {/* ── 食材一覧 ─────────────────────────── */}
      <div>
        <p className="text-xs font-semibold text-gray-600 mb-1.5">含まれる食材</p>
        <ul className="space-y-1.5">
          {recipe.ingredients.map(ing => (
            <li
              key={ing.id}
              className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2"
            >
              <span className="text-sm text-gray-700">{ing.name}</span>
              <span className="text-sm font-semibold text-gray-800">{ing.amount_g}g</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── 栄養素サマリー ─────────────────────── */}
      <div className="bg-green-50 border border-green-100 rounded-xl p-3">
        <p className="text-xs font-semibold text-green-700 mb-2">合計栄養素</p>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white rounded-lg p-2 text-center shadow-sm">
            <p className="text-[10px] text-gray-400">タンパク質</p>
            <p className="text-xs font-bold text-green-600">{nutrition.protein_g}g</p>
          </div>
          <div className="bg-white rounded-lg p-2 text-center shadow-sm">
            <p className="text-[10px] text-gray-400">塩分</p>
            <p className="text-xs font-bold text-blue-600">{nutrition.sodium_g}g</p>
          </div>
          <div className="bg-white rounded-lg p-2 text-center shadow-sm">
            <p className="text-[10px] text-gray-400">カロリー</p>
            <p className="text-xs font-bold text-gray-700">{nutrition.calories_kcal}kcal</p>
          </div>
        </div>
      </div>

      {/* ── エラー ───────────────────────────── */}
      {error && (
        <p className="text-xs text-red-500 text-center bg-red-50 rounded-xl py-2">{error}</p>
      )}

      {/* ── ボタン ───────────────────────────── */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={onBack}
          className="flex-1 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200
                     py-2.5 rounded-xl transition-colors"
        >
          戻る
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold
                     text-white bg-green-500 hover:bg-green-600 disabled:opacity-60
                     py-2.5 rounded-xl transition-colors"
        >
          {saving ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              保存中...
            </>
          ) : (
            <>
              <Save size={14} />
              保存する
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default RecipeConfirmStep
