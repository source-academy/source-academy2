defmodule SourceAcademyApi.LibraryView do
  use SourceAcademyApi, :view

  def render("index.json", %{libraries: libraries}) do
    render_many(libraries, __MODULE__, "library.json")
  end

  def render("library.json", %{library: library}) do
    %{
      id: library.id,
      title: library.title,
      json: library.json
    }
  end
end
