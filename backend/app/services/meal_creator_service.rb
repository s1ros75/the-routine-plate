class MealCreatorService
  Result = Data.define(:meal, :nutrition)

  def initialize(user:, meal_params:)
    @user         = user
    @name         = meal_params[:name]
    @meal_type    = meal_params[:meal_type]
    @scheduled_at = meal_params[:scheduled_at]
    @memo         = meal_params[:memo]
    @ingredients  = Array(meal_params[:ingredients])
  end

  def call
    meal = nil
    ActiveRecord::Base.transaction do
      meal = @user.meals.create!(
        name:         @name,
        meal_type:    @meal_type,
        scheduled_at: @scheduled_at,
        memo:         @memo
      )
      @ingredients.each do |ing|
        meal.meal_ingredients.create!(
          ingredient_id: ing[:ingredient_id].to_i,
          amount_g:      ing[:amount_g].to_f
        )
      end
    end
    nutrition = NutritionCalculator.for_meal(meal.reload).call
    Result.new(meal:, nutrition:)
  end
end
