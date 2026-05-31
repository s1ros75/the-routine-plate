class CreateRecipes < ActiveRecord::Migration[7.2]
  def change
    create_table :recipes do |t|
      t.string  :name,                  null: false
      t.text    :description
      t.integer :meal_type,             null: false
      t.integer :cooking_time_minutes
      t.integer :difficulty,            null: false, default: 1
      t.text    :instructions
      t.string  :tags

      t.timestamps
    end

    add_index :recipes, :meal_type
    add_index :recipes, :difficulty
  end
end
