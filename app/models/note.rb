class Note < ApplicationRecord
  belongs_to :user, optional: true  # Allow anonymous notes
  has_many :quizzes, dependent: :destroy
  
  # Active Storage attachments
  has_one_attached :pdf_file
  has_many_attached :extracted_images
  
  # Scopes for filtering notes
  scope :for_user, ->(user) { where(user: user) }
  scope :anonymous, -> { where(user: nil) }
  
  # Validations
  validates :title, presence: true
  validates :pdf_file, presence: true, on: :create
  
  # Validate file type
  validate :acceptable_pdf_file
  
  private
  
  def acceptable_pdf_file
    return unless pdf_file.attached?
    
    unless pdf_file.blob.content_type.start_with?('application/pdf')
      errors.add(:pdf_file, 'must be a PDF file')
    end
    
    if pdf_file.blob.byte_size > 10.megabytes
      errors.add(:pdf_file, 'must be less than 10MB')
    end
  end
end
