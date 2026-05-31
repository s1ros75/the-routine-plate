class MealIngredient < ApplicationRecord
  belongs_to :meal
  belongs_to :ingredient

  validates :amount_g, presence: true,
                       numericality: { greater_than: 0, less_than_or_equal_to: 9999.99 }

  validate :no_duplicate_ingredient_in_meal

  private

  def no_duplicate_ingredient_in_meal
    return unless meal && ingredient
    return unless meal.meal_ingredients.where(ingredient: ingredient).where.not(id: id).exists?

    errors.add(:ingredient, "はすでにこの食事に追加されています")
  end
end
