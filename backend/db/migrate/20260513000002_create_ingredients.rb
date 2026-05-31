class CreateIngredients < ActiveRecord::Migration[7.2]
  def change
    create_table :ingredients do |t|
      t.string  :name,                 null: false
      t.decimal :protein_per_100g,     precision: 6, scale: 2
      t.decimal :fat_per_100g,         precision: 6, scale: 2
      t.decimal :carbohydrate_per_100g, precision: 6, scale: 2
      t.decimal :sodium_per_100g,      precision: 6, scale: 2
      t.decimal :calories_per_100g,    precision: 7, scale: 2

      t.timestamps
    end

    add_index :ingredients, :name, unique: true
  end
end
