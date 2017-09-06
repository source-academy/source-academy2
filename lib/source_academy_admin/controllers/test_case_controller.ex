defmodule SourceAcademyAdmin.TestCaseController do
  use SourceAcademyAdmin, :controller

  alias SourceAcademy.Assessments

  def create(conn, %{
    "programming_question_id" => programming_question_id,
    "test_case" => params
  }) do
    redirect_to = params["redirect_to"]
    case Assessments.create_test_case(params, programming_question_id) do
      {:ok, _} ->
        conn
        |> put_flash(:info, "Test Case successfully created")
        |> redirect(to: redirect_to)
      {:error, _} ->
        conn
        |> put_flash(:error, "Error creating test case")
        |> redirect(to: redirect_to)
    end
  end

  def update(conn, %{ "id" => id, "test_case" => params }) do
    redirect_to = params["redirect_to"]
    case Assessments.update_test_case(id, params) do
      {:ok, _} ->
        conn
        |> put_flash(:info, "Test Case successfully updated")
        |> redirect(to: redirect_to)
      {:error, _} ->
        conn
        |> put_flash(:error, "Error creating test case")
        |> redirect(to: redirect_to)
    end
  end

  def delete(conn, %{"id" => id, "redirect_to" => redirect_to}) do
    Assessments.delete_test_case(id)
    conn
    |> put_flash(:info, "Test Case deleted successfully")
    |> redirect(to: redirect_to)
  end
end
