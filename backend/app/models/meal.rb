class Meal < ApplicationRecord
  belongs_to :user
  has_many :meal_ingredients, dependent: :destroy
  has_many :ingredients, through: :meal_ingredients

  enum :meal_type, { breakfast: 0, lunch: 1, dinner: 2, snack: 3 }

  validates :name, presence: true, length: { maximum: 100 }
  validates :meal_type, presence: true
  validates :scheduled_at, presence: true

  def nutrition_totals
    NutritionCalculator.for_meal(self).call
  end
end
