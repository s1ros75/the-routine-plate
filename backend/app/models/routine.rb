class Routine < ApplicationRecord
  belongs_to :user
  belongs_to :meal

  # day_of_week は Ruby の Date#wday に合わせる (0=日曜 〜 6=土曜)
  enum :day_of_week, {
    sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
    thursday: 4, friday: 5, saturday: 6
  }
  enum :meal_type, { breakfast: 0, lunch: 1, dinner: 2, snack: 3 }

  validates :day_of_week, presence: true
  validates :meal_type,   presence: true
  validates :user_id, uniqueness: {
    scope: [:day_of_week, :meal_type],
    message: "同じ曜日・食事区分のルーティンが既に存在します"
  }

  # 指定した週の日付ごとにルーティンを割り当てて返す
  #
  # @param user       [User]
  # @param week_start [Date] 週の起点日 (デフォルト: 今週の日曜)
  # @return [Hash{Date => Array<Routine>}]
  #
  # 使用例:
  #   Routine.schedule_for_week(current_user)
  #   # => { Sun => [<Routine breakfast>, ...], Mon => [...], ... }
  def self.schedule_for_week(user, week_start = Date.current.beginning_of_week(:sunday))
    routines_by_day = where(user:).includes(:meal).group_by(&:day_of_week)

    (0..6).each_with_object({}) do |offset, schedule|
      date    = week_start + offset
      day_key = day_of_weeks.key(date.wday)   # wday (Integer) → enum key (String)
      schedule[date] = routines_by_day.fetch(day_key, [])
    end
  end
end
