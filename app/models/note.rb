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
  
  # Key concepts methods - handle JSON manually
  def key_concepts_hash
    return {} if key_concepts.blank?
    
    if key_concepts.is_a?(String)
      JSON.parse(key_concepts) rescue {}
    elsif key_concepts.is_a?(Hash)
      key_concepts
    else
      {}
    end
  end
  
  def key_concepts=(value)
    if value.is_a?(Hash)
      super(value.to_json)
    elsif value.is_a?(String)
      super(value)
    else
      super(nil)
    end
  end
  
  def add_key_concept(concept, definition)
    current_concepts = key_concepts_hash
    current_concepts[concept] = definition
    self.key_concepts = current_concepts
    save
  end
  
  def remove_key_concept(concept)
    current_concepts = key_concepts_hash
    current_concepts.delete(concept)
    self.key_concepts = current_concepts
    save
  end
  
  def has_key_concepts?
    key_concepts_hash.any?
  end
  
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
