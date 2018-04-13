defmodule SourceAcademyApi.CodeController do
  use SourceAcademyApi, :controller
  import Plug.Conn, only: [put_status: 2]

  alias SourceAcademy.Workspace

  def update(conn, %{"id" => id, "content" => content} = params) do
    current_user = conn.assigns.current_user
    case Workspace.update_code(id, %{content: content}, current_user) do
      {:error, status} ->
        conn
        |> put_status(status)
        |> json(%{ error: status })
      {:ok, code} ->
        json(conn, %{
          id: code.id,
          content: code.content,
          savedAt: code.updated_at
        })
    end
  end
end
