defmodule SourceAcademyAdmin.AdminController do
  use SourceAcademyAdmin, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
