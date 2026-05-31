module Api
  module V1
    class IngredientsController < ApplicationController
      def index
        ingredients = Ingredient.order(:name)
        render json: ingredients
      end

      def show
        ingredient = Ingredient.find(params[:id])
        render json: ingredient
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Ingredient id=#{params[:id]} が見つかりません" }, status: :not_found
      end

      def create
        ingredient = Ingredient.new(ingredient_params)
        if ingredient.save
          render json: ingredient, status: :created
        else
          render json: { errors: ingredient.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def ingredient_params
        params.require(:ingredient).permit(
          :name,
          :protein_per_100g,
          :fat_per_100g,
          :carbohydrate_per_100g,
          :sodium_per_100g,
          :calories_per_100g
        )
      end
    end
  end
end
