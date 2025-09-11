Rails.application.routes.draw do
  # get "errors/not_found"
  # get "errors/internal_server_error"

  match "/404", to: "errors#not_found", via: :all
  match "/500", to: "errors#internal_server_error", via: :all

  root to: 'template#home'

  devise_for :users, controllers: {
    omniauth_callbacks: 'users/omniauth_callbacks'
  }

  get 'inertia-example', to: 'inertia_example#index'
  get '/login', to: 'template#login'
  get '/signup', to: 'template#signup'
  get '/get', to: 'template#signup'

  # dashboard routes
  get 'dashboard', to: 'dashboard#index'
  get 'dashboard/:topic/get', to: 'dashboard#get_topic_quizzes'
  get 'dashboard/:topic', to: 'dashboard#page_refresh'
  # get 'dashboard/:topic/:subject/:quiz_ids', to: 'dashboard#show'

  patch 'dashboard/update_quiz', to: 'dashboard#update'
  
  delete 'dashboard/delete_quiz', to: 'dashboard#delete'

  get 'dashboard/:topic/:subject/:quiz_ids', to: 'dashboard#show'

  post 'dashboard/file_upload', to: 'dashboard#file_upload_extract'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end
