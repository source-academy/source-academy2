defmodule SourceAcademyApi.CodeController do
  use SourceAcademyApi, :controller
  import Plug.Conn, only: [put_status: 2]

  alias SourceAcademy.Workspace
  alias SourceAcademy.ViewHelpers
  alias SourceAcademy.Repo

  def update(conn, %{"id" => id, "content" => content} = params) do
    current_user = conn.assigns.current_user
    case Workspace.update_history(id, %{content: content}, current_user) do
      {:error, status} ->
        conn
        |> put_status(status)
        |> json(%{ error: status })
      {:ok, history} ->
        old_codes = history.codes
        oldest = nil
        if (Enum.count(old_codes) > 11) do
          oldest = old_codes
          |> Enum.filter(&(&1.title == "history"))
          |> Enum.reduce(nil, &(
            if &2 == nil do
              &1
            else
              if (&1.inserted_at < &2.inserted_at) do
                &1
              else
                &2
              end
            end
          ))
          Repo.delete(oldest)
        end
        old_codes = old_codes
        |> Enum.filter(&(oldest == nil || &1.id != oldest.id))
        |> Enum.filter(&(&1.title == "history"))
        |> Enum.sort(&(&1.inserted_at <= &2.inserted_at))
        |> Enum.sort(&(&1.generated_at <= &2.generated_at))
        |> Enum.map(&(
          %{
            id: &1.id,
            content: &1.content,
            title: &1.title,
            createdAt: ViewHelpers.display_datetime(&1.inserted_at),
            generatedAt: &1.generated_at
          }
        ))
    end
    case Workspace.update_code(id, %{content: content}, current_user) do
      {:error, status} ->
        conn
        |> put_status(status)
        |> json(%{ error: status })
      {:ok, code} ->
        json(conn, %{
          id: code.id,
          content: code.content,
          codeHistory: old_codes,
          savedAt: code.updated_at
        })
    end
  end
end
