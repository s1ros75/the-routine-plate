class User < ApplicationRecord
  has_secure_password

  has_many :meals, dependent: :destroy

  validates :email, presence: true,
                    uniqueness: { case_sensitive: false },
                    format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :name, presence: true, length: { maximum: 50 }

  before_save { self.email = email.downcase }

  def self.find_or_create_guest!
    find_or_create_by!(email: 'guest@example.com') do |u|
      u.name     = 'ゲスト'
      u.password = guest_password
    end
  end

  private_class_method def self.guest_password
    ENV.fetch('GUEST_USER_PASSWORD') do
      raise 'GUEST_USER_PASSWORD environment variable must be set in production' if Rails.env.production?
      SecureRandom.hex(16)
    end
  end
end
