class TemplateController < ApplicationController
  skip_before_action :authenticate_user!, only: [:home, :login, :signup]
  
  before_action :set_devise_variables, only: [:login, :signup]
  
  def home
  end

  def login
  end

  def signup
  end

  private

  def set_devise_variables
    @resource = User.new
    @resource_name = :user
    @devise_mapping = Devise.mappings[:user]
  end

  def resource
    @resource ||= User.new
  end

  def resource_name
    :user
  end

  def devise_mapping
    @devise_mapping ||= Devise.mappings[:user]
  end

  # Make these methods available in views
  helper_method :resource, :resource_name, :devise_mapping
end
