defmodule SourceAcademyAdmin.MCQChoiceController do
  use SourceAcademyAdmin, :controller

  alias SourceAcademy.Assessments

  def create(conn, %{
    "mcq_question_id" => mcq_question_id,
    "mcq_choice" => params
  }) do
    redirect_to = params["redirect_to"]
    case Assessments.create_mcq_choice(params, mcq_question_id) do
      {:ok, _} ->
        conn
        |> put_flash(:info, "MCQ Choice successfully created")
        |> redirect(to: redirect_to)
      {:error, _} ->
        conn
        |> put_flash(:error, "Error creating mcq choice")
        |> redirect(to: redirect_to)
    end
  end

  def delete(conn, %{"id" => id} = params) do
    redirect_to = params["redirect_to"]
    Assessments.delete_mcq_choice(id)
    conn
    |> put_flash(:info, "MCQ choice deleted")
    |> redirect(to: redirect_to)
  end

  def update(conn, %{"id" => id, "mcq_choice" => params}) do
    redirect_to = params["redirect_to"]
    case Assessments.update_mcq_choice(id, params) do
      {:ok, _} ->
        conn
        |> put_flash(:info, "Multiple choice question updated")
        |> redirect(to: redirect_to)
      {:error, changeset} ->
        conn
        |> put_flash(:error, "Error updating multiple choice question")
        |> assign(:mcq_choice_changeset, changeset)
        |> redirect(to: redirect_to)
    end
  end
end
