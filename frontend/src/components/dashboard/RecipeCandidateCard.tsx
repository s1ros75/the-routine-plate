import { useState } from 'react'
import { Clock, ChevronDown, ChevronUp, Check } from 'lucide-react'
import type { Recipe, Difficulty } from '@/types'

const DIFFICULTY_LABEL: Record<Difficulty, string> = { easy: '簡単', normal: '普通', hard: 'やや手間' }
const DIFFICULTY_CLASS: Record<Difficulty, string> = {
  easy:   'bg-green-100 text-green-700',
  normal: 'bg-yellow-100 text-yellow-700',
  hard:   'bg-orange-100 text-orange-700',
}

type Props = {
  recipe: Recipe
  onSelect: (recipe: Recipe) => void
}

function RecipeCandidateCard({ recipe, onSelect }: Props) {
  const [instructionsOpen, setInstructionsOpen] = useState(false)

  const { nutrition } = recipe

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-4 space-y-3">
      {/* ── 名前・説明 ─────────────────────────── */}
      <div>
        <h3 className="text-base font-bold text-gray-800">{recipe.name}</h3>
        {recipe.description && (
          <p className="text-xs text-gray-500 mt-0.5">{recipe.description}</p>
        )}
      </div>

      {/* ── 調理時間・難易度 ───────────────────── */}
      <div className="flex items-center gap-2 flex-wrap">
        {recipe.cooking_time_minutes && (
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Clock size={12} />
            {recipe.cooking_time_minutes}分
          </span>
        )}
        {recipe.difficulty && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${DIFFICULTY_CLASS[recipe.difficulty] ?? 'bg-gray-100 text-gray-600'}`}>
            {DIFFICULTY_LABEL[recipe.difficulty] ?? recipe.difficulty}
          </span>
        )}
      </div>

      {/* ── タグ ───────────────────────────────── */}
      {recipe.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {recipe.tags.map((tag) => (
            <span key={tag} className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* ── 栄養素サマリー ─────────────────────── */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-green-50 rounded-xl p-2 text-center">
          <p className="text-[10px] text-gray-400">タンパク質</p>
          <p className="text-sm font-bold text-green-600">{nutrition.protein_g}g</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-2 text-center">
          <p className="text-[10px] text-gray-400">塩分</p>
          <p className="text-sm font-bold text-blue-600">{nutrition.sodium_g}g</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-2 text-center">
          <p className="text-[10px] text-gray-400">カロリー</p>
          <p className="text-sm font-bold text-gray-700">{nutrition.calories_kcal}kcal</p>
        </div>
      </div>

      {/* ── 食材リスト ─────────────────────────── */}
      {recipe.ingredients.length > 0 && (
        <ul className="space-y-1">
          {recipe.ingredients.map((ing) => (
            <li key={ing.id} className="flex items-center justify-between text-xs text-gray-600">
              <span>{ing.name}</span>
              <span className="text-gray-400">{ing.amount_g}g</span>
            </li>
          ))}
        </ul>
      )}

      {/* ── 作り方（折りたたみ）─────────────────── */}
      {recipe.instructions.length > 0 && (
        <div className="border-t border-gray-100 pt-2">
          <button
            onClick={() => setInstructionsOpen((v) => !v)}
            className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
          >
            {instructionsOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            作り方
          </button>
          {instructionsOpen && (
            <ol className="mt-2 space-y-1.5 pl-1">
              {recipe.instructions.map((step, i) => (
                <li key={i} className="flex gap-2 text-xs text-gray-600">
                  <span className="flex-shrink-0 w-5 h-5 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-semibold text-[10px]">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}

      {/* ── 選択ボタン ─────────────────────────── */}
      <button
        onClick={() => onSelect(recipe)}
        className="w-full flex items-center justify-center gap-2 text-sm font-semibold
                   text-white bg-green-500 hover:bg-green-600 py-2.5 rounded-xl transition-colors"
      >
        <Check size={14} />
        このレシピで登録する
      </button>
    </div>
  )
}

export default RecipeCandidateCard
