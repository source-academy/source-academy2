defmodule SourceAcademyApi.PathController do
  use SourceAcademyApi, :controller

  alias SourceAcademy.Assessments

  def submit_mcq(conn, %{"id" => id}) do
    student = conn.assigns.current_student
    result = Assessments.submit_mcq_choice(id, student)
    json(conn, %{
      id: id,
      is_correct: result.is_correct,
      hint: result.hint
    })
  end

  def submit_code(conn, %{"question_id" => question_id, "code" => code}) do
    student = conn.assigns.current_student
    case Assessments.submit_code(question_id, code, student) do
      {:ok, response} -> json(conn, response)
      {:error, message} -> json(conn, %{ error: message })
    end
  end
end
