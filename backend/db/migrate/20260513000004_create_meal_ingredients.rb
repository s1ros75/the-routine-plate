class CreateMealIngredients < ActiveRecord::Migration[7.2]
  def change
    create_table :meal_ingredients do |t|
      t.references :meal,       null: false, foreign_key: true
      t.references :ingredient, null: false, foreign_key: true
      t.decimal    :amount_g,   precision: 7, scale: 2, null: false

      t.timestamps
    end

    add_index :meal_ingredients, [:meal_id, :ingredient_id], unique: true
  end
end
