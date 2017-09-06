defmodule SourceAcademyWeb.StatusController do
  use SourceAcademyWeb, :controller

  alias SourceAcademy.Course
  alias SourceAcademy.Course.Level

  plug SourceAcademy.Plug.RenderTabs, tab: :status

  def index(conn, _params) do
    student = conn.assigns.current_student
    xp_to_next = Level.xp_to_next(student)
    xp_history = Course.get_student_xp_history(student.id)
    render conn, "index.html",
      xp_to_next: xp_to_next,
      xp_history: xp_history
  end
end
