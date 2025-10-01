class NotesController < ApplicationController
  def index
  end

  def show
  end

  def new
  end

  def create
    if params[:note].present?
      @note = current_user.notes.build(note_params)
      if @note.save
        redirect_to @note, notice: 'Note was successfully created.'
      else
        render :new
      end
    else
      render :new, alert: 'No file selected.'
    end
  end

  def edit
  end

  def update
  end

  def destroy
  end
end
