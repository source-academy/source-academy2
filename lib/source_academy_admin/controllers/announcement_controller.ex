defmodule SourceAcademyAdmin.AnnouncementController do
  use SourceAcademyAdmin, :controller

  alias SourceAcademy.Course

  def index(conn, _params) do
    render(conn, "index.html", announcements: Course.all_announcements())
  end

  def new(conn, _params) do
    changeset = Course.build_announcement()
    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{"announcement" => params}) do
    poster = conn.assigns.current_user
    case Course.create_announcement(params, poster) do
      {:ok, _} ->
        conn
        |> put_flash(:info, "Announcement posted")
        |> redirect(to: admin_announcement_path(conn, :index))
      {:error, changeset} ->
        conn
        |> put_flash(:error, "Error creating announcement")
        |> render("new.html", changeset: changeset)
    end
  end

  def update(conn, %{"id" => id, "announcement" => params}) do
    case Course.update_announcement(id, params) do
      {:ok, announcement} -> finish_editing(conn, announcement)
      {:error, _} -> error_updating(conn)
    end
  end

  def edit(conn, %{"id" => id}) do
    changeset = Course.change_announcement(id)
    render(conn, "edit.html", changeset: changeset)
  end

  def toggle_pin(conn, %{"announcement_id" => id}) do
    case Course.toggle_announcement_pinned(id) do
      {:ok, announcement} -> finish_editing(conn, announcement)
      {:error, _} -> error_updating(conn)
    end
  end

  def toggle_publish(conn, %{"announcement_id" => id}) do
    case Course.toggle_announcement_published(id) do
      {:ok, announcement} -> finish_editing(conn, announcement)
      {:error, _} -> error_updating(conn)
    end
  end

  defp finish_editing(conn, announcement) do
    conn
    |> put_flash(:info, announcement.title <> " updated.")
    |> redirect(to: admin_announcement_path(conn, :index))
  end

  defp error_updating(conn) do
    conn
    |> put_flash(:error, "Error updating announcement.")
    |> redirect(to: admin_announcement_path(conn, :index))
  end
end
