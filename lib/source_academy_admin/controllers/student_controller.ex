defmodule SourceAcademyAdmin.StudentController do
  use SourceAcademyAdmin, :controller

  alias SourceAcademy.Course

  def index(conn, params) do
    tab = Map.get(params, "tab", "Student")
    students = case tab do
      "Student" -> Course.all_students()
      "Phantom" -> Course.all_phantom_students()
    end
    render(conn, "index.html", active_tab: tab, students: students)
  end

  def show(conn, %{"id" => id}) do
    xp_history_changeset = Course.build_xp_history(%{
      amount: 0,
      reason: ""
    })
    render(conn, "show.html",
      student: Course.get_student(id),
      staff: Course.get_student_staff(id),
      xp_history: Course.get_student_xp_history(id),
      xp_history_changeset: xp_history_changeset)
  end

  def my_student(conn, _params) do
    current_user = conn.assigns.current_user
    students = Course.discussion_group_students(current_user)
    render(conn, "my_student.html", students: students)
  end

  def toggle_phantom(conn, %{"student_id" => student_id}) do
    Course.toggle_phantom_status(student_id)
    redirect(conn, to: admin_student_path(conn, :index))
  end

  def create_xp_history(conn, %{"xp_history" => params, "student_id" => student_id}) do
    giver = conn.assigns.current_user
    case Course.create_xp_history(params, student_id, giver.id) do
      {:ok, _} ->
        conn
        |> put_flash(:info, "XP added successfully")
        |> redirect(to: admin_student_path(conn, :show, student_id))
      {:error, changeset} ->
        conn
        |> put_flash(:error,
            """
              Error adding XP.
              Make sure it is > 0 and does not make the total XP negative
            """)
        |> redirect(to: admin_student_path(conn, :show, student_id))
    end
  end
end
