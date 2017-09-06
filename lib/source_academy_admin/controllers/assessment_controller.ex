defmodule SourceAcademyAdmin.AssessmentController do
  use SourceAcademyAdmin, :controller

  alias SourceAcademy.Assessments

  @tabs_map %{
    "Missions" => :mission,
    "Sidequests" => :sidequest,
    "Paths" => :path,
    "Contests" => :contest,
  }

  def index(conn, params) do
    active_tab = Map.get(params, "tab", "Missions")
    tab_keys = @tabs_map
      |> Map.to_list
      |> Enum.map(fn {key, _} -> key end)
    type = Map.get(@tabs_map, active_tab)
    assessments = Assessments.all_assessments(type)
    render(conn, "index.html",
      active_tab: active_tab,
      tabs: tab_keys,
      assessments: assessments)
  end

  def new(conn, _params) do
    changeset = Assessments.build_assessment(%{})
    render(conn, "new.html", changeset: changeset)
  end

  def show(conn, %{"id" => id}) do
    assessment = Assessments.get_assessment_and_questions(id)
    question_changeset = Assessments.build_question(%{})
    render(conn, "show.html",
      assessment: assessment,
      question_changeset: question_changeset)
  end

  def edit(conn, %{"id" => id}) do
    changeset = Assessments.change_assessment(id, %{})
    render(conn, "edit.html", id: id, changeset: changeset)
  end

  def create(conn, %{"assessment" => params}) do
    case Assessments.create_assessment(params) do
      {:ok, _} ->
        conn
        |> put_flash(:info, "Assessment Created!")
        |> redirect(to: admin_assessment_path(conn, :index))
      {:error, changeset} -> render(conn, "new.html", changeset: changeset)
    end
  end

  def update(conn, %{"id" => id, "assessment" => params}) do
    case Assessments.update_assessment(id, params) do
      {:ok, _} -> conn
        |> put_flash(:info, "Assessment updated")
        |> redirect(to: admin_assessment_path(conn, :index))
      {:error, changeset} ->
        render(conn, "edit.html", id: id, changeset: changeset)
    end
  end

  def publish(conn, %{"assessment_id" => id}) do
    case Assessments.publish_assessment(id) do
      {:ok, _} ->
        conn
        |> put_flash(:info, "Assessment published")
        |> redirect(to: admin_assessment_path(conn, :index))
      {:error, _} ->
        conn
        |> redirect(to: admin_assessment_path(conn, :edit, id))
    end
  end

  def submissions(conn, %{"assessment_id" => id}) do
    assessment = Assessments.get_assessment(id)
    submissions = Assessments.submissions_of_assessment(assessment)
    not_attempted = Assessments.students_not_attempted(assessment)
    render(conn, "submissions.html",
      assessment: assessment,
      submissions: submissions,
      not_attempted: not_attempted
    )
  end

  def unsubmit(conn, %{"assessment_id" => aid, "id" => id}) do
    case Assessments.unsubmit_submission(id) do
      {:ok, _} ->
        conn
        |> put_flash(:info, "Assessment un-submitted")
        |> redirect(
             to: admin_assessment_submissions_path(conn, :submissions, aid))
      {:error, reason} ->
        conn
        |> put_flash(:error, reason)
        |> redirect(
             to: admin_assessment_submissions_path(conn, :submissions, aid))
    end
  end

  def edit_grade(conn, %{
    "assessment_id" => assessment_id,
    "id" => submission_id
  }) do
    submission = Assessments.get_submission(submission_id)
    changeset = Assessments.build_grading(submission)
    render(conn, "grading/edit.html", changeset: changeset)
  end

  def update_grade(conn, %{
    "assessment_id" => aid,
    "id" => id,
    "submission" => params
  }) do
    grader = conn.assigns.current_user
    case Assessments.update_grading(id, params, grader) do
      {:ok, _} ->
        conn
        |> put_flash(:info, "Grading successfully updated")
        |> redirect(to:
              admin_assessment_submissions_path(conn, :submissions, aid))
      {:error, changeset} ->
        conn
        |> put_flash(:error, "There are errors in your grading, please try again")
        |> render("grading/edit.html", changeset: changeset)
    end
  end
end
