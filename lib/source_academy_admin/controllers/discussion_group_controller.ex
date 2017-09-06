defmodule SourceAcademyAdmin.DiscussionGroupController do
  use SourceAcademyAdmin, :controller

  alias SourceAcademy.Accounts
  alias SourceAcademy.Course

  def index(conn, _params) do
    discussion_group_changeset = Course.build_discussion_group()
    discussion_groups = Course.all_discussion_groups()
    staffs = Accounts.all_staffs()
    discussion_groups =
      staffs
      |> Enum.map(fn staff ->
        members = Enum.filter(discussion_groups, &(&1.staff_id == staff.id))
        {staff, members}
      end)
    students = Course.students_without_discussion_group()

    render(conn, "index.html",
      students: students,
      changeset: discussion_group_changeset,
      discussion_groups: discussion_groups)
  end

  def create(conn, %{"discussion_group" => %{"user_id" => staff_id, "student_id" => student_id}}) do
    case Course.create_discussion_group(staff_id, student_id) do
      {:ok, _} ->
        redirect(conn, to: admin_discussion_group_path(conn, :index))
      {:error, changeset} ->
        conn
        |> put_flash(:error, "Cannot add student to discussion group")
        |> redirect(to: admin_discussion_group_path(conn, :index))
    end
  end

  def delete(conn, %{"id" => id}) do
    Course.delete_discussion_group(id)
    redirect(conn, to: admin_discussion_group_path(conn, :index))
  end
end
