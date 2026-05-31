class CreateMeals < ActiveRecord::Migration[7.2]
  def change
    create_table :meals do |t|
      t.references :user,         null: false, foreign_key: true
      t.string     :name,         null: false
      t.integer    :meal_type,    null: false, default: 0
      t.datetime   :scheduled_at, null: false
      t.text       :memo

      t.timestamps
    end

    add_index :meals, [:user_id, :scheduled_at]
  end
end
