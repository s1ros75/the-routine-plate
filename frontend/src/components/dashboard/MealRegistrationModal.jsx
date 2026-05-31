import { useState, useEffect, useMemo } from 'react'
import { X, Plus, Trash2, Loader2, Calculator, Sparkles, Search } from 'lucide-react'
import NutritionProgressBar from '../nutrition/NutritionProgressBar'
import RecipeSuggestionsList from './RecipeSuggestionsList'
import RecipeConfirmStep from './RecipeConfirmStep'

const MEAL_TYPE_LABEL = { breakfast: '朝食', lunch: '昼食', dinner: '夕食' }
const MEAL_TIME       = { breakfast: '08:00:00', lunch: '12:00:00', dinner: '19:00:00' }

function computeNutrition(entries, ingredients) {
  const raw = entries.reduce(
    (acc, entry) => {
      const ing = ingredients.find((i) => i.id === entry.ingredient_id)
      if (!ing) return acc
      const r = entry.amount_g / 100
      return {
        protein_g:      acc.protein_g      + (ing.protein_per_100g      ?? 0) * r,
        fat_g:          acc.fat_g          + (ing.fat_per_100g          ?? 0) * r,
        carbohydrate_g: acc.carbohydrate_g + (ing.carbohydrate_per_100g ?? 0) * r,
        sodium_g:       acc.sodium_g       + (ing.sodium_per_100g       ?? 0) * r,
        calories_kcal:  acc.calories_kcal  + (ing.calories_per_100g     ?? 0) * r,
      }
    },
    { protein_g: 0, fat_g: 0, carbohydrate_g: 0, sodium_g: 0, calories_kcal: 0 }
  )
  return {
    protein_g:      Math.round(raw.protein_g * 10) / 10,
    fat_g:          Math.round(raw.fat_g * 10) / 10,
    carbohydrate_g: Math.round(raw.carbohydrate_g * 10) / 10,
    sodium_g:       Math.round(raw.sodium_g * 100) / 100,
    calories_kcal:  Math.round(raw.calories_kcal),
  }
}

// ── ステップ1: 食材選択 ──────────────────────────────────────────
function IngredientPickerStep({ ingredients, onSearchRecipes, onManual }) {
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [query, setQuery]             = useState('')

  const filtered = ingredients.filter((ing) =>
    ing.name.includes(query)
  )

  const toggle = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const selectedIngredients = ingredients.filter((ing) => selectedIds.has(ing.id))

  return (
    <div className="space-y-4">
      {/* 選択中チップ */}
      {selectedIngredients.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedIngredients.map((ing) => (
            <button
              key={ing.id}
              onClick={() => toggle(ing.id)}
              className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2.5 py-1
                         rounded-full font-medium hover:bg-green-200 transition-colors"
            >
              {ing.name}
              <X size={10} />
            </button>
          ))}
        </div>
      )}

      {/* 検索 */}
      <div className="relative">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="食材を絞り込む..."
          className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl
                     focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-300 transition"
        />
      </div>

      {/* 食材リスト */}
      <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
        {filtered.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4">食材が見つかりません</p>
        ) : (
          filtered.map((ing) => {
            const selected = selectedIds.has(ing.id)
            return (
              <button
                key={ing.id}
                onClick={() => toggle(ing.id)}
                className={`w-full flex items-center justify-between text-sm px-3 py-2 rounded-xl
                            transition-colors text-left ${
                              selected
                                ? 'bg-green-50 border border-green-200 text-green-800'
                                : 'bg-gray-50 border border-transparent text-gray-700 hover:bg-gray-100'
                            }`}
              >
                <span>{ing.name}</span>
                {selected && (
                  <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 10 10" className="w-2.5 h-2.5 text-white fill-none stroke-white stroke-2">
                      <polyline points="2,5 4,7 8,3" />
                    </svg>
                  </span>
                )}
              </button>
            )
          })
        )}
      </div>

      {/* ボタン */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={onManual}
          className="flex-1 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200
                     py-2.5 rounded-xl transition-colors"
        >
          自由入力で登録
        </button>
        <button
          onClick={() => onSearchRecipes(Array.from(selectedIds))}
          disabled={selectedIds.size === 0}
          className="flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold
                     text-white bg-green-500 hover:bg-green-600 disabled:opacity-40
                     py-2.5 rounded-xl transition-colors"
        >
          <Sparkles size={14} />
          レシピを提案する
        </button>
      </div>
    </div>
  )
}

// ── ステップ manual: 自由入力 ─────────────────────────────────────
function ManualEntryStep({ ingredients, onBack, onSave }) {
  const [mealName, setMealName]     = useState('')
  const [selectedId, setSelectedId] = useState('')
  const [amountG, setAmountG]       = useState('100')
  const [entries, setEntries]       = useState([])
  const [saving, setSaving]         = useState(false)
  const [error, setError]           = useState(null)

  const nutrition = useMemo(
    () => computeNutrition(entries, ingredients),
    [entries, ingredients]
  )

  const addEntry = () => {
    const id     = Number(selectedId)
    const amount = Number(amountG)
    if (!id || !amount || amount <= 0) return
    const ingredient = ingredients.find((i) => i.id === id)
    if (!ingredient) return
    setEntries((prev) => [...prev, { ingredient_id: id, amount_g: amount, name: ingredient.name }])
    setSelectedId('')
    setAmountG('100')
    setError(null)
  }

  const removeEntry = (idx) => setEntries((prev) => prev.filter((_, i) => i !== idx))

  const handleSave = async () => {
    if (!mealName.trim())    { setError('メニュー名を入力してください'); return }
    if (entries.length === 0) { setError('食材を1つ以上追加してください'); return }

    setSaving(true)
    setError(null)
    try {
      await onSave({
        name:        mealName.trim(),
        ingredients: entries.map(({ ingredient_id, amount_g }) => ({ ingredient_id, amount_g })),
      })
    } catch (err) {
      const msg = err.response?.data?.errors?.join('、') ?? err.message ?? '保存に失敗しました'
      setError(msg)
      setSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* メニュー名 */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">
          メニュー名 <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={mealName}
          onChange={(e) => setMealName(e.target.value)}
          placeholder="例：サーモンと玄米のヘルシー定食"
          className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5
                     focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-300 transition"
          autoFocus
        />
      </div>

      {/* 食材追加 */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5">
          食材を追加 <span className="text-red-400">*</span>
        </label>
        <div className="flex gap-2">
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="flex-1 min-w-0 text-sm border border-gray-200 rounded-xl px-3 py-2
                       bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-200 transition"
          >
            <option value="">食材を選択...</option>
            {ingredients.map((ing) => (
              <option key={ing.id} value={ing.id}>{ing.name}</option>
            ))}
          </select>

          <div className="relative flex-shrink-0">
            <input
              type="number"
              value={amountG}
              onChange={(e) => setAmountG(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addEntry()}
              min="1"
              max="9999"
              className="w-20 text-sm border border-gray-200 rounded-xl px-3 py-2 pr-6 text-right
                         bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-200 transition"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
              g
            </span>
          </div>

          <button
            onClick={addEntry}
            disabled={!selectedId || Number(amountG) <= 0}
            className="flex items-center gap-1 text-sm font-medium text-white bg-green-500
                       hover:bg-green-600 disabled:opacity-40 px-3 py-2 rounded-xl transition-colors flex-shrink-0"
          >
            <Plus size={14} />
            追加
          </button>
        </div>

        {entries.length > 0 && (
          <ul className="mt-2 space-y-1.5">
            {entries.map((entry, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2"
              >
                <span className="text-sm text-gray-700 truncate mr-2">{entry.name}</span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-sm font-semibold text-gray-800">{entry.amount_g}g</span>
                  <button
                    onClick={() => removeEntry(idx)}
                    className="text-gray-300 hover:text-red-400 transition-colors"
                    aria-label="削除"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 栄養素プレビュー */}
      {entries.length > 0 && (
        <div className="bg-green-50 border border-green-100 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-1.5">
            <Calculator size={13} className="text-green-600" />
            <p className="text-xs font-semibold text-green-700">栄養素プレビュー（リアルタイム）</p>
          </div>
          <div className="space-y-2">
            <NutritionProgressBar label="タンパク質" value={nutrition.protein_g} target={20} colorType="protein" />
            <NutritionProgressBar label="塩分"       value={nutrition.sodium_g}  target={2}  colorType="sodium" />
          </div>
          <div className="grid grid-cols-3 gap-2 pt-1">
            {[
              { label: '脂質',     value: `${nutrition.fat_g}g`,           color: 'text-yellow-600' },
              { label: '炭水化物', value: `${nutrition.carbohydrate_g}g`,  color: 'text-orange-500' },
              { label: 'カロリー', value: `${nutrition.calories_kcal}kcal`, color: 'text-gray-700'   },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white rounded-lg p-2 text-center shadow-sm">
                <p className="text-[10px] text-gray-400">{label}</p>
                <p className={`text-xs font-bold ${color}`}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500 text-center bg-red-50 rounded-xl py-2">{error}</p>
      )}

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
          ) : '保存'}
        </button>
      </div>
    </div>
  )
}

// ── メインモーダル ────────────────────────────────────────────────
function MealRegistrationModal({ day, mealType, ingredients, onClose, onSave }) {
  const [step, setStep]                   = useState('ingredients') // 'ingredients' | 'recipes' | 'confirm' | 'manual'
  const [selectedIngredientIds, setSelectedIngredientIds] = useState([])
  const [selectedRecipe, setSelectedRecipe] = useState(null)

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleSearchRecipes = (ids) => {
    setSelectedIngredientIds(ids)
    setStep('recipes')
  }

  const handleSelectRecipe = (recipe) => {
    setSelectedRecipe(recipe)
    setStep('confirm')
  }

  const handleSaveFromManual = async ({ name, ingredients: ings }) => {
    await onSave({
      name,
      meal_type:    mealType,
      scheduled_at: `${day.fullDate}T${MEAL_TIME[mealType]}`,
      ingredients:  ings,
    })
  }

  const handleSaveFromConfirm = async (mealData) => {
    await onSave(mealData)
  }

  const stepTitles = {
    ingredients: '食材を選ぶ',
    recipes:     'レシピ候補',
    confirm:     '確認・保存',
    manual:      '自由入力',
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── ヘッダー ─────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
          <div>
            <h2 className="text-sm font-bold text-gray-800">
              {MEAL_TYPE_LABEL[mealType]}を登録
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {day.date}（{day.label}）— {stepTitles[step]}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          {step === 'ingredients' && (
            <IngredientPickerStep
              ingredients={ingredients}
              onSearchRecipes={handleSearchRecipes}
              onManual={() => setStep('manual')}
            />
          )}

          {step === 'recipes' && (
            <RecipeSuggestionsList
              ingredientIds={selectedIngredientIds}
              onSelectRecipe={handleSelectRecipe}
              onBack={() => setStep('ingredients')}
            />
          )}

          {step === 'confirm' && selectedRecipe && (
            <RecipeConfirmStep
              recipe={selectedRecipe}
              scheduledAt={`${day.fullDate}T${MEAL_TIME[mealType]}`}
              mealType={mealType}
              onSave={handleSaveFromConfirm}
              onBack={() => setStep('recipes')}
            />
          )}

          {step === 'manual' && (
            <ManualEntryStep
              ingredients={ingredients}
              onBack={() => setStep('ingredients')}
              onSave={handleSaveFromManual}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default MealRegistrationModal
