defmodule SourceAcademyWeb.InboxController do
  use SourceAcademyWeb, :controller

  alias SourceAcademy.Course
  alias SourceAcademy.Assessments

  plug SourceAcademy.Plug.RenderTabs, tab: :inbox

  def index(conn, _params) do
    redirect conn, to: inbox_path(conn, :feed)
  end

  def feed(conn, _params) do
    conn
    |> assign(:secondary_tab, :feed)
    |> render("feed.html")
  end

  def announcements(conn, _params) do
    announcements = Course.all_announcements()
      |> Enum.filter(&(&1.is_published))
    {pinned, unpinned} =
      Enum.split_with(announcements, &(&1.is_pinned))
    conn
    |> assign(:secondary_tab, :announcements)
    |> render("announcements.html",
          pinned_announcements: pinned,
          unpinned_announcements: unpinned)
  end

  def due_soon(conn, _params) do
    # Check all published assessment that due this week
    current_student = conn.assigns.current_student
    assessments = Assessments.assessments_due_soon()
    submissions = Assessments.student_submissions(
      current_student,
      assessments
    )
    conn
    |> assign(:secondary_tab, :due_soon)
    |> render("due_soon.html",
          assessments: assessments,
          submissions: submissions)
  end

  def comments(conn, _params) do
    conn
    |> assign(:secondary_tab, :comments)
    |> render("comments.html")
  end
end
