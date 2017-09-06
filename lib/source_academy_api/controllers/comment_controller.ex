defmodule SourceAcademyApi.CommentController do
  use SourceAcademyApi, :controller

  import SourceAcademy.ViewHelpers,
    only: [display_name: 1, display_datetime: 1]

  alias SourceAcademy.Workspace

  def create(conn, %{"code_id" => code_id, "content" => content} = params) do
    current_user = conn.assigns.current_user
    comment = Workspace.create_comment(params, current_user, code_id)
    json(conn, %{
      id: comment.id,
      content: comment.content,
      posterName: display_name(comment.poster),
      createdAt: display_datetime(comment.inserted_at)
    })
  end
end
