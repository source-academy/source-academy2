defmodule SourceAcademyAdmin.LibraryController do
  use SourceAcademyAdmin, :controller

  alias SourceAcademy.Workspace

  def index(conn, _params) do
    libraries = Workspace.all_libraries()
    render(conn, "index.html", libraries: libraries)
  end

  def new(conn, _params) do
    changeset = Workspace.build_library(%{})
    render(conn, "new.html", changeset: changeset)
  end

  def edit(conn, %{"id" => id}) do
    changeset = Workspace.change_library(id)
    render(conn, "edit.html", changeset: changeset)
  end

  def create(conn, %{"library" => params}) do
    case Workspace.create_library(params) do
      {:ok, _} ->
        conn
        |> put_flash(:info, "Library created and activated in playground")
        |> redirect(to: admin_library_path(conn, :index))
      {:error, changeset} ->
        conn
        |> put_flash(:error, "Error creating library")
        |> render("new.html", changeset: changeset)
    end
  end

  def update(conn, %{"id" => id, "library" => params}) do
    case Workspace.update_library(id, params) do
      {:ok, _} ->
        conn
        |> put_flash(:info, "Library updated")
        |> redirect(to: admin_library_path(conn, :index))
      {:error, changeset} ->
        conn
        |> put_flash(:error, "Error updating library")
        |> render("edit.html", changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    Workspace.delete_library(id)
    redirect(conn, to: admin_library_path(conn, :index))
  end
end
