defmodule SourceAcademyAdmin.ProgrammingQuestionController do
  use SourceAcademyAdmin, :controller

  alias SourceAcademy.Assessments

  def update(conn, %{
    "id" => id,
    "programming_question" => params
  }) do
    redirect_to = params["redirect_to"]
    case Assessments.update_programming_question(id, params) do
      {:ok, _} ->
        conn
        |> put_flash(:info, "Programming question updated")
        |> redirect(to: redirect_to)
      {:error, changeset} ->
        conn
        |> put_flash(:error, "Error updating programming question")
        |> assign(:programming_question_changeset, changeset)
        |> redirect(to: redirect_to)
    end
  end
end
