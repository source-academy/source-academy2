defmodule SourceAcademyApi.AuthController do
  use SourceAcademyApi, :controller

  def unauthenticated(conn, _params) do
    json(conn, %{
      error: true,
      status: "401",
      message: "Unauthenticated"
    })
  end
end
