module Api
  module V1
    class MealsController < ApplicationController
      before_action :set_meal, only: [:nutrition]

      # GET /api/v1/meals
      def index
        meals = guest_user.meals
                          .includes(meal_ingredients: :ingredient)
                          .order(:scheduled_at)
        render json: meals.map { |m| meal_json(m) }
      end

      # POST /api/v1/meals
      def create
        result = MealCreatorService.new(user: guest_user, meal_params: meal_params).call
        render json: meal_json(result.meal, result.nutrition), status: :created
      rescue ActiveRecord::RecordInvalid => e
        render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
      rescue ArgumentError => e
        render json: { error: e.message }, status: :unprocessable_entity
      end

      # POST /api/v1/meals/calculate
      def calculate
        raw    = params.require(:ingredients)
        result = NutritionCalculator.from_params(raw).call
        render json: { nutrition: result.to_h }
      rescue NutritionCalculator::IngredientNotFoundError => e
        render json: { error: e.message }, status: :not_found
      rescue ArgumentError => e
        render json: { error: e.message }, status: :unprocessable_entity
      rescue ActionController::ParameterMissing => e
        render json: { error: "パラメータが不正です: #{e.message}" }, status: :bad_request
      end

      # GET /api/v1/meals/weekly_summary
      def weekly_summary
        week_start = if params[:week_start].present?
                       Date.parse(params[:week_start])
                     else
                       Date.today.beginning_of_week(:monday)
                     end
        week_end = week_start + 6.days

        meals = guest_user.meals
                          .includes(meal_ingredients: :ingredient)
                          .where(scheduled_at: week_start.beginning_of_day..week_end.end_of_day)

        nutrition_cache = meals.each_with_object({}) do |meal, h|
          h[meal.id] = NutritionCalculator.for_meal(meal).call
        end

        day_labels = %w[月 火 水 木 金 土 日]
        daily_breakdown = (0..6).map do |i|
          date      = week_start + i.days
          day_meals = meals.select { |m| m.scheduled_at.to_date == date }

          meals_by_type = { breakfast: nil, lunch: nil, dinner: nil }
          day_meals.each do |meal|
            type = meal.meal_type.to_sym
            next unless meals_by_type.key?(type)
            n = nutrition_cache[meal.id]
            meals_by_type[type] = {
              id:            meal.id,
              name:          meal.name,
              protein_g:     n.protein_g.to_f.round(2),
              sodium_g:      n.sodium_g.to_f.round(2),
              calories_kcal: n.calories_kcal.to_f.round(1),
            }
          end

          total_protein    = day_meals.sum { |m| nutrition_cache[m.id].protein_g.to_f }
          total_sodium     = day_meals.sum { |m| nutrition_cache[m.id].sodium_g.to_f }
          total_calories   = day_meals.sum { |m| nutrition_cache[m.id].calories_kcal.to_f }

          {
            date:                date.to_s,
            day_label:           day_labels[i],
            is_today:            date == Date.today,
            meals:               meals_by_type,
            total_protein_g:     total_protein.round(2),
            total_sodium_g:      total_sodium.round(2),
            total_calories_kcal: total_calories.round(1),
          }
        end

        total_protein  = daily_breakdown.sum { |d| d[:total_protein_g] }
        total_sodium   = daily_breakdown.sum { |d| d[:total_sodium_g] }
        total_calories = daily_breakdown.sum { |d| d[:total_calories_kcal] }

        render json: {
          week_start:           week_start.to_s,
          week_end:             week_end.to_s,
          total_protein_g:      total_protein.round(2),
          total_sodium_g:       total_sodium.round(2),
          total_calories_kcal:  total_calories.round(1),
          meals_count:          meals.count,
          daily_breakdown:      daily_breakdown,
          targets: {
            weekly_protein_g:   455,
            daily_protein_g:    65,
            daily_sodium_g_max: 7.5,
          }
        }
      end

      # GET /api/v1/meals/:id/nutrition
      def nutrition
        result = NutritionCalculator.for_meal(@meal).call
        render json: {
          meal_id:   @meal.id,
          meal_name: @meal.name,
          nutrition: result.to_h
        }
      end

      private

      def guest_user
        @guest_user ||= User.find_or_create_by!(email: 'guest@example.com') do |u|
          u.name     = 'ゲスト'
          u.password = 'password123'
        end
      end

      def meal_params
        params.require(:meal).permit(
          :name, :meal_type, :scheduled_at, :memo,
          ingredients: [:ingredient_id, :amount_g]
        )
      end

      def meal_json(meal, nutrition = nil)
        nutrition ||= NutritionCalculator.for_meal(meal).call
        {
          id:            meal.id,
          name:          meal.name,
          meal_type:     meal.meal_type,
          scheduled_at:  meal.scheduled_at,
          protein_g:     nutrition.protein_g,
          sodium_g:      nutrition.sodium_g,
          calories_kcal: nutrition.calories_kcal,
        }
      end

      def set_meal
        @meal = Meal.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Meal id=#{params[:id]} が見つかりません" }, status: :not_found
      end
    end
  end
end
