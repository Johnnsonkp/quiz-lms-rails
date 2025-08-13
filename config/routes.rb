Rails.application.routes.draw do
  root to: 'template#home'
  get 'inertia-example', to: 'inertia_example#index'

  # dashboard routes
  get 'dashboard', to: 'dashboard#index'
  get 'dashboard/:topic', to: 'dashboard#show'
  post 'dashboard/file_upload', to: 'dashboard#file_upload_extract'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end
