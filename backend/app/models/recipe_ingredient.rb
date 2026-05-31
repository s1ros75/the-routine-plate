class RecipeIngredient < ApplicationRecord
  belongs_to :recipe
  belongs_to :ingredient

  validates :amount_g, presence: true,
                       numericality: { greater_than: 0, less_than_or_equal_to: 9999.99 }
end
