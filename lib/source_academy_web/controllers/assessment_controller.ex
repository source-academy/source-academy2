defmodule SourceAcademyWeb.AssessmentController do
  use SourceAcademyWeb, :controller

  alias SourceAcademy.Assessments
  alias SourceAcademy.Accounts
  alias SourceAcademy.Course

  def attempt(conn, %{"id" => id}) do
    student = conn.assigns.current_student
    case Assessments.attempt_assessment(id, student) do
      {:ok, _} ->
        redirect(conn, to: assessment_path(conn, :briefing, id))
      {:error, _} ->
        conn
        |> put_flash(:error, "Error attempting assessment")
        |> redirect(to: inbox_path(conn, :journal))
    end
  end

  def briefing(conn, %{"id" => id}) do
    assessment = Assessments.get_assessment(id)
    render(conn, "briefing.html", assessment: assessment)
  end

  def question(conn, %{"id" => id, "order" => order, "format" => "json"} = params) do
    current_user = conn.assigns.current_user
    student_id = Map.get(params, "student")
    student =
      if !Accounts.staff?(current_user) || student_id == nil do
        conn.assigns.current_student
      else
        Course.get_student(student_id)
      end
    order = String.to_integer(order)
    workspace = Assessments.prepare_workspace(id, order, student)
    previous_action = if workspace.previous_question != nil do
      assessment_path(conn, :question, id, order - 1, student: student.id)
    else
      assessment_path(conn, :briefing, id)
    end
    next_action = if workspace.next_question != nil do
      assessment_path(conn, :question, id, order + 1, student: student.id)
    else
      assessment_path(conn, :submit, id)
    end
    case workspace.type do
      :programming_question ->
        code = workspace.answer.code
        save_action = if code.is_readonly do
          nil
        else
          api_v1_code_path(conn, :update, code.id)
        end
        render(conn, "question.json",
          type: workspace.type,
          save_action: save_action,
          previous_action: previous_action,
          next_action: next_action,
          question: workspace.question,
          answer: workspace.answer,
          assessment: workspace.assessment,
          student: student,
          comments: workspace.comments)
      _ ->
        render(conn, "question.json", %{
          type: workspace.type,
          previous_action: previous_action,
          next_action: next_action,
          question: workspace.question,
          assessment: workspace.assessment,
          student: student,
        })
    end
  end

  def question(conn, %{"id" => id}) do
    current_user = conn.assigns.current_user
    if Assessments.can_attempt?(id, current_user) do
      {:ok, current_token, _} = Guardian.encode_and_sign(current_user)
      render conn, "workspace.html", current_token: current_token
    else
      conn
      |> put_flash(:error, "Assessment is not open yet!!!")
      |> redirect(to: journal_path(conn, :index))
    end
  end

  def submit(conn, %{"id" => id}) do
    student = conn.assigns.current_student
    case Assessments.submit_assessment(id, student) do
      {:ok, _} ->
        redirect(conn, to: page_path(conn, :game))
      {:error, reason} ->
        conn
        |> put_flash(:error, reason)
        |> redirect(to: assessment_path(conn, :briefing, id))
    end
  end
end
