module Api
  module V1
    class RecipesController < ApplicationController
      before_action :set_recipe, only: [:show]

      # GET /api/v1/recipes
      def index
        recipes = Recipe.includes(recipe_ingredients: :ingredient)
        render json: recipes.map(&:as_api_hash)
      end

      # GET /api/v1/recipes/:id
      def show
        render json: @recipe.as_api_hash
      end

      # POST /api/v1/recipes/search
      def search
        ids = Array(params[:ingredient_ids]).map(&:to_i).reject(&:zero?)

        if ids.empty?
          render json: { error: "ingredient_ids は1件以上指定してください" }, status: :bad_request
          return
        end

        matched_ids = Recipe
          .joins(:recipe_ingredients)
          .where(recipe_ingredients: { ingredient_id: ids })
          .group("recipes.id")
          .having("COUNT(DISTINCT recipe_ingredients.ingredient_id) = ?", ids.size)
          .pluck(:id)

        recipes = Recipe.includes(recipe_ingredients: :ingredient).where(id: matched_ids)

        render json: {
          matched_recipes: recipes.map(&:as_api_hash),
          count: recipes.size
        }
      end

      private

      def set_recipe
        @recipe = Recipe.includes(recipe_ingredients: :ingredient).find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Recipe id=#{params[:id]} が見つかりません" }, status: :not_found
      end
    end
  end
end
