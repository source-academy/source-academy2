defmodule SourceAcademyAdmin.MCQQuestionController do
  use SourceAcademyAdmin, :controller

  alias SourceAcademy.Assessments

  def update(conn, %{
    "id" => id,
    "mcq_question" => params
  }) do
    redirect_to = params["redirect_to"]
    case Assessments.update_mcq_question(id, params) do
      {:ok, _} ->
        conn
        |> put_flash(:info, "Multiple choice question updated")
        |> redirect(to: redirect_to)
      {:error, changeset} ->
        conn
        |> put_flash(:error, "Error updating multiple choice question")
        |> assign(:mcq_question_changeset, changeset)
        |> redirect(to: redirect_to)
    end
  end
end
