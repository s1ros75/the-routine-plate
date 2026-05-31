class NutritionCalculator
  # 計算結果の値オブジェクト
  Result = Data.define(:protein_g, :fat_g, :carbohydrate_g, :sodium_g, :calories_kcal) do
    def to_h
      { protein_g:, fat_g:, carbohydrate_g:, sodium_g:, calories_kcal: }
    end
  end

  class IngredientNotFoundError < StandardError
    def initialize(id)
      super("Ingredient id=#{id} が見つかりません")
    end
  end

  # 保存済み Meal から計算するファクトリメソッド
  def self.for_meal(meal)
    entries = meal.meal_ingredients.includes(:ingredient).map do |mi|
      build_entry(mi.ingredient, mi.amount_g.to_f)
    end
    new(entries)
  end

  # 保存済み Recipe から計算するファクトリメソッド
  def self.for_recipe(recipe)
    entries = recipe.recipe_ingredients.includes(:ingredient).map do |ri|
      build_entry(ri.ingredient, ri.amount_g.to_f)
    end
    new(entries)
  end

  # APIリクエストのパラメータから計算するファクトリメソッド
  # @param raw_params [Array<Hash>] [{ ingredient_id: 1, amount_g: 150 }, ...]
  def self.from_params(raw_params)
    raise ArgumentError, "ingredients は1件以上指定してください" if raw_params.blank?

    entries = raw_params.map do |p|
      id         = p[:ingredient_id].to_i
      ingredient = Ingredient.find_by(id:)
      raise IngredientNotFoundError.new(id) unless ingredient

      amount = p[:amount_g].to_f
      raise ArgumentError, "amount_g は 0 より大きい値を指定してください (ingredient_id=#{id})" unless amount.positive?

      build_entry(ingredient, amount)
    end
    new(entries)
  end

  def call
    totals = @entries.each_with_object(zero_totals) do |entry, acc|
      ratio = entry[:amount_g] / 100.0
      ing   = entry[:ingredient]
      acc[:protein_g]      += (ing.protein_per_100g      || 0) * ratio
      acc[:fat_g]          += (ing.fat_per_100g          || 0) * ratio
      acc[:carbohydrate_g] += (ing.carbohydrate_per_100g || 0) * ratio
      acc[:sodium_g]       += (ing.sodium_per_100g       || 0) * ratio
      acc[:calories_kcal]  += (ing.calories_per_100g     || 0) * ratio
    end

    Result.new(**totals.transform_values { _1.round(2) })
  end

  private

  def initialize(entries)
    @entries = entries
  end

  def self.build_entry(ingredient, amount_g) = { ingredient:, amount_g: }
  private_class_method :build_entry

  def zero_totals
    { protein_g: 0.0, fat_g: 0.0, carbohydrate_g: 0.0, sodium_g: 0.0, calories_kcal: 0.0 }
  end
end
