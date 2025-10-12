# config/sitemap.rb
SitemapGenerator::Sitemap.default_host = "https://quiz-lms-rails-production.up.railway.app"
SitemapGenerator::Sitemap.sitemaps_path = 'sitemaps/'

SitemapGenerator::Sitemap.create do
  # Home page
  add root_path, priority: 1.0, changefreq: 'weekly'
  
  # Static pages
  add '/about', priority: 0.7, changefreq: 'monthly' if defined?(about_path)
  add '/features', priority: 0.7, changefreq: 'monthly' if defined?(features_path)
  add '/pricing', priority: 0.7, changefreq: 'monthly' if defined?(pricing_path)
  add '/contact', priority: 0.6, changefreq: 'monthly' if defined?(contact_path)
  
  # Authentication pages (public)
  add new_user_session_path, priority: 0.8, changefreq: 'monthly'
  add new_user_registration_path, priority: 0.8, changefreq: 'monthly'
  
  # Quiz categories or subjects (if publicly accessible)
  begin
    Quiz.distinct.pluck(:subject).compact.each do |subject|
      add "/quizzes/subject/#{subject.parameterize}", priority: 0.6, changefreq: 'weekly'
    end
  rescue
    # Handle case where Quiz model might not be available during deployment
  end
  
  # Add other public content as needed
  # Note: Don't add dashboard or user-specific pages as they require authentication
end