module SeoHelper
  def set_meta_tags(options = {})
    content_for :title, options[:title] if options[:title]
    content_for :description, options[:description] if options[:description]
    content_for :og_title, options[:og_title] || options[:title] if options[:og_title] || options[:title]
    content_for :og_description, options[:og_description] || options[:description] if options[:og_description] || options[:description]
    content_for :twitter_title, options[:twitter_title] || options[:title] if options[:twitter_title] || options[:title]
    content_for :twitter_description, options[:twitter_description] || options[:description] if options[:twitter_description] || options[:description]
  end

  def default_meta_tags
    {
      title: "QLearn.ai - AI-Powered Quiz Learning Management System",
      description: "Transform your learning experience with QLearn.ai - an advanced AI-powered quiz platform featuring personalized study tracking, goal setting, and comprehensive analytics. Perfect for students, educators, and professionals.",
      keywords: "quiz platform, learning management system, AI education, study tracker, online quizzes, educational technology, personalized learning, student analytics, study goals, e-learning",
      og_title: "QLearn.ai - AI-Powered Quiz Learning Management System",
      og_description: "Transform your learning with AI-powered quizzes, study tracking, and personalized analytics. Join thousands of learners improving their knowledge with QLearn.ai.",
      twitter_title: "QLearn.ai - AI-Powered Quiz Learning Management System",
      twitter_description: "Transform your learning with AI-powered quizzes, study tracking, and personalized analytics."
    }
  end

  def dashboard_meta_tags
    {
      title: "Dashboard",
      description: "Access your personalized learning dashboard with quiz analytics, study progress tracking, and goal management on QLearn.ai.",
      og_title: "QLearn.ai Dashboard - Track Your Learning Progress",
      og_description: "Monitor your quiz performance, study hours, and learning goals with comprehensive analytics and insights.",
      twitter_title: "QLearn.ai Dashboard - Track Your Learning Progress",
      twitter_description: "Monitor your quiz performance, study hours, and learning goals with comprehensive analytics."
    }
  end

  def quiz_meta_tags(quiz_title = nil)
    {
      title: quiz_title ? "#{quiz_title} Quiz" : "Interactive Quizzes",
      description: quiz_title ? "Take the #{quiz_title} quiz on QLearn.ai and test your knowledge with AI-powered feedback and detailed analytics." : "Discover interactive quizzes across various subjects with AI-powered feedback and personalized learning insights.",
      og_title: quiz_title ? "#{quiz_title} Quiz - QLearn.ai" : "Interactive Quizzes - QLearn.ai",
      og_description: quiz_title ? "Challenge yourself with the #{quiz_title} quiz and get instant AI-powered feedback." : "Explore interactive quizzes with AI-powered feedback and analytics.",
      twitter_title: quiz_title ? "#{quiz_title} Quiz - QLearn.ai" : "Interactive Quizzes - QLearn.ai",
      twitter_description: quiz_title ? "Take the #{quiz_title} quiz with AI-powered feedback." : "Interactive quizzes with AI-powered feedback."
    }
  end
end