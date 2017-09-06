defmodule SourceAcademy.Plug.AssignCurrentStudent do
  @moduledoc false
  import Plug.Conn

  alias SourceAcademy.Course

  def init(opts), do: opts

  def call(conn, _opts) do
    current_user = conn.assigns[:current_user]
    if current_user != nil do
      current_student = Course.get_student(current_user)
      assign(conn, :current_student, current_student)
    else
      conn
    end
  end
end
