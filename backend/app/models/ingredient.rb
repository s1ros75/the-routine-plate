class Ingredient < ApplicationRecord
  has_many :meal_ingredients, dependent: :destroy
  has_many :meals, through: :meal_ingredients

  NUTRIENT_COLUMNS = %i[
    protein_per_100g
    fat_per_100g
    carbohydrate_per_100g
    sodium_per_100g
    calories_per_100g
  ].freeze

  validates :name, presence: true, uniqueness: true, length: { maximum: 100 }
  validates(*NUTRIENT_COLUMNS, numericality: { greater_than_or_equal_to: 0, allow_nil: true })
end
