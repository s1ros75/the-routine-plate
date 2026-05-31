class Recipe < ApplicationRecord
  has_many :recipe_ingredients, dependent: :destroy
  has_many :ingredients, through: :recipe_ingredients

  enum :meal_type,  { breakfast: 0, lunch: 1, dinner: 2, snack: 3 }
  enum :difficulty, { easy: 1, normal: 2, hard: 3 }

  validates :name,       presence: true, length: { maximum: 100 }
  validates :meal_type,  presence: true
  validates :difficulty, presence: true

  def nutrition_totals
    NutritionCalculator.for_recipe(self).call
  end

  def ingredient_ids_set
    ingredient_ids.to_set
  end

  def as_api_hash
    nutrition = NutritionCalculator.for_recipe(self).call
    {
      id:                   id,
      name:                 name,
      description:          description,
      meal_type:            meal_type,
      cooking_time_minutes: cooking_time_minutes,
      difficulty:           difficulty,
      instructions:         instructions&.split("\n") || [],
      tags:                 tags&.split(",") || [],
      ingredients:          recipe_ingredients.map do |ri|
        { id: ri.ingredient_id, name: ri.ingredient.name, amount_g: ri.amount_g.to_f }
      end,
      nutrition:            nutrition.to_h
    }
  end
end
