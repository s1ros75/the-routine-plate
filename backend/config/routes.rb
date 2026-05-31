Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      resources :meals, only: %i[index show create update destroy] do
        member do
          get :nutrition   # GET  /api/v1/meals/:id/nutrition  — 保存済みMealの栄養素計算
        end
        collection do
          post :calculate        # POST /api/v1/meals/calculate        — 食材リスト指定で即時計算
          get  :weekly_summary   # GET  /api/v1/meals/weekly_summary   — 週間集計
        end
      end

      resources :ingredients, only: %i[index show create update destroy]
      resources :routines,    only: %i[index show create update destroy]
      resources :recipes, only: %i[index show] do
        collection do
          post :search
        end
      end
    end
  end
end
