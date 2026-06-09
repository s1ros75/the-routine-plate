import { useEffect } from 'react'
import { ChefHat, ArrowLeft, Loader2, RefreshCw } from 'lucide-react'
import { useRecipeSearch } from '../../hooks/useRecipeSearch'
import RecipeCandidateCard from './RecipeCandidateCard'
import type { Recipe } from '@/types'

type Props = {
  ingredientIds: number[]
  onSelectRecipe: (recipe: Recipe) => void
  onBack: () => void
}

function RecipeSuggestionsList({ ingredientIds, onSelectRecipe, onBack }: Props) {
  const { loading, error, matchedRecipes, searchRecipes } = useRecipeSearch()

  useEffect(() => {
    searchRecipes(ingredientIds)
  }, [searchRecipes, ingredientIds])

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
        <div className="flex items-center gap-1.5">
          <ChefHat size={16} className="text-green-500" />
          <h3 className="text-sm font-bold text-gray-800">
            選んだ{ingredientIds.length}個の食材を全部含むレシピ
          </h3>
        </div>
      </div>

      {/* ── ローディング ──────────────────────── */}
      {loading && (
        <div className="flex flex-col items-center gap-3 py-10">
          <Loader2 size={24} className="animate-spin text-green-500" />
          <p className="text-sm text-gray-500">レシピを検索中...</p>
        </div>
      )}

      {/* ── エラー ───────────────────────────── */}
      {!loading && !!error && (
        <div className="flex flex-col items-center gap-3 py-8">
          <p className="text-sm text-red-500">レシピの取得に失敗しました</p>
          <button
            onClick={() => searchRecipes(ingredientIds)}
            className="flex items-center gap-1.5 text-sm font-medium text-white
                       bg-green-500 hover:bg-green-600 px-4 py-2 rounded-xl transition-colors"
          >
            <RefreshCw size={14} />
            再試行
          </button>
        </div>
      )}

      {/* ── 該当なし ─────────────────────────── */}
      {!loading && !error && matchedRecipes.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-8">
          <p className="text-sm text-gray-500">該当するレシピが見つかりませんでした</p>
          <button
            onClick={onBack}
            className="text-sm font-medium text-green-600 hover:text-green-700 underline"
          >
            食材を減らして再検索
          </button>
        </div>
      )}

      {/* ── レシピ一覧 ───────────────────────── */}
      {!loading && !error && matchedRecipes.length > 0 && (
        <div className="space-y-3">
          {matchedRecipes.map(recipe => (
            <RecipeCandidateCard key={recipe.id} recipe={recipe} onSelect={onSelectRecipe} />
          ))}
        </div>
      )}
    </div>
  )
}

export default RecipeSuggestionsList
