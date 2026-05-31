class User < ApplicationRecord
  has_secure_password

  has_many :meals, dependent: :destroy

  validates :email, presence: true,
                    uniqueness: { case_sensitive: false },
                    format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :name, presence: true, length: { maximum: 50 }

  before_save { self.email = email.downcase }
end
