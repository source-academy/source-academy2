defmodule SourceAcademyAdmin.QuestionController do
  use SourceAcademyAdmin, :controller

  alias SourceAcademy.Assessments
  alias SourceAcademyAdmin.AssessmentView

  def create(conn, %{"assessment_id" => assessment_id, "question" => params}) do
    type = Map.get(params, "question_type")
    case Assessments.create_question(params, type, assessment_id) do
      {:ok, _} ->
        conn
        |> put_flash(:info, "Question Added Successfully")
        |> redirect(to: admin_assessment_path(conn, :show, assessment_id))
      {:error, changeset} ->
        conn
        |> put_flash(:error, "Error Adding Question")
        |> assign(:question_changeset, changeset)
        |> redirect(to: admin_assessment_path(conn, :show, assessment_id))
    end
  end

  def edit(conn, %{"assessment_id" => assessment_id, "id" => id} = params) do
    tab = params["tab"] || "Content"
    question = Assessments.get_question(id)
    assessment = Assessments.get_assessment(assessment_id)
    changeset = Assessments.change_question(question, %{})
    extra_params = if question.programming_question != nil do
      programming_question = question.programming_question
      programming_question_changeset =
        Assessments.change_programming_question(programming_question, %{})
      test_case_changeset = Assessments.build_test_case(%{})
      test_case_changesets = Enum.map(
        programming_question.test_cases,
        &(Assessments.change_test_case(&1, %{})))
      %{
        test_case_changesets: test_case_changesets,
        test_case_changeset: test_case_changeset,
        programming_question: programming_question,
        programming_question_changeset: programming_question_changeset
      }
    else
      mcq_question = question.mcq_question
      mcq_question_changeset =
        Assessments.change_mcq_question(question.mcq_question, %{})
      mcq_choice_changesets = mcq_question.choices
        |> Enum.map(&(Assessments.change_mcq_choice(&1, %{})))
      mcq_choice_changeset = Assessments.build_mcq_choice(%{})
      %{
        mcq_question: question.mcq_question,
        mcq_question_changeset: mcq_question_changeset,
        mcq_choice_changeset: mcq_choice_changeset,
        mcq_choice_changesets: mcq_choice_changesets
      }
    end
    params = Map.merge(%{
      tab: tab,
      assessment: assessment,
      question: question,
      changeset: changeset
    }, extra_params)
    render conn, AssessmentView, "question/edit.html", params
  end

  def update(conn, params) do
    assessment_id = params["assessment_id"]
    redirect_to = params["question"]["redirect_to"]
      || admin_assessment_path(conn, :show, assessment_id)
    case Assessments.update_question(params["id"], params["question"]) do
      {:ok, _} ->
        conn
        |> put_flash(:info, "Question Updated Successfully")
        |> redirect(to: redirect_to)
      {:error, changeset} ->
        conn
        |> put_flash(:error, "Error Updating Question")
        |> assign(:changeset, changeset)
        |> redirect(to: redirect_to)
    end
  end

  def delete(conn, %{"assessment_id" => assessment_id, "id" => id}) do
    Assessments.delete_question(id)
    conn
    |> put_flash(:info, "Question successfully deleted")
    |> redirect(to: admin_assessment_path(conn, :show, assessment_id))
  end
end
