defmodule SourceAcademyAdmin.PageController do
  use SourceAcademyAdmin, :controller

  alias SourceAcademy.Course
  alias SourceAcademy.Assessments

  def my_student(conn, _params) do
    current_user = conn.assigns.current_user
    students = Course.discussion_group_students(current_user)
    render(conn, "my_student.html", students: students)
  end

  def gradings(conn, params) do
    staff = conn.assigns.current_user
    active_tab = Map.get(params, "tab", "Mine")
    submissions = case active_tab do
      "All" -> Assessments.all_pending_gradings()
      "Mine" -> Assessments.pending_gradings_of(staff)
    end
    render(conn, "gradings.html",
      active_tab: active_tab,
      submissions: submissions)
  end

  def path_submissions(conn, params) do
    render(conn, "path_submissions.html")
  end

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
