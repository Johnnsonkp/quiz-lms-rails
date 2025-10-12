# QLearn.ai - AI-Powered Learning Management System

A modern learning management system built with Ruby on Rails and React, featuring AI-powered quiz generation, personalized study tracking, and comprehensive analytics.

## 🚀 Features

- **Interactive Quizzes** - Create and take quizzes across various subjects
- **AI-Powered Content** - Automated quiz generation and intelligent feedback
- **Study Tracking** - Monitor study hours and progress with visual analytics
- **Goal Setting** - Set and track daily study goals with progress visualization
- **User Authentication** - Secure user registration and login with Google OAuth
- **Responsive Design** - Modern UI built with React and Tailwind CSS

## 🛠️ Tech Stack

- **Backend:** Ruby on Rails 8.0, PostgreSQL
- **Frontend:** React with TypeScript, Inertia.js
- **Styling:** Tailwind CSS
- **Authentication:** Devise with Google OAuth2
- **Build Tool:** Vite
- **Deployment:** Railway

## 📋 Prerequisites

- Ruby 3.4.5
- Node.js (for React/Vite)
- PostgreSQL
- Redis

## 🏃‍♂️ Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd quiz-lms
   ```

2. **Install dependencies**
   ```bash
   bundle install
   npm install
   ```

3. **Set up the database**
   ```bash
   rails db:create
   rails db:migrate
   rails db:seed
   ```

4. **Start the development servers**
   ```bash
   # Terminal 1: Rails server
   rails server

   # Terminal 2: Vite dev server
   bin/vite dev
   ```

5. **Visit the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔧 Development

This project is in early development. Current focus areas:

- Quiz creation and management
- Study analytics and progress tracking
- AI integration for content generation
- User experience optimization

## 📝 Contributing

This is an early-stage project. Contributions and feedback are welcome as the platform evolves.

## 📄 License

This project is currently in development.
