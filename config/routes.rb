Rails.application.routes.draw do
  root to: 'template#home'
  get 'inertia-example', to: 'inertia_example#index'
  get 'dashboard', to: 'dashboard#index'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end
