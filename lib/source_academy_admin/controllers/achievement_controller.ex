defmodule SourceAcademyAdmin.AchievementController do
  use SourceAcademyAdmin, :controller

  alias SourceAcademy.Course

  def index(conn, _params) do
    achievements = Course.all_achievements()
    render(conn, "index.html", achievements: achievements)
  end

  def new(conn, _params) do
    changeset = conn.assigns[:changeset] || Course.build_achievement(%{})
    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{"achievement" => params}) do
    case Course.create_achievement(params) do
      {:ok, _} ->
        conn
        |> put_flash(:info, "Achievement created successfully.")
        |> redirect(to: admin_achievement_path(conn, :index))
      {:error, changeset} ->
        conn
        |> put_flash(:error, "Error creating achievement")
        |> render("new.html", changeset: changeset)
    end
  end

  def edit(conn, %{"id" => id}) do
    changeset = Course.change_achievement(id, %{})
    render(conn, "edit.html", changeset: changeset)
  end

  def update(conn, %{"id" => id, "achievement" => params}) do
    case Course.update_achievement(id, params) do
      {:ok, _} ->
        conn
        |> put_flash(:info, "Achievement updated successfully.")
        |> redirect(to: admin_achievement_path(conn, :index))
      {:error, changeset} ->
        conn
        |> put_flash(:error, "Error updating achievement")
        |> render("edit.html", changeset: changeset)
    end
  end

  def move_up(conn, %{"id" => id}) do
    case Course.move_achievement_up(id) do
      {:ok, _} -> redirect(conn, to: admin_achievement_path(conn, :index))
      {:error, _} ->
         conn
         |> put_flash(:error, "Error when updating achievement")
         |> redirect(to: admin_achievement_path(conn, :index))
    end
  end

  def move_down(conn, %{"id" => id}) do
    case Course.move_achievement_down(id) do
      {:ok, _} -> redirect(conn, to: admin_achievement_path(conn, :index))
      {:error, _} ->
         conn
         |> put_flash(:error, "Error when updating achievement")
         |> redirect(to: admin_achievement_path(conn, :index))
    end
  end

  def delete(conn, %{"id" => id}) do
    Course.delete_achievement(id)
    conn
    |> put_flash(:info, "Achievement deleted successfully.")
    |> redirect(to: admin_achievement_path(conn, :index))
  end
end
