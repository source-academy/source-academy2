defmodule SourceAcademyWeb.MaterialController do
  use SourceAcademyWeb, :controller

  alias SourceAcademy.Course

  plug SourceAcademy.Plug.RenderTabs, tab: :materials

  def index(conn, params) do
    materials = Course.all_materials()
      |> Enum.filter(&(&1.is_public))
    categories = Course.all_material_categories()
    render(conn, "index.html",
      categories: categories,
      materials: materials)
  end
end
