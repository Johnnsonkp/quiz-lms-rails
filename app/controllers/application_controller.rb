class ApplicationController < ActionController::Base
  before_action :authenticate_user!
  before_action :configure_permitted_parameters, if: :devise_controller?
  
  inertia_share flash: -> { flash.to_hash }, current_user: -> { inertia_user }

  private

  def inertia_user
    return nil unless user_signed_in?
    
    {
      id: current_user.id,
      email: current_user.email,
      name: current_user.name
    }
  end

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
    devise_parameter_sanitizer.permit(:account_update, keys: [:name])
  end
end