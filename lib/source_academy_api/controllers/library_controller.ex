defmodule SourceAcademyApi.LibraryController do
  use SourceAcademyApi, :controller

  alias SourceAcademy.Workspace

  def index(conn, _params) do
    libraries = Workspace.all_libraries()
    render(conn, "index.json", libraries: libraries)
  end
end
