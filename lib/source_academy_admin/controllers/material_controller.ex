defmodule SourceAcademyAdmin.MaterialController do
  use SourceAcademyAdmin, :controller

  alias SourceAcademy.Course

  def index(conn, _params) do
    categories = Course.all_material_categories()
    materials = Course.all_materials()
    category_changeset = Course.build_material_category(%{})
    render(conn, "index.html",
      materials: materials,
      categories: categories,
      category_changeset: category_changeset)
  end

  def new(conn, _params) do
    changeset = Course.build_material(%{})
    categories = Course.all_material_categories()
    render(conn, "new.html", categories: categories, changeset: changeset)
  end

  def create(conn, %{"material" => params}) do
    uploader = conn.assigns.current_user
    category_id = params["category_id"]
    case Course.create_material(params, uploader, category_id) do
      {:ok, _} -> redirect(conn, to: admin_material_path(conn, :index))
      {:error, changeset} ->
        categories = Course.all_material_categories()
        conn
        |> put_flash(:error, "Error uploading material")
        |> render("new.html", categories: categories, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    Course.delete_material(id)
    redirect(conn, to: admin_material_path(conn, :index))
  end

  def create_category(conn, %{"material_category" => params}) do
    case Course.create_material_category(params) do
      {:ok, _} -> redirect(conn, to: admin_material_path(conn, :index))
      {:error, changeset} ->
         conn
         |> put_flash(:error, "Please input a category name")
         |> redirect(to: admin_material_path(conn, :index))
    end
  end

  def delete_category(conn, %{"category_id" => id}) do
    Course.delete_material_category(id)
    redirect(conn, to: admin_material_path(conn, :index))
  end
end
