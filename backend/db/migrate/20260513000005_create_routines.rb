class CreateRoutines < ActiveRecord::Migration[7.2]
  def change
    create_table :routines do |t|
      t.references :user, null: false, foreign_key: true
      t.references :meal, null: false, foreign_key: true
      t.integer    :day_of_week, null: false
      t.integer    :meal_type,   null: false

      t.timestamps
    end

    # 同一ユーザーの同曜日・同食事区分の重複を DB レベルでも防ぐ
    add_index :routines, [:user_id, :day_of_week, :meal_type], unique: true
  end
end
