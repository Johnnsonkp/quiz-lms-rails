# QLearn.ai SEO & Meta Data Setup Guide

## ✅ What Has Been Implemented

### 1. Enhanced HTML Meta Tags (`app/views/layouts/application.html.erb`)
- **SEO Meta Tags**: Title, description, keywords, author, robots, canonical URL
- **Open Graph (Facebook)**: Complete OG tags for social media sharing
- **Twitter Cards**: Optimized for Twitter sharing with large images
- **PWA Support**: Theme color, app names, mobile web app capabilities
- **Structured Data**: JSON-LD schema for search engines
- **Favicons**: Multiple sizes for different devices and platforms

### 2. SEO Helper System (`app/helpers/seo_helper.rb`)
- **Dynamic Meta Tags**: Page-specific title and description setup
- **Pre-built Tag Sets**: Ready-to-use meta tags for different page types
  - `default_meta_tags` - Homepage and general pages
  - `dashboard_meta_tags` - User dashboard pages
  - `quiz_meta_tags(quiz_title)` - Quiz-specific pages

### 3. Web App Manifest (`app/assets/images/site.webmanifest`)
- **PWA Configuration**: Makes your app installable on mobile devices
- **App Icons**: Multiple sizes for home screen icons
- **Theme Colors**: Consistent branding colors
- **Display Mode**: Standalone app experience

### 4. SEO Files
- **Robots.txt**: Updated with proper crawling instructions
- **Sitemap Configuration**: Ready to generate XML sitemap
- **Gemfile**: Added `sitemap_generator` gem

### 5. Example Implementation
- **Home Page**: Added meta tags to `app/views/template/home.html.erb`

## 🎯 How to Use SEO Meta Tags in Your Views

### Method 1: Use Helper Methods (Recommended)
```erb
<!-- In any view file -->
<% set_meta_tags(default_meta_tags) %>

<!-- For dashboard pages -->
<% set_meta_tags(dashboard_meta_tags) %>

<!-- For quiz pages -->
<% set_meta_tags(quiz_meta_tags("Advanced JavaScript")) %>
```

### Method 2: Custom Meta Tags
```erb
<% set_meta_tags(
  title: "Custom Page Title",
  description: "Custom description for this specific page",
  og_title: "Social Media Title",
  og_description: "Description for social media sharing"
) %>
```

### Method 3: In Controllers
```ruby
class QuizzesController < ApplicationController
  def show
    @quiz = Quiz.find(params[:id])
    set_meta_tags(quiz_meta_tags(@quiz.subject))
  end
end
```

## 📸 Required Images (CRITICAL - MUST CREATE)

### Create these images in `app/assets/images/`:

1. **qlearn-social-share.png** (1200x630px)
   - Main social media sharing image
   - Used for Facebook, Twitter, LinkedIn previews
   - Should showcase your app's value proposition

2. **favicon-16x16.png** (16x16px)
3. **favicon-32x32.png** (32x32px)
4. **apple-touch-icon.png** (180x180px)

### Design Guidelines for Social Share Image:
- **Background**: Professional, clean design
- **Logo**: QLearn.ai branding prominently displayed
- **Text**: "AI-Powered Learning Platform" or similar tagline
- **Features**: Show dashboard, analytics, or quiz interface
- **Colors**: Use theme color #3B82F6 (blue) for consistency

## 🚀 Next Steps to Complete Setup

### 1. Install New Gem
```bash
bundle install
```

### 2. Generate Sitemap
```bash
bundle exec rake sitemap:refresh
```

### 3. Create Missing Images
- Use tools like Canva, Figma, or Favicon.io
- Follow the specifications in `/app/assets/images/README.md`

### 4. Update Production Configuration
In `config/environments/production.rb`, add:
```ruby
# Force SSL for better SEO
config.force_ssl = true

# Asset host for CDN (if using one)
# config.asset_host = "https://your-cdn-domain.com"
```

### 5. Add Meta Tags to Your Views
Add appropriate meta tags to all your public-facing pages:
- Landing pages
- Authentication pages  
- Any quiz or subject listing pages (if public)

## 🔧 Advanced Optimizations

### 1. Google Analytics (Optional)
Add to `app/views/layouts/application.html.erb` before `</head>`:
```erb
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

### 2. Performance Optimization
```ruby
# In config/environments/production.rb
config.public_file_server.headers = {
  'Cache-Control' => 'public, max-age=31536000',
  'Expires' => 1.year.from_now.to_formatted_s(:rfc822)
}
```

### 3. SSL and Security Headers
```ruby
# In config/application.rb
config.force_ssl = true
config.ssl_options = { redirect: { exclude: -> request { request.path =~ /health/ } } }
```

## ✅ Verification Checklist

- [ ] All required images created and placed in `app/assets/images/`
- [ ] Bundle install completed successfully
- [ ] Sitemap generated (`bundle exec rake sitemap:refresh`)
- [ ] Meta tags added to key public pages
- [ ] Test social media sharing with Facebook Sharing Debugger
- [ ] Test Twitter sharing with Twitter Card Validator
- [ ] Verify mobile PWA installation works
- [ ] Check robots.txt is accessible at `/robots.txt`
- [ ] Verify sitemap is accessible at `/sitemap.xml`

## 🌐 Production Domain Update

When you deploy to production with a custom domain:

1. Update `config/sitemap.rb`:
```ruby
SitemapGenerator::Sitemap.default_host = "https://yourcompany.com"
```

2. Update `public/robots.txt`:
```
Sitemap: https://yourcompany.com/sitemap.xml
```

3. Update `config/application.rb`:
```ruby
config.hosts << "yourcompany.com"
config.hosts << "www.yourcompany.com"
```

## 📊 Testing Tools

- **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **Google Rich Results Test**: https://search.google.com/test/rich-results
- **Lighthouse**: Built into Chrome DevTools for performance and SEO audit

Your QLearn.ai platform is now optimized for professional web presence, search engines, and social media sharing!