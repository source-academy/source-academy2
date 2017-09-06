defmodule SourceAcademyWeb.JournalController do
  use SourceAcademyWeb, :controller

  alias SourceAcademy.Assessments

  plug SourceAcademy.Plug.RenderTabs, tab: :journal

  def index(conn, params) do
    type = Map.get(params, "filter", "mission")
      |> :erlang.binary_to_atom(:utf8)
    student = conn.assigns.current_student
    assessments = Assessments.all_open_assessments(type)
    submissions = Assessments.student_submissions(student, assessments)
    conn
    |> assign(:secondary_tab, type)
    |> render("index.html",
        assessments: assessments,
        submissions: submissions)
  end
end
